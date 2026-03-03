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
