import { NextRequest, NextResponse } from 'next/server';

export function POST(req: NextRequest) {
  try {
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return NextResponse.json(
      { err: 'unexpected error occured' },
      { status: 500 },
    );
  }
}
