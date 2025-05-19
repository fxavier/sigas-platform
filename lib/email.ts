// lib/email.ts
import nodemailer from 'nodemailer';

interface SendInvitationEmailParams {
  email: string;
  invitedBy: string;
  tenantName: string;
  token: string;
}

export async function sendInvitationEmail({
  email,
  invitedBy,
  tenantName,
  token,
}: SendInvitationEmailParams) {
  // Create a testing account if running in development
  const testAccount =
    process.env.NODE_ENV !== 'production'
      ? await nodemailer.createTestAccount()
      : null;

  // Create a transporter - configure with your email service
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER || testAccount?.user,
      pass: process.env.EMAIL_SERVER_PASSWORD || testAccount?.pass,
    },
  });

  // Generate the invitation URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const invitationUrl = `${baseUrl}/invitation/${token}?tenantId=${encodeURIComponent(
    tenantName.toLowerCase().replace(/\s+/g, '-')
  )}`;

  // Send the email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
    to: email,
    subject: `You've been invited to join ${tenantName}`,
    text: `
Hello,

You've been invited by ${invitedBy} to join ${tenantName} as a team member.

Click the link below to accept the invitation:
${invitationUrl}

This invitation will expire in 48 hours.

Regards,
Your App Team
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">You've been invited to join ${tenantName}</h2>
  <p>Hello,</p>
  <p>You've been invited by <strong>${invitedBy}</strong> to join <strong>${tenantName}</strong> as a team member.</p>
  <p style="margin: 25px 0;">
    <a href="${invitationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
  </p>
  <p style="color: #666; font-size: 14px;">This invitation will expire in 48 hours.</p>
  <p>Regards,<br>Your App Team</p>
</div>
    `,
  });

  // Log test email URL if in development
  if (testAccount) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
}

// For development and testing purposes
export async function testEmailSetup() {
  try {
    const testAccount = await nodemailer.createTestAccount();

    console.log('Test account created:', {
      user: testAccount.user,
      pass: testAccount.pass,
      smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
      },
    });

    return testAccount;
  } catch (error) {
    console.error('Error creating test email account:', error);
    throw error;
  }
}
