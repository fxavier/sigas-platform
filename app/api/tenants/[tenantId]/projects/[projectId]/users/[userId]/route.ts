// app/api/tenants/[tenantId]/projects/[projectId]/users/[userId]/route.ts (continued)
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { tenantId: string; projectId: string; userId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user is authorized to manage this project
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can remove users from projects
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if the assignment exists
    const userProject = await db.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: params.userId,
          projectId: params.projectId,
        },
      },
    });

    if (!userProject) {
      return new NextResponse('User is not assigned to this project', {
        status: 404,
      });
    }

    // Delete the assignment
    await db.userProject.delete({
      where: {
        userId_projectId: {
          userId: params.userId,
          projectId: params.projectId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PROJECT_USER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
