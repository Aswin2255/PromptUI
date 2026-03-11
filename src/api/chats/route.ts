import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return NextResponse.json(
      { err: 'unexpected error occured' },
      { status: 500 },
    );
  }
}
