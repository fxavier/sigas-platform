// middleware.ts
import { clerkMiddleware, auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

const isPublicRoute = (path: string) => {
  return [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhook(.*)',
    '/custom-404',
  ].some((pattern) => new RegExp(`^${pattern}$`).test(path));
};

export default clerkMiddleware(async (_, req: NextRequest) => {
  // Handle the 404 case first
  if (req.nextUrl.pathname === '/_not-found') {
    return NextResponse.rewrite(new URL('/custom-404', req.url));
  }

  // Allow public routes
  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Extract tenant from path
  const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);

  // If path includes tenant slug (e.g., /tenants/[slug]/...)
  if (pathSegments[0] === 'tenants' && pathSegments.length > 1) {
    const tenantSlug = pathSegments[1];

    // For dashboard page, redirect to tenant selection if no tenant is specified
    if (pathSegments.length === 1) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next|favicon.ico).*)',
    '/',
    '/(api|trpc)(.*)',
    '/_not-found',
  ],
};
