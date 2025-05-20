// api/users/assign-tenant/route.ts
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { tenantId } = await req.json();

    if (!tenantId) {
      return new NextResponse('TenantId é obrigatório', { status: 400 });
    }

    // Check if tenant exists
    const tenant = await db.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) {
      return new NextResponse('Tenant não encontrado', { status: 404 });
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (existingUser) {
      // Update the user's tenant
      const updatedUser = await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          tenantId: tenant.id,
        },
      });

      return NextResponse.json(updatedUser);
    } else {
      // Create a new user with the assigned tenant
      const newUser = await db.user.create({
        data: {
          clerkUserId: userId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
          imageUrl: user.imageUrl,
          role: 'ADMIN', // Default role for a new user
          tenantId: tenant.id,
        },
      });

      return NextResponse.json(newUser);
    }
  } catch (error) {
    console.error('[ASSIGN_TENANT_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
