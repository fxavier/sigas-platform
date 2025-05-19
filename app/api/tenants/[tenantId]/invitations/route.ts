// app/api/tenants/[tenantId]/invitations/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { sendInvitationEmail } from '@/lib/email';

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user is authorized to view invitations for this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins and managers can view invitations
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const invitations = await db.userInvitation.findMany({
      where: {
        tenantId: params.tenantId,
        isAccepted: false,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('[INVITATIONS_GET]', error);
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

    const { email, role } = await req.json();

    if (!email || !role || !['ADMIN', 'MANAGER', 'USER'].includes(role)) {
      return new NextResponse('Email and valid role are required', {
        status: 400,
      });
    }

    // Check if the user is authorized to invite users to this tenant
    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
        tenantId: params.tenantId,
      },
    });

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only admins can invite other admins
    if (role === 'ADMIN' && currentUser.role !== 'ADMIN') {
      return new NextResponse('Only admins can invite other admins', {
        status: 403,
      });
    }

    // Only admins and managers can invite users
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if the email is already associated with a user in this tenant
    const existingUser = await db.user.findFirst({
      where: {
        email,
        tenantId: params.tenantId,
      },
    });

    if (existingUser) {
      return new NextResponse('User already exists in this tenant', {
        status: 400,
      });
    }

    // Check if there's an active invitation for this email
    const existingInvitation = await db.userInvitation.findFirst({
      where: {
        email,
        tenantId: params.tenantId,
        isAccepted: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return new NextResponse('Invitation already sent to this email', {
        status: 400,
      });
    }

    // Get tenant info for the invitation email
    const tenant = await db.tenant.findUnique({
      where: {
        id: params.tenantId,
      },
    });

    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 });
    }

    // Create a new invitation with a unique token and expiration date (48 hours)
    const token = randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 48);

    const invitation = await db.userInvitation.create({
      data: {
        email,
        role,
        token,
        expires,
        tenantId: params.tenantId,
      },
    });

    // Send the invitation email
    await sendInvitationEmail({
      email,
      invitedBy: currentUser.name || currentUser.email,
      tenantName: tenant.name,
      token,
    });

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('[INVITATIONS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
