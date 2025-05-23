// app/tenants/[slug]/dashboard/triagem-ambiental/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { TriagemAmbientalDashboard } from '@/components/dashboard/triagem-ambiental-dashboard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

export default function TriagemAmbientalDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const {
    currentTenantId,
    currentProjectId,
    setCurrentTenantId,
    setCurrentProjectId,
  } = useTenantProjectContext();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tenant ID based on slug if not available in context
  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        if (!slug) return;
        if (currentTenantId) return;

        const response = await fetch(`/api/tenants/by-slug/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tenant');
        }

        const tenant = await response.json();
        setCurrentTenantId(tenant.id);
      } catch (error) {
        console.error('Error fetching tenant:', error);
        toast.error('Erro ao carregar informações do tenant');
      }
    };

    fetchTenantId();
  }, [slug, currentTenantId, setCurrentTenantId]);

  // Fetch projects for the tenant
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!currentTenantId) return;

        setIsLoading(true);
        const response = await fetch(
          `/api/tenants/${currentTenantId}/projects`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const projectsData = await response.json();
        setProjects(projectsData);

        // Select the first project by default if available and none is selected
        if (projectsData.length > 0 && !currentProjectId) {
          setCurrentProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Erro ao carregar projetos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentTenantId, currentProjectId, setCurrentProjectId]);

  // Handle project change
  const handleProjectChange = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  return (
    <div className='space-y-6 p-6'>
      <h1 className='text-2xl font-bold'>Dashboard de Triagem Ambiental</h1>
      <p className='text-muted-foreground'>
        Monitoramento e análise das triagens ambientais e sociais
      </p>

      {!currentTenantId ? (
        <Alert className='mb-4'>
          <Info className='h-4 w-4' />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Carregando informações do tenant...
          </AlertDescription>
        </Alert>
      ) : projects.length === 0 ? (
        <Alert className='mb-4'>
          <Info className='h-4 w-4' />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Não há projetos disponíveis para este tenant. Crie um projeto
            primeiro.
          </AlertDescription>
        </Alert>
      ) : (
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Selecione um Projeto
          </label>
          <select
            className='form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            value={currentProjectId || ''}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardContent className='flex items-center justify-center p-6'>
            <p>Carregando dados...</p>
          </CardContent>
        </Card>
      ) : (
        <TriagemAmbientalDashboard
          tenantId={currentTenantId ?? undefined}
          projectId={currentProjectId ?? undefined}
          tenantSlug={slug}
        />
      )}
    </div>
  );
}
