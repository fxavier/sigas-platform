// app/api/tenants/[slug]/check-access/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    // Check if user belongs to this tenant
    const user = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenant: {
          slug: params.slug,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }

    return NextResponse.json({
      hasAccess: true,
      user,
      tenantId: user.tenantId,
      role: user.role,
    });
  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json(
      { hasAccess: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
