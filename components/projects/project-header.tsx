// components/projects/project-header.tsx
import Link from 'next/link';
import { Project, Tenant, User } from '@prisma/client';
import { Settings, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  project: Project;
  tenant: Tenant;
  user: User;
}

export function ProjectHeader({ project, tenant, user }: ProjectHeaderProps) {
  const canManageProject = user.role === 'ADMIN' || user.role === 'MANAGER';

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex items-center text-sm text-muted-foreground'>
        <Link
          href={`/tenants/${tenant.slug}/dashboard`}
          className='inline-flex items-center hover:text-foreground'
        >
          <ChevronLeft className='mr-1 h-4 w-4' />
          Back to Dashboard
        </Link>
      </div>

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{project.name}</h1>
          <p className='text-muted-foreground mt-1'>{project.description}</p>
        </div>

        {canManageProject && (
          <Button variant='outline' size='sm' asChild>
            <Link
              href={`/tenants/${tenant.slug}/projects/${project.id}/settings`}
            >
              <Settings className='mr-2 h-4 w-4' />
              Project Settings
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
