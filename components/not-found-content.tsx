import React from 'react';

export default function NotFoundContent() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <h2 className='text-2xl font-bold mb-4'>Page Not Found</h2>
      <p className='text-gray-600'>
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
