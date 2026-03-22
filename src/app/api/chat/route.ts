import { Chat } from '@/lib/models/Chathistory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, aiResponse, total_duration, randomid, userMsg } = body;
    if (!model || !aiResponse || !total_duration || !randomid || !userMsg) {
      return NextResponse.json(
        { err: 'Invalid input parametes' },
        { status: 400 },
      );
    }
    const newuserChat = new Chat({
      chatsession_id: randomid,
      role: 'user',
      model: model,
      duration: total_duration,
      content: userMsg,
    });
    const newChat = new Chat({
      chatsession_id: randomid,
      role: 'ai',
      model: model,
      duration: total_duration,
      content: aiResponse,
    });
    await newChat.save();
    await newuserChat.save();
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
    const getallMessage = await Chat.find();
    return NextResponse.json(
      {
        status: true,
        chathistory: getallMessage,
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
