// app/api/tenants/[tenantId]/invitations/[token]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(
  req: Request,
  { params }: { params: { tenantId: string; token: string } }
) {
  try {
    // Check if the invitation exists and is valid
    const invitation = await db.userInvitation.findFirst({
      where: {
        token: params.token,
        tenantId: params.tenantId,
        isAccepted: false,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        tenant: true,
      },
    });

    if (!invitation) {
      return new NextResponse('Invitation not found or expired', {
        status: 404,
      });
    }

    // Return the invitation details (for the invitation accept page)
    return NextResponse.json({
      email: invitation.email,
      tenantName: invitation.tenant.name,
      role: invitation.role,
    });
  } catch (error) {
    console.error('[INVITATION_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { tenantId: string; token: string } }
) {
  try {
    // Check if the invitation exists and is valid
    const invitation = await db.userInvitation.findFirst({
      where: {
        token: params.token,
        tenantId: params.tenantId,
        isAccepted: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!invitation) {
      return new NextResponse('Invitation not found or expired', {
        status: 404,
      });
    }

    // Mark the invitation as accepted
    await db.userInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        isAccepted: true,
      },
    });

    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Invitation accepted successfully',
    });
  } catch (error) {
    console.error('[INVITATION_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
