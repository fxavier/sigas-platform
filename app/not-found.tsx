'use client';

import { Suspense } from 'react';
import Link from 'next/link';

// Static component that doesn't use any client hooks
function NotFoundFallback() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-8'>Pagina não encontrada</p>
      <Link
        href='/dashboard'
        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors'
      >
        Voltar para o Dashboard
      </Link>
    </div>
  );
}

// Client component that will only run in the browser
function ClientNotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
      <p className='text-xl text-gray-600 mb-8'>
        Não conseguimos encontrar a pagina que voce esta procurando.
      </p>
      <Link
        href='/dashboard'
        className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors'
      >
        Voltar para a pagina inicial
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundFallback />}>
      <ClientNotFound />
    </Suspense>
  );
}
