// components/projects/project-detail.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project, Tenant, User } from '@prisma/client';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  Settings,
  Users,
} from 'lucide-react';
import { Institution } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { chartData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyProgressChart } from '@/components/dashboard/monthly-progress-chart';
import { TeamMembers } from '@/components/dashboard/team-members';

interface ProjectDetailProps {
  project: Project;
  tenant: Tenant;
  user: User;
  institution: Institution;
}

export function ProjectDetail({
  project,
  tenant,
  user,
  institution,
}: ProjectDetailProps) {
  const [progress, setProgress] = useState(75); // Mock progress
  const isAdminOrManager = user.role === 'ADMIN' || user.role === 'MANAGER';

  // Mock status (in a real app, this would come from the database)
  const status = 'in-progress';
  const statusDisplay = 'Em Andamento';
  const statusColor =
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';

  // Mock milestones (in a real app, these would come from the database)
  const milestones = [
    {
      id: 1,
      title: 'Estudos Preliminares',
      completed: true,
      date: '2023-01-15',
    },
    {
      id: 2,
      title: 'Análise de Impacto Ambiental',
      completed: true,
      date: '2023-03-10',
    },
    { id: 3, title: 'Consulta Pública', completed: false, date: '2023-05-20' },
    { id: 4, title: 'Aprovação Final', completed: false, date: '2023-07-15' },
    { id: 5, title: 'Implementação', completed: false, date: '2023-09-01' },
  ];

  // Mock team members
  const teamMembers = [
    { name: 'Carlos Oliveira', role: 'Gerente de Projetos', online: true },
    { name: 'Ana Silva', role: 'Especialista Ambiental', online: true },
    { name: 'Manuel Costa', role: 'Engenheiro Hídrico', online: false },
  ];

  return (
    <div className='container mx-auto px-4 py-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Button variant='ghost' size='icon' asChild>
            <Link href={`/tenants/${tenant.slug}/dashboard`}>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>{project.name}</h1>
            <p className='text-muted-foreground'>{institution.name}</p>
          </div>
        </div>

        {isAdminOrManager && (
          <div className='flex space-x-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/tenants/${tenant.slug}/projects/${project.id}/edit`}
              >
                <Edit className='mr-2 h-4 w-4' />
                Editar
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link
                href={`/tenants/${tenant.slug}/projects/${project.id}/settings`}
              >
                <Settings className='mr-2 h-4 w-4' />
                Configurações
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Project Overview */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>
              Informações gerais sobre o projeto
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Descrição
              </h3>
              <p className='mt-1'>{project.description}</p>
            </div>

            <div className='mt-4'>
              <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Progresso
              </h3>
              <div className='mt-2'>
                <div className='flex justify-between items-center mb-1'>
                  <span className='text-sm'>{progress}% completo</span>
                  <span
                    className='text-sm font-medium py-1 px-2 rounded-full text-xs whitespace-nowrap inline-flex items-center justify-center'
                    style={{
                      backgroundColor: 'rgba(var(--chart-1), 0.2)',
                      color: 'hsl(var(--chart-1))',
                    }}
                  >
                    {statusDisplay}
                  </span>
                </div>
                <Progress value={progress} className='h-2' />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 mt-4'>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Data de Início
                </h3>
                <p className='mt-1 flex items-center'>
                  <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                  {formatDate(project.createdAt.toString(), 'dd/MM/yyyy')}
                </p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Data de Término
                </h3>
                <p className='mt-1 flex items-center'>
                  <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                  {formatDate(
                    new Date(
                      new Date().setMonth(new Date().getMonth() + 6)
                    ).toString(),
                    'dd/MM/yyyy'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Números do projeto</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4'>
                <Clock className='h-6 w-6 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  Tempo Restante
                </p>
                <p className='text-xl font-bold'>120 dias</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4'>
                <FileText className='h-6 w-6 text-green-600 dark:text-green-400' />
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  Documentos
                </p>
                <p className='text-xl font-bold'>15</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4'>
                <Users className='h-6 w-6 text-purple-600 dark:text-purple-400' />
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  Membros
                </p>
                <p className='text-xl font-bold'>{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='progress'>
        <TabsList className='grid w-full grid-cols-3 md:w-auto'>
          <TabsTrigger value='progress'>Progresso</TabsTrigger>
          <TabsTrigger value='milestones'>Marcos</TabsTrigger>
          <TabsTrigger value='team'>Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value='progress' className='pt-4'>
          <MonthlyProgressChart data={chartData.monthlyProgress} />
        </TabsContent>

        <TabsContent value='milestones' className='pt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Marcos do Projeto</CardTitle>
              <CardDescription>
                Etapas principais e datas previstas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className='relative pl-8'>
                    {/* Vertical line */}
                    {index < milestones.length - 1 && (
                      <div className='absolute top-6 left-3 w-0.5 h-full bg-gray-200 dark:bg-gray-700' />
                    )}

                    {/* Milestone dot */}
                    <div
                      className={`absolute top-1 left-0 w-6 h-6 rounded-full border-2 ${
                        milestone.completed
                          ? 'bg-green-100 border-green-600 dark:bg-green-900 dark:border-green-400'
                          : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                      } flex items-center justify-center`}
                    >
                      {milestone.completed && (
                        <div className='w-2 h-2 rounded-full bg-green-600 dark:bg-green-400' />
                      )}
                    </div>

                    <div>
                      <h3 className='font-medium'>{milestone.title}</h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        {formatDate(milestone.date, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='team' className='pt-4'>
          <TeamMembers members={teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
