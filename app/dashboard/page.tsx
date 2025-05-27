// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find the user's tenants
  const userWithTenants = await db.user.findMany({
    where: {
      clerkUserId: userId,
    },
    include: {
      tenant: true,
    },
  });

  // If user doesn't exist in DB, redirect to sign-in
  if (userWithTenants.length === 0) {
    redirect('/sign-in');
  }

  // If user belongs to only one tenant, redirect directly to that tenant's dashboard
  if (userWithTenants.length === 1) {
    redirect(`/tenants/${userWithTenants[0].tenant.slug}/dashboard`);
  }

  // If user belongs to multiple tenants, redirect to organizations page
  redirect('/organizations');
}
