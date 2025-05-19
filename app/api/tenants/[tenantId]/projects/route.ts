// app/api/tenants/[tenantId]/projects/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user is authorized to access this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
      include: {
        userProjects: true,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get all projects or only assigned projects based on role
    let projects;

    if (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') {
      // Admins and managers can see all projects
      projects = await db.project.findMany({
        where: {
          tenantId: params.tenantId,
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          tenantId: true,
          _count: {
            select: {
              userProjects: true,
            },
          },
        },
      });

      console.log(`Found ${projects.length} projects for admin/manager`);
    } else {
      // Regular users can only see projects they're assigned to
      const projectIds = currentUser.userProjects.map((up) => up.projectId);

      projects = await db.project.findMany({
        where: {
          id: {
            in: projectIds,
          },
          tenantId: params.tenantId,
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          tenantId: true,
          _count: {
            select: {
              userProjects: true,
            },
          },
        },
      });

      console.log(
        `Found ${projects.length} assigned projects for regular user`
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[PROJECTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name || !description) {
      return new NextResponse('Name and description are required', {
        status: 400,
      });
    }

    // Check if the user is authorized to create projects in this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can create projects
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if a project with the same name already exists in this tenant
    const existingProject = await db.project.findFirst({
      where: {
        name,
        tenantId: params.tenantId,
      },
    });

    if (existingProject) {
      return new NextResponse('Project with this name already exists', {
        status: 400,
      });
    }

    // Create the project
    const project = await db.project.create({
      data: {
        name,
        description,
        tenantId: params.tenantId,
      },
    });

    // Automatically assign the creator to the project
    await db.userProject.create({
      data: {
        userId: currentUser.id,
        projectId: project.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
