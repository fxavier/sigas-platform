// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  '/custom-404',
  '/_not-found',
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle the 404 case first
  if (req.nextUrl.pathname === '/_not-found') {
    return NextResponse.redirect(new URL('/custom-404', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
