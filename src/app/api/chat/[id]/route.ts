import { Chat } from '@/lib/models/Chathistory';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const messages = await Chat.find({ chatsession_id: id });

    if (!messages.length) {
      return NextResponse.json(
        { err: 'No chat found for this ID' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: true, chathistory: messages },
      { status: 200 },
    );
  } catch (error) {
    console.error('[/api/chat/[id]] GET Error:', error);
    return NextResponse.json(
      { err: 'Unexpected error occurred' },
      { status: 500 },
    );
  }
}
