// app/api/tenants/[tenantId]/join/route.ts
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params: { tenantId } }: { params: { tenantId: string } }
) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if tenant exists
    const tenant = await db.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // Check if user already belongs to this tenant
    const existingUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId,
      },
    });

    if (existingUser) {
      return new NextResponse('You already belong to this organization', {
        status: 400,
      });
    }

    // Add user to tenant with USER role
    await db.user.create({
      data: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        imageUrl: user.imageUrl,
        role: 'USER', // Regular users join as USER role
        tenantId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[JOIN_TENANT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
