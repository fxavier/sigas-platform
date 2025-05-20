// app/api/users/[userId]/projects/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Get projects assigned to a specific user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the requester is authorized (admin/manager or self)
    const requester = await db.user.findFirst({
      where: {
        clerkUserId,
      },
    });

    if (!requester) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins, managers, or the user themselves can view their projects
    const isAdminOrManager =
      requester.role === 'ADMIN' || requester.role === 'MANAGER';
    const isSelf = requester.id === params.userId;

    if (!isAdminOrManager && !isSelf) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get user's assigned projects
    const userProjects = await db.userProject.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        project: true,
      },
    });

    // Return just the project data
    const projects = userProjects.map((up) => up.project);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[USER_PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Update project assignments for a user
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { projectIds } = await req.json();

    if (!projectIds || !Array.isArray(projectIds)) {
      return new NextResponse('Project IDs are required', { status: 400 });
    }

    // Check if the requester is authorized
    const requester = await db.user.findFirst({
      where: {
        clerkUserId,
      },
    });

    if (!requester) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins or managers can update project assignments
    if (requester.role !== 'ADMIN' && requester.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get user's current project assignments
    const currentAssignments = await db.userProject.findMany({
      where: {
        userId: params.userId,
      },
    });

    const currentProjectIds = currentAssignments.map((a) => a.projectId);

    // Determine which projects to add and which to remove
    const projectsToAdd = projectIds.filter(
      (id) => !currentProjectIds.includes(id)
    );
    const projectsToRemove = currentProjectIds.filter(
      (id) => !projectIds.includes(id)
    );

    // Add new assignments
    if (projectsToAdd.length > 0) {
      await Promise.all(
        projectsToAdd.map((projectId) =>
          db.userProject.create({
            data: {
              userId: params.userId,
              projectId,
            },
          })
        )
      );
    }

    // Remove old assignments
    if (projectsToRemove.length > 0) {
      await Promise.all(
        projectsToRemove.map((projectId) =>
          db.userProject.deleteMany({
            where: {
              userId: params.userId,
              projectId,
            },
          })
        )
      );
    }

    return NextResponse.json({
      message: 'Project assignments updated successfully',
      added: projectsToAdd.length,
      removed: projectsToRemove.length,
    });
  } catch (error) {
    console.error('[USER_PROJECTS_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
