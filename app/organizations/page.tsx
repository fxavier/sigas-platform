// app/organizations/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { OrganizationList } from '@/components/organizations/organization-list';

export default async function OrganizationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get all tenants (organizations) from the database
  const tenants = await db.tenant.findMany();

  // If no tenants exist, check if we need to redirect to onboarding
  if (tenants.length === 0) {
    // Check if the user exists in our database
    const userExists = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    // If user doesn't exist either, redirect to onboarding
    if (!userExists) {
      redirect('/onboarding');
    }
  }

  // For the canCreate flag, we'll allow any authenticated user to create organizations
  // You could add more complex permission logic here if needed
  const canCreate = true;

  return (
    <div className='flex min-h-screen bg-background'>
      <div className='flex-1 flex flex-col'>
        <main className='flex-1 py-12 px-6 md:px-10'>
          <OrganizationList organizations={tenants} canCreate={canCreate} />
        </main>
      </div>
    </div>
  );
}
