// components/projects/projects-list.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@prisma/client';
import { Plus, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { ProjectWithCount } from '@/lib/types';

interface ProjectsListProps {
  projects: ProjectWithCount[];
  canCreate: boolean;
  tenantId: string;
  tenantSlug: string;
}

export function ProjectsList({
  projects,
  canCreate,
  tenantId,
  tenantSlug,
}: ProjectsListProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Projetos</h2>
        {canCreate && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Criar Projeto
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className='text-center p-12 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-medium text-gray-700 mb-2'>
            Nenhum projeto ainda
          </h3>
          <p className='text-gray-500 mb-6'>
            Comece criando seu primeiro projeto.
          </p>
          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Criar Projeto
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 mb-2'>
                  {project.description.length > 100
                    ? project.description.slice(0, 100) + '...'
                    : project.description}
                </p>
                <div className='flex items-center text-sm text-gray-500'>
                  <Users className='h-4 w-4 mr-1' />
                  <span>{project._count?.userProjects || 0} membros</span>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button
                  variant='outline'
                  onClick={() =>
                    router.push(`/tenants/${tenantSlug}/projects/${project.id}`)
                  }
                >
                  Ver Projeto
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    router.push(
                      `/tenants/${tenantSlug}/projects/${project.id}/settings`
                    )
                  }
                >
                  <Settings className='h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenantId={tenantId}
        tenantSlug={tenantSlug}
      />
    </div>
  );
}
