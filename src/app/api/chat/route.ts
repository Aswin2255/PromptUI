import { generateUid } from '@/lib/idgenerator';
import { Chat } from '@/lib/models/Chathistory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model, aiResposne, total_duration } = body;
    if (!model || !aiResposne || !total_duration) {
      return NextResponse.json({ err: 'Invalid input' }, { status: 400 });
    }
    const individualChatId = generateUid();
    const chatsessionId = generateUid();
    const newChat = new Chat({
      chatsessionId: chatsessionId,
      chat_message_id: individualChatId,
      role: 'ai',
      model: model,
      duration: total_duration,
      content: aiResposne,
      parrent_chatid: '',
    });
    await newChat.save();
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
