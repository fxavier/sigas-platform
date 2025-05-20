// app/tenants/[slug]/layout.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Sidebar } from '@/components/navigation/sidebar';
import { Header } from '@/components/navigation/header';
import { AuthProvider } from '@/lib/context/auth-context';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get tenant by slug
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

  return (
    <AuthProvider initialUser={user}>
      <div className='h-screen flex flex-col'>
        <Header tenant={tenant} user={user} />
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar tenant={tenant} user={user} />
          <main className='flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900'>
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
