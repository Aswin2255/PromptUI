import { NextRequest, NextResponse } from 'next/server';
import { getCurrentuser } from './app/(auth)/core/getUser';

const privateRoutes = ['/', '/dashboard'];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
}

async function middlewareAuth(request: NextRequest) {
  if (privateRoutes.includes(request.nextUrl.pathname)) {
    const userDetails = await getCurrentuser();
    if (!userDetails) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
