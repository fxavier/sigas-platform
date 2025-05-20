// components/dashboard/projects-table.tsx
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  institution: string;
  institutionName: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  responsible: string;
}

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const statusColors: Record<string, string> = {
    completed:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'in-progress':
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    delayed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: 'Concluído',
      'in-progress': 'Em Andamento',
      delayed: 'Atrasado',
      pending: 'Pendente',
    };

    return statusMap[status] || status;
  };

  return (
    <Card className='animate-in fade-in duration-500'>
      <CardHeader>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <CardTitle>Projetos</CardTitle>
            <CardDescription>
              Visão geral de todos os projetos ativos
            </CardDescription>
          </div>
          <Link href='/projects'>
            <Button variant='outline'>Ver todos os projetos</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className='relative overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Nome do Projeto
                </th>
                <th scope='col' className='px-6 py-3'>
                  Instituição
                </th>
                <th scope='col' className='px-6 py-3'>
                  Status
                </th>
                <th scope='col' className='px-6 py-3'>
                  Progresso
                </th>
                <th scope='col' className='px-6 py-3'>
                  Data de Início
                </th>
                <th scope='col' className='px-6 py-3'>
                  Data de Término
                </th>
                <th scope='col' className='px-6 py-3'>
                  Responsável
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <td className='px-6 py-4 font-medium'>
                    <Link
                      href={`/projects/${project.institution}/${project.id}`}
                      className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className='px-6 py-4'>{project.institutionName}</td>
                  <td className='px-6 py-4'>
                    <Badge
                      className={statusColors[project.status] || ''}
                      variant='outline'
                    >
                      {getStatusDisplay(project.status)}
                    </Badge>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full'
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      {project.progress}%
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {formatDate(project.startDate, 'dd/MM/yyyy')}
                  </td>
                  <td className='px-6 py-4'>
                    {formatDate(project.endDate, 'dd/MM/yyyy')}
                  </td>
                  <td className='px-6 py-4'>{project.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
