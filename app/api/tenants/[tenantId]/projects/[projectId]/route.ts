// app/api/tenants/[tenantId]/projects/[projectId]/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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

    // Get the project
    const project = await db.project.findUnique({
      where: {
        id: params.projectId,
        tenantId: params.tenantId,
      },
      include: {
        userProjects: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[PROJECT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tenantId: string; projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name && !description) {
      return new NextResponse('Name or description is required', {
        status: 400,
      });
    }

    // Check if the user is authorized to update this project
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can update projects
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if the project exists
    const existingProject = await db.project.findUnique({
      where: {
        id: params.projectId,
        tenantId: params.tenantId,
      },
    });

    if (!existingProject) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // If name is changing, check for uniqueness
    if (name && name !== existingProject.name) {
      const projectWithSameName = await db.project.findFirst({
        where: {
          name,
          tenantId: params.tenantId,
          id: {
            not: params.projectId,
          },
        },
      });

      if (projectWithSameName) {
        return new NextResponse('Project with this name already exists', {
          status: 400,
        });
      }
    }

    // Update the project
    const updatedProject = await db.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        name: name || existingProject.name,
        description: description || existingProject.description,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('[PROJECT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tenantId: string; projectId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user is authorized to delete this project
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins can delete projects
    if (currentUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete the project
    await db.project.delete({
      where: {
        id: params.projectId,
        tenantId: params.tenantId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PROJECT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
