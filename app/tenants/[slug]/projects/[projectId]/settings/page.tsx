// app/tenants/[slug]/projects/[projectId]/settings/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ProjectSettings } from '@/components/projects/project-settings';
import { ManageProjectMembers } from '@/components/projects/manage-project-members';

export default async function ProjectSettingsPage({
  params,
}: {
  params: { slug: string; projectId: string };
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

  // Check if the user belongs to this tenant
  const user = await db.user.findFirst({
    where: {
      clerkUserId: userId,
      tenantId: tenant.id,
    },
  });

  if (!user) {
    redirect('/dashboard');
  }

  // Get the project
  const project = await db.project.findUnique({
    where: {
      id: params.projectId,
      tenantId: tenant.id,
    },
  });

  if (!project) {
    redirect(`/tenants/${params.slug}/dashboard`);
  }

  // Check if the user has access to this project
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    const userProject = await db.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: project.id,
        },
      },
    });

    if (!userProject) {
      redirect(`/tenants/${params.slug}/dashboard`);
    }
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-2xl font-bold mb-6'>Project Settings</h1>

      <div className='grid grid-cols-1 gap-6'>
        <ProjectSettings
          project={project}
          tenant={tenant}
          canEdit={user.role === 'ADMIN' || user.role === 'MANAGER'}
        />

        <ManageProjectMembers
          project={project}
          tenant={tenant}
          currentUser={user}
        />

        {/* Additional settings sections can be added here */}
      </div>
    </div>
  );
}
