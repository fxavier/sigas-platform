// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Extract tenant from path
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);

  // If path includes tenant slug (e.g., /tenants/[slug]/...)
  if (pathSegments[0] === 'tenants' && pathSegments.length > 1) {
    const tenantSlug = pathSegments[1];

    // Check tenant access in the API routes instead of middleware
    // Just let the request through, and we'll check permissions in the route handlers

    // For dashboard page, redirect to tenant selection if no tenant is specified
    if (pathSegments.length === 1) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next|favicon.ico).*)', '/', '/(api|trpc)(.*)'],
};
