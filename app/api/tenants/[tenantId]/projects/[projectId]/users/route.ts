// app/api/tenants/[tenantId]/projects/[projectId]/users/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string; projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user is authorized to access this project
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user has access to the project
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      const userProject = await db.userProject.findFirst({
        where: {
          userId: currentUser.id,
          projectId: params.projectId,
        },
      });

      if (!userProject) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // Get all users assigned to this project
    const userProjects = await db.userProject.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        user: true,
      },
    });

    console.log(
      `Found ${userProjects.length} users assigned to project ${params.projectId}`
    );

    return NextResponse.json(userProjects.map((up) => up.user));
  } catch (error) {
    console.error('[PROJECT_USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { tenantId: string; projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse('User IDs are required', { status: 400 });
    }

    // Check if the user is authorized to manage this project
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can assign users to projects
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if the project exists
    const project = await db.project.findUnique({
      where: {
        id: params.projectId,
        tenantId: params.tenantId,
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    console.log(
      `Assigning users ${userIds.join(', ')} to project ${params.projectId}`
    );

    // Create assignments for each user
    const assignments = await Promise.all(
      userIds.map(async (userId: string) => {
        try {
          // Check if assignment already exists
          const existing = await db.userProject.findUnique({
            where: {
              userId_projectId: {
                userId,
                projectId: params.projectId,
              },
            },
          });

          if (existing) {
            console.log(
              `User ${userId} already assigned to project ${params.projectId}`
            );
            return existing;
          }

          // Create new assignment
          const newAssignment = await db.userProject.create({
            data: {
              userId,
              projectId: params.projectId,
            },
          });

          console.log(
            `Created new assignment for user ${userId} to project ${params.projectId}`
          );
          return newAssignment;
        } catch (error) {
          console.error(
            `Error assigning user ${userId} to project ${params.projectId}:`,
            error
          );
          throw error;
        }
      })
    );

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('[PROJECT_USERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
