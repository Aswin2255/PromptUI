import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { generateSalt, hashedPassword } from '@/app/(auth)/core/passwordHasher';
import { createUsersession } from '@/app/(auth)/core/session';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code)
    return NextResponse.redirect(new URL('/login?error=no_code', req.url));

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    const userRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );
    const googleUser = await userRes.json();

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      const salt = generateSalt();
      const randomPassword = Math.random().toString(36);
      const passwordHashed = await hashedPassword(randomPassword, salt);

      user = new User({
        username: googleUser.name,
        email: googleUser.email,
        password: passwordHashed,
        salt: salt,
        googleId: googleUser.id,
        picture: googleUser.picture,
        typeoflogin: 'google',
      });

      await user.save();
    }

    await createUsersession(user._id);

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(
      new URL('/login?error=google_failed', req.url),
    );
  }
}
