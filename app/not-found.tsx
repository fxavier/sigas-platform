// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import NotFoundContent from '@/components/not-found-content';
import { Suspense } from 'react';

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
