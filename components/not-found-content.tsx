'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Link } from 'lucide-react';

export default function NotFoundContent() {
  const searchParams = useSearchParams();
  // rest of your code
  return (
    <div>
      <h1>Page not found</h1>
      <div className='flex flex-col items-center justify-center min-h-screen px-4'>
        <div className='text-center space-y-6 max-w-md'>
          <h1 className='text-6xl font-bold text-gray-900'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700'>
            Page Not Found
          </h2>
          <p className='text-gray-500'>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href='/dashboard'>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
