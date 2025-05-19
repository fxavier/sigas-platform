// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

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

  // If user doesn't exist in DB, redirect to onboarding
  if (userWithTenants.length === 0) {
    redirect('/onboarding');
  }

  // If user belongs to only one tenant, redirect directly to that tenant's dashboard
  if (userWithTenants.length === 1) {
    redirect(`/tenants/${userWithTenants[0].tenant.slug}/dashboard`);
  }

  // If user belongs to multiple tenants, show tenant selection
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>Select an Organization</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {userWithTenants.map(({ tenant }) => (
          <Link key={tenant.id} href={`/tenants/${tenant.slug}/dashboard`}>
            <Card className='cursor-pointer hover:shadow-md transition-shadow'>
              <CardHeader>
                <CardTitle>{tenant.name}</CardTitle>
                <CardDescription>
                  {tenant.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-500'>
                  Click to access this organization
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href='/onboarding'>
          <Card className='cursor-pointer hover:shadow-md transition-shadow border-dashed'>
            <CardHeader>
              <CardTitle>Create New Organization</CardTitle>
              <CardDescription>Set up a new organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-500'>
                Click to create a new organization
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
