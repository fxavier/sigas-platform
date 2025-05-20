// components/users/user-projects.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FolderPlus } from 'lucide-react';
import Link from 'next/link';

interface UserProjectsProps {
  userId: string;
  tenantId: string;
  tenantSlug: string;
  canManage: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

export function UserProjects({
  userId,
  tenantId,
  tenantSlug,
  canManage,
}: UserProjectsProps) {
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['userProjects', userId],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}/projects`);
      return response.data;
    },
  });

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Assigned Projects</CardTitle>
          <CardDescription>Projects this user can access</CardDescription>
        </div>

        {canManage && (
          <Button size='sm' onClick={() => setIsAssigning(true)}>
            <FolderPlus className='mr-2 h-4 w-4' />
            Manage Projects
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='h-6 w-6 animate-spin text-primary' />
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className='text-center py-8 border rounded-lg'>
            <p className='text-muted-foreground mb-4'>
              This user is not assigned to any projects yet.
            </p>
            {canManage && (
              <Button variant='outline' onClick={() => setIsAssigning(true)}>
                <FolderPlus className='mr-2 h-4 w-4' />
                Assign Projects
              </Button>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {projects.map((project) => (
              <div
                key={project.id}
                className='p-4 border rounded-lg hover:bg-gray-50'
              >
                <Link
                  href={`/tenants/${tenantSlug}/projects/${project.id}`}
                  className='block'
                >
                  <h3 className='font-medium'>{project.name}</h3>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {project.description.length > 100
                      ? project.description.substring(0, 100) + '...'
                      : project.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
