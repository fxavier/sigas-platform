// middleware.ts
import { authMiddleware } from '@clerk/nextjs';
import { NextResponse, NextRequest } from 'next/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhook(.*)',
    '/custom-404',
    '/_not-found',
  ],
  afterAuth(auth, req: NextRequest) {
    // Handle the 404 case first
    if (req.nextUrl.pathname === '/_not-found') {
      return NextResponse.redirect(new URL('/custom-404', req.url));
    }

    // If the user is not signed in and the route is not public, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
