// app/tenants/[slug]/settings/users/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { UsersList } from '@/components/settings/users-list';
import { SettingsHeader } from '@/components/settings/settings-header';

// Make sure this is a proper React component that returns JSX
export default async function UsersSettingsPage({
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

  // Check if the user belongs to this tenant and is an admin or manager
  const user = await db.user.findFirst({
    where: {
      clerkUserId: userId,
      tenantId: tenant.id,
    },
  });

  if (!user) {
    redirect('/dashboard');
  }

  // Only admins and managers can access user settings
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    redirect(`/tenants/${params.slug}/dashboard`);
  }

  // Get all users for this tenant
  const users = await db.user.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get active invitations
  const invitations = await db.userInvitation.findMany({
    where: {
      tenantId: tenant.id,
      isAccepted: false,
      expires: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get all projects for this tenant (for project assignment)
  const projects = await db.project.findMany({
    where: {
      tenantId: tenant.id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Make sure to return JSX
  return (
    <div className='container mx-auto px-4 py-6'>
      <SettingsHeader
        title='User Management'
        description='Manage users and their project assignments'
        tenant={tenant}
      />

      <div className='mt-8'>
        <UsersList
          users={users}
          invitations={invitations}
          projects={projects}
          currentUser={user}
          tenant={tenant}
        />
      </div>
    </div>
  );
}
