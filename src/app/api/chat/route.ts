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
    const newChat = new Chat({});
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return NextResponse.json(
      { err: 'unexpected error occured' },
      { status: 500 },
    );
  }
}
