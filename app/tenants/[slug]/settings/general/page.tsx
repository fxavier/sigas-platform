// app/tenants/[slug]/settings/general/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { SettingsHeader } from '@/components/settings/settings-header';
import { TenantSettings } from '@/components/settings/tenant-settings';

export default async function GeneralSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get the tenant by slug
  const tenant = await db.tenant.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!tenant) {
    redirect('/dashboard');
  }

  // Check if the user belongs to this tenant and is an admin
  const user = await db.user.findFirst({
    where: {
      clerkUserId: userId,
      tenantId: tenant.id,
    },
  });

  if (!user) {
    redirect('/dashboard');
  }

  // Only admins can access tenant settings
  if (user.role !== 'ADMIN') {
    redirect(`/tenants/${params.slug}/dashboard`);
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <SettingsHeader
        title='Organization Settings'
        description='Manage your organization details'
        tenant={tenant}
      />

      <div className='mt-8 max-w-2xl'>
        <TenantSettings tenant={tenant} />
      </div>
    </div>
  );
}
