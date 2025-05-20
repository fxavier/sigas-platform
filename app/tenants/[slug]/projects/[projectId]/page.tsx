// app/tenants/[slug]/projects/[projectId]/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ProjectDetail } from '@/components/projects/project-detail';
import { getInstitutionByTenantId } from '@/lib/utils';

export default async function ProjectPage({
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

  // Check if the user has access to this project (admins and managers can access all)
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    const userProject = await db.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: params.projectId,
        },
      },
    });

    if (!userProject) {
      redirect(`/tenants/${params.slug}/dashboard`);
    }
  }

  // Get institution for this tenant
  const institution = getInstitutionByTenantId(tenant.id);

  return (
    <ProjectDetail
      project={project}
      tenant={tenant}
      user={user}
      institution={institution}
    />
  );
}
