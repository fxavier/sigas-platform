import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NotFound() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const pathname = headersList.get('x-pathname') || '';

  // If we're in a tenant subdomain, redirect to the custom 404 page
  if (host.includes('.')) {
    redirect('/custom-404');
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='mt-4 text-lg'>Page not found</p>
    </div>
  );
}
