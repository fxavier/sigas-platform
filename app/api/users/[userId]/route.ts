// app/api/users/[userId]/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: targetUserId } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !['ADMIN', 'MANAGER', 'USER'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    // Get the user to update
    const userToUpdate = await db.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!userToUpdate) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get the current user
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: userToUpdate.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins can change roles
    if (currentUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Don't allow changing the last admin's role
    if (userToUpdate.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await db.user.count({
        where: {
          tenantId: userToUpdate.tenantId,
          role: 'ADMIN',
        },
      });

      if (adminCount <= 1) {
        return new NextResponse('Cannot change role of the last admin', {
          status: 400,
        });
      }
    }

    const updatedUser = await db.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[USER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: targetUserId } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the user to delete
    const userToDelete = await db.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!userToDelete) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get the current user
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: userToDelete.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins can delete users
    if (currentUser.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Don't allow deleting self
    if (userToDelete.id === currentUser.id) {
      return new NextResponse('Cannot delete yourself', { status: 400 });
    }

    // Don't allow deleting the last admin
    if (userToDelete.role === 'ADMIN') {
      const adminCount = await db.user.count({
        where: {
          tenantId: userToDelete.tenantId,
          role: 'ADMIN',
        },
      });

      if (adminCount <= 1) {
        return new NextResponse('Cannot delete the last admin', {
          status: 400,
        });
      }
    }

    // Delete the user
    await db.user.delete({
      where: {
        id: targetUserId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[USER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
