import User from '@/lib/models/User';
import redisClient from '@/lib/redisClient';
import crypto from 'crypto';
import { cookies } from 'next/headers';
const COOKIE_EXPIRES = 60 * 60 * 24 * 7;
export async function createUsersession(userid: string) {
  const sessionId = crypto.randomBytes(512).toString('hex');
  redisClient.set(`session:${sessionId}`, userid, 'EX', COOKIE_EXPIRES);
  setCookie(sessionId);
}

export async function setCookie(sessionid: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('session_id', sessionid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    console.log('cookie set...');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getuserFromSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) return null;
    const userId = await redisClient.get(`session:${sessionId}`);
    if (!userId) return null;
    const userdetails = await User.findById(userId);
    if (!userdetails) return null;
    return userdetails;
  } catch {
    return null;
  }
}
