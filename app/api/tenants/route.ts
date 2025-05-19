// app/api/tenants/route.ts
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

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return new NextResponse('Name and slug are required', { status: 400 });
    }

    // Check if slug is already taken
    const existingTenant = await db.tenant.findUnique({
      where: {
        slug,
      },
    });

    if (existingTenant) {
      return new NextResponse('Slug is already taken', { status: 400 });
    }

    // Create the tenant
    const tenant = await db.tenant.create({
      data: {
        name,
        slug,
        description: description || `${name} organization`,
      },
    });

    // Create the user as an admin of the tenant
    const dbUser = await db.user.create({
      data: {
        clerkUserId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        imageUrl: user.imageUrl,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error('[TENANTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Get the list of tenants the current user has access to
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find all tenants the user has access to
    const userWithTenants = await db.user.findMany({
      where: {
        clerkUserId: userId,
      },
      include: {
        tenant: true,
      },
    });

    const tenants = userWithTenants.map((user) => user.tenant);

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('[TENANTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
