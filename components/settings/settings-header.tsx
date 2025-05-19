// components/settings/settings-header.tsx
import { Tenant } from '@prisma/client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface SettingsHeaderProps {
  title: string;
  description: string;
  tenant: Tenant;
}

export function SettingsHeader({
  title,
  description,
  tenant,
}: SettingsHeaderProps) {
  return (
    <div className='space-y-2'>
      <Link
        href={`/tenants/${tenant.slug}/dashboard`}
        className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground'
      >
        <ChevronLeft className='mr-1 h-4 w-4' />
        Back to Dashboard
      </Link>
      <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
