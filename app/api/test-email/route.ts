// app/api/test-email/route.ts (for development only, remove in production)
import { NextResponse } from 'next/server';
import { testEmailSetup, sendInvitationEmail } from '@/lib/email';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const testAccount = await testEmailSetup();

    // Send a test invitation email
    const info = await sendInvitationEmail({
      email: 'test@example.com',
      invitedBy: 'Admin User',
      tenantName: 'Test Organization',
      token: 'test-token-123',
    });

    return NextResponse.json({
      success: true,
      testAccount,
      emailInfo: {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
      },
    });
  } catch (error: unknown) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
