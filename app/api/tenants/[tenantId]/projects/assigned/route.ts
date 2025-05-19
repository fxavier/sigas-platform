// app/api/tenants/[tenantId]/projects/assigned/route.ts
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

    // Get the current user
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log(`Getting assigned projects for user: ${currentUser.id}`);

    // For admins and managers, return all projects
    if (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') {
      const allProjects = await db.project.findMany({
        where: {
          tenantId: params.tenantId,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log(`Found ${allProjects.length} projects for admin/manager`);
      return NextResponse.json(allProjects);
    }

    // For regular users, get only assigned projects
    // First, get all UserProject records for this user
    const userProjects = await db.userProject.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(`Found ${userProjects.length} UserProject records`);

    // Extract just the project data
    const assignedProjects = userProjects.map((up) => up.project);

    console.log(`Returning ${assignedProjects.length} assigned projects`);
    return NextResponse.json(assignedProjects);
  } catch (error) {
    console.error('[ASSIGNED_PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
