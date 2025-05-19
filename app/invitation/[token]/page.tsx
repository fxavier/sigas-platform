// app/invitation/[token]/page.tsx
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { AcceptInvitation } from '@/components/invitation/accept-invitation';

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { tenantId?: string };
}) {
  if (!searchParams.tenantId) {
    redirect('/');
  }

  // Get tenant by ID or slug
  const tenant = await db.tenant.findFirst({
    where: {
      OR: [{ id: searchParams.tenantId }, { slug: searchParams.tenantId }],
    },
  });

  if (!tenant) {
    redirect('/');
  }

  // Get the invitation
  const invitation = await db.userInvitation.findFirst({
    where: {
      token: params.token,
      tenantId: tenant.id,
      isAccepted: false,
      expires: {
        gt: new Date(),
      },
    },
  });

  if (!invitation) {
    // Redirect to sign-in with error message
    redirect(`/sign-in?error=Invalid or expired invitation`);
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <AcceptInvitation
        token={params.token}
        email={invitation.email}
        tenantId={tenant.id}
        tenantName={tenant.name}
        role={invitation.role}
      />
    </div>
  );
}
