// app/api/tenants/available/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find all tenants the user doesn't belong to
    const tenants = await db.tenant.findMany({
      where: {
        users: {
          none: {
            clerkUserId: userId,
          },
        },
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('[AVAILABLE_TENANTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
