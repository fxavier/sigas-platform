// components/dashboard/dashboard-content.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart4,
  CalendarDays,
  FileText,
  FolderKanban,
  Plus,
  TrendingUp,
  Activity,
  Zap,
  LayoutDashboard,
} from 'lucide-react';
import { projectsData, documentsData, chartData } from '@/lib/mock-data';
import { Institution } from '@/lib/constants';
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ProjectProgressChart } from '@/components/dashboard/project-progress-chart';
import { ProjectStatusChart } from '@/components/dashboard/project-status-chart';
import { MonthlyProgressChart } from '@/components/dashboard/monthly-progress-chart';
import { ProjectsTable } from '@/components/dashboard/projects-table';
import { RecentDocuments } from '@/components/dashboard/recent-documents';
import { TeamMembers } from '@/components/dashboard/team-members';
import { FormsOverviewDashboard } from '@/components/dashboard/forms-overview-dashboard';
import { FormsQuickActions } from '@/components/dashboard/forms-quick-actions';
import { FormsStatusWidget } from '@/components/dashboard/forms-status-widget';

interface DashboardContentProps {
  institution: Institution;
  tenantId: string;
  projects: any[]; // This will be replaced with actual project data
  user: User;
}

export function DashboardContent({
  institution,
  tenantId,
  projects,
  user,
}: DashboardContentProps) {
  const router = useRouter();
  const isAdminOrManager = user.role === 'ADMIN' || user.role === 'MANAGER';
  const [activeTab, setActiveTab] = useState<'overview' | 'forms' | 'projects'>(
    'overview'
  );

  // Filter mock data for this institution
  const institutionProjects = projectsData.filter(
    (p) => p.institution === institution.id
  );
  const institutionDocuments = documentsData.filter(
    (d) => d.institution === institution.id
  );

  // Map real projects to chart format
  const projectProgressData = projects.map((project) => ({
    name: project.name,
    progress: 75, // In a real app, you would use actual progress data
  }));

  // Mock status data based on real project count
  const projectStatusData = [
    { name: 'Em Andamento', count: Math.floor(projects.length * 0.6) },
    { name: 'Concluído', count: Math.floor(projects.length * 0.2) },
    { name: 'Atrasado', count: Math.floor(projects.length * 0.1) },
    { name: 'Pendente', count: Math.floor(projects.length * 0.1) },
  ];

  // Mock KPI data based on real projects
  const kpiData = {
    activeProjects: projects.length,
    completedProjects: Math.floor(projects.length * 0.2),
    recentDocuments: institutionDocuments.slice(0, 5).length,
    pendingNotifications: 3,
  };

  const teamMembers = [
    { name: 'Carlos Oliveira', role: 'Gerente de Projetos', online: true },
    { name: 'Ana Silva', role: 'Especialista Ambiental', online: true },
    { name: 'Manuel Costa', role: 'Engenheiro Hídrico', online: false },
    { name: 'Luísa Mendes', role: 'Coordenadora Social', online: true },
    { name: 'João Ferreira', role: 'Analista de Dados', online: false },
  ];

  // Handle new project creation
  const handleNewProject = () => {
    router.push(`/tenants/${tenantId}/projects/new`);
  };

  return (
    <div className='space-y-8 animate-in fade-in duration-500 p-6'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Painel de Gestão de Projetos SGAS
          </h1>
          <p className='text-muted-foreground'>
            Monitoramento e acompanhamento de projetos ambientais e sociais
          </p>
        </div>
        {isAdminOrManager && (
          <Button onClick={handleNewProject}>
            <Plus className='mr-2 h-4 w-4' />
            Novo Projeto
          </Button>
        )}
      </div>

      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview' className='flex items-center gap-2'>
            <LayoutDashboard className='h-4 w-4' />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value='forms' className='flex items-center gap-2'>
            <FileText className='h-4 w-4' />
            Formulários
          </TabsTrigger>
          <TabsTrigger value='projects' className='flex items-center gap-2'>
            <FolderKanban className='h-4 w-4' />
            Projetos
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-6 mt-6'>
          {/* KPI Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <KPICard
              title='Projetos Ativos'
              value={kpiData.activeProjects}
              icon={FolderKanban}
              iconColor='text-blue-600 dark:text-blue-400'
              iconBgColor='bg-blue-100 dark:bg-blue-900'
              link={{
                href: `/tenants/${tenantId}/projects`,
                text: 'Ver todos os projetos',
              }}
            />
            <KPICard
              title='Projetos Concluídos'
              value={kpiData.completedProjects}
              icon={TrendingUp}
              iconColor='text-green-600 dark:text-green-400'
              iconBgColor='bg-green-100 dark:bg-green-900'
              footer={{
                text: '↑ 1 no último mês',
                color: 'text-green-600 dark:text-green-400',
              }}
            />
            <KPICard
              title='Documentos Recentes'
              value={kpiData.recentDocuments}
              icon={FileText}
              iconColor='text-purple-600 dark:text-purple-400'
              iconBgColor='bg-purple-100 dark:bg-purple-900'
              link={{
                href: `/tenants/${tenantId}/documents`,
                text: 'Ver todos os documentos',
              }}
            />
            <KPICard
              title='Notificações Pendentes'
              value={kpiData.pendingNotifications}
              icon={CalendarDays}
              iconColor='text-yellow-600 dark:text-yellow-400'
              iconBgColor='bg-yellow-100 dark:bg-yellow-900'
              footer={{
                text: '2 próximos de vencer',
                color: 'text-yellow-600 dark:text-yellow-400',
              }}
            />
          </div>

          {/* Charts Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <ProjectProgressChart
              data={
                projectProgressData.length > 0
                  ? projectProgressData
                  : chartData.projectProgress.filter((p) =>
                      p.name.includes(institution.name)
                    )
              }
            />
            <ProjectStatusChart
              data={
                projectStatusData.length > 0
                  ? projectStatusData
                  : chartData.projectStatus
              }
            />
          </div>

          {/* Monthly Progress Chart */}
          <MonthlyProgressChart data={chartData.monthlyProgress} />

          {/* Team Members */}
          <TeamMembers members={teamMembers} />
        </TabsContent>

        <TabsContent value='forms' className='space-y-6 mt-6'>
          {/* Forms Overview Dashboard */}
          <FormsOverviewDashboard tenantId={tenantId} />

          {/* Forms Status Widget */}
          <FormsStatusWidget tenantSlug={institution.id} />

          {/* Forms Quick Actions */}
          <FormsQuickActions tenantSlug={institution.id} />
        </TabsContent>

        <TabsContent value='projects' className='space-y-6 mt-6'>
          {/* Projects Table */}
          <ProjectsTable
            projects={
              projects.length > 0
                ? projects.map((p) => ({
                    ...p,
                    institution: institution.id,
                    institutionName: institution.name,
                    status: 'in-progress',
                    progress: 75,
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                    responsible: 'Project Manager',
                  }))
                : institutionProjects.slice(0, 5)
            }
          />

          {/* Recent Documents */}
          <RecentDocuments documents={institutionDocuments.slice(0, 6)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
