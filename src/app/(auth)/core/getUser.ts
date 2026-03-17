'use server';
import { cookies } from 'next/headers';

export async function getCurrentuser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) return null;
    return sessionId;
  } catch {
    return null;
  }
}

export async function userlogout() {
  const cookieStore = await cookies();

  cookieStore.delete('session_id');
}
