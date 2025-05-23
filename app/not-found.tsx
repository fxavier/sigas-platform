// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function NotFoundContent() {
  // rest of your code
  return (
    <div>
      <h1>Page not found</h1>
      <div className='flex flex-col items-center justify-center min-h-screen px-4'>
        <div className='text-center space-y-6 max-w-md'>
          <h1 className='text-6xl font-bold text-gray-900'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-700'>
            Pagina não encontrada
          </h2>
          <p className='text-gray-500'>
            A pagina que voce esta procurando nao existe ou foi movida.
          </p>
          <Button asChild>
            <Link href='/dashboard'>Voltar para o Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
