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
      return new NextResponse('Nome e slug são obrigatórios', { status: 400 });
    }

    // Check if slug is already taken
    const existingTenant = await db.tenant.findUnique({
      where: {
        slug,
      },
    });

    if (existingTenant) {
      return new NextResponse('Este slug já está em uso', { status: 400 });
    }

    // Create the tenant without associating it with a user
    const tenant = await db.tenant.create({
      data: {
        name,
        slug,
        description: description || `${name} organization`,
      },
    });

    // Don't create a new user record, just return the created tenant
    return NextResponse.json(tenant);
  } catch (error) {
    console.error('[TENANTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all tenants from the database
    const tenants = await db.tenant.findMany();

    // Return all tenants, not just those associated with the user
    return NextResponse.json(tenants);
  } catch (error) {
    console.error('[TENANTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
