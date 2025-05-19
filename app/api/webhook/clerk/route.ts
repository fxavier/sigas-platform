// app/api/webhook/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  // If there are no headers, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error verifying webhook', { status: 400 });
  }

  const eventType = evt.type;

  // Handle the event based on the type
  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

// Handle user.created webhook
async function handleUserCreated(data: any) {
  // Create the user in your database only if they are invited
  // This assumes you have an invitations table or similar
  const invitation = await db.userInvitation.findFirst({
    where: {
      email: data.email_addresses[0].email_address,
      isAccepted: false,
    },
  });

  if (invitation) {
    await db.user.create({
      data: {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
        imageUrl: data.image_url,
        role: invitation.role,
        tenantId: invitation.tenantId,
      },
    });

    // Update the invitation
    await db.userInvitation.update({
      where: { id: invitation.id },
      data: { isAccepted: true },
    });
  }
}

// Handle user.updated webhook
async function handleUserUpdated(data: any) {
  await db.user.updateMany({
    where: { clerkUserId: data.id },
    data: {
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
      imageUrl: data.image_url,
    },
  });
}

// Handle user.deleted webhook
async function handleUserDeleted(data: any) {
  await db.user.deleteMany({
    where: { clerkUserId: data.id },
  });
}
