// app/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const { userId } = await auth();

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // If not logged in, redirect to sign-in page
  redirect('/sign-in');
}
