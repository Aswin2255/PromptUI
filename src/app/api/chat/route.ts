import { Chat } from '@/lib/models/Chat';
import User from '@/lib/models/User';
import { Userchat } from '@/lib/models/UserChat';
import redisClient from '@/lib/redisClient';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      model,
      aiResponse,
      total_duration,
      randomid,
      userMsg,
      userdetails,
    } = body;

    const userId = await redisClient.get(`session:${userdetails}`);
    if (!userId) {
      return NextResponse.json({ err: 'Invalid request' }, { status: 400 });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return NextResponse.json({ err: 'Invalid request' }, { status: 400 });
    }

    // Create chat with user + ai message
    const history = [
      {
        role: 'user',
        message: userMsg,
      },
      {
        role: 'ai',
        message: aiResponse,
        model: model,
        duration: total_duration,
      },
    ];

    const newChat = new Chat({
      chatsession_id: randomid,
      user_id: userDetails?._id,
      history: history,
    });

    await newChat.save();

    // Add to sidebar
    const existingUserChat = await Userchat.findOne({
      user_id: userDetails._id,
    });

    if (!existingUserChat) {
      await Userchat.create({
        user_id: userDetails._id,
        chats: [
          {
            _id: randomid,
            title: userMsg.substring(0, 30),
          },
        ],
      });
    } else {
      await Userchat.updateOne(
        { user_id: userDetails._id },
        {
          $push: {
            chats: {
              _id: randomid,
              title: userMsg.substring(0, 30),
            },
          },
        },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ err: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    const userId = await redisClient.get(`session:${sessionId}`);
    if (!userId) {
      return NextResponse.json({ err: 'Invalid request' }, { status: 400 });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return NextResponse.json({ err: 'Invalid request' }, { status: 400 });
    }
    const userchatHistory = await Userchat.find({ user_id: userDetails._id });
    return NextResponse.json({
      status: true,
      chathistory: userchatHistory,
      message: 'Chat history retrieved successfully',
    });
  } catch (error) {
    console.error('[/api/chat] GET Error:', error);
    return NextResponse.json(
      { er: 'unexpected error occured' },
      { status: 500 },
    );
  }
}
