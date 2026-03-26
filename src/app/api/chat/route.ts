import { Chat } from '@/lib/models/Chat';
import User from '@/lib/models/User';
import redisClient from '@/lib/redisClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    if (!model || !aiResponse || !total_duration || !randomid || !userMsg) {
      return NextResponse.json(
        { err: 'Invalid input parametes' },
        { status: 400 },
      );
    }

    const existingChat = await User.findOne({ user_id: userDetails._id });

    console.log(existingChat);

    return NextResponse.json(
      { success: true, message: 'Chat Saved Successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[/api/chat] POST Error:', error);
    return NextResponse.json(
      { err: 'unexpected error occured' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(
      {
        status: true,

        message: 'Message fetched sucessfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[/api/chat] GET Error:', error);
    return NextResponse.json(
      { er: 'unexpected error occured' },
      { status: 500 },
    );
  }
}
