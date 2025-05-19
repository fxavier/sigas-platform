// app/api/tenants/[tenantId]/users/available/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { tenantId } = params;
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return new NextResponse('Project ID is required', { status: 400 });
    }

    // Check if the user is authorized to access this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can view available users
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get all users in this tenant who are not yet assigned to this project
    const availableUsers = await db.user.findMany({
      where: {
        tenantId,
        userProjects: {
          none: {
            projectId,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error('[AVAILABLE_USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
