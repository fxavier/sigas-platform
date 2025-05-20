// app/tenants/[slug]/projects/new/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { ProjectForm } from '@/components/projects/project-form';

export default async function NewProjectPage({
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

  // Check if the user belongs to this tenant and has appropriate permissions
  const user = await db.user.findFirst({
    where: {
      clerkUserId: userId,
      tenantId: tenant.id,
    },
  });

  if (!user) {
    redirect('/dashboard');
  }

  // Only admins and managers can create projects
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    redirect(`/tenants/${params.slug}/dashboard`);
  }

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-2xl font-bold mb-6'>Criar Novo Projeto</h1>
      <ProjectForm tenantId={tenant.id} tenantSlug={tenant.slug} />
    </div>
  );
}
