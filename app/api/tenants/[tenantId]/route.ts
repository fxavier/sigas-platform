// app/api/tenants/[tenantId]/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // Check if the user is authorized to update this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins can update tenant settings
    if (currentUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update the tenant
    const updatedTenant = await db.tenant.update({
      where: {
        id: tenantId,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error('[TENANT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
