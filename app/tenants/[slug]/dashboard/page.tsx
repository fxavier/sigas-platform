// app/tenants/[slug]/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ProjectsList } from '@/components/projects/projects-list';

export default async function TenantDashboardPage({
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

  // Get projects for this user based on role
  let projects;

  if (user.role === 'ADMIN' || user.role === 'MANAGER') {
    // Admins and managers can see all projects
    projects = await db.project.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        _count: {
          select: {
            userProjects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } else {
    // Regular users can only see projects they're assigned to
    projects = await db.project.findMany({
      where: {
        tenantId: tenant.id,
        // other conditions...
      },
      include: {
        _count: {
          select: {
            userProjects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <DashboardHeader
        title={tenant.name}
        description={
          user.role === 'USER'
            ? 'Your assigned projects'
            : 'Welcome to your dashboard'
        }
        user={user}
      />

      <div className='mt-8'>
        <ProjectsList
          projects={projects}
          canCreate={user.role === 'ADMIN' || user.role === 'MANAGER'}
          tenantId={tenant.id}
          tenantSlug={tenant.slug}
        />
      </div>
    </div>
  );
}
