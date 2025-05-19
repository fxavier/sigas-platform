// components/dashboard/dashboard-header.tsx
import { User } from '@prisma/client';

interface DashboardHeaderProps {
  title: string;
  description: string;
  user: User;
}

export function DashboardHeader({
  title,
  description,
  user,
}: DashboardHeaderProps) {
  return (
    <div className='flex flex-col space-y-2'>
      <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
      <p className='text-muted-foreground'>{description}</p>
      {user && (
        <p className='text-sm text-muted-foreground'>
          Logged in as <span className='font-medium'>{user.email}</span> (
          {user.role})
        </p>
      )}
    </div>
  );
}
