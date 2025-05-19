// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <div className='text-center space-y-6 max-w-md'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Something went wrong
        </h1>
        <p className='text-gray-500'>
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className='flex flex-col sm:flex-row gap-2 justify-center'>
          <Button onClick={reset} variant='default'>
            Try again
          </Button>
          <Button variant='outline' asChild>
            <Link href='/dashboard'>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
