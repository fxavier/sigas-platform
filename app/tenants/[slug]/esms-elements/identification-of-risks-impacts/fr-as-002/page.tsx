// app/tenants/[slug]/esms-elements/risks-impacts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IdentificacaoAvaliacaoRiscosForm } from '@/components/forms/identificacao-avaliacao-riscos/form';
import { identificacaoAvaliacaoRiscosSchema as formSchema } from '@/lib/validations/identificacao-avaliacao-riscos';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from '@/components/forms/identificacao-avaliacao-riscos/columns';
import { useRouter, useParams } from 'next/navigation';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFormApi } from '@/hooks/use-form-api';
import { z } from 'zod';
import { toast } from 'sonner';

export default function IdentificacaoAvaliacaoRiscosPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState<
    IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais | undefined
  >(undefined);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { remove } =
    useFormApi<IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais>({
      endpoint: 'identificacao-riscos',
    });

  // Fetch tenant ID based on slug
  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        if (!slug) return;

        const response = await fetch(`/api/tenants/by-slug/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tenant');
        }

        const tenant = await response.json();
        setTenantId(tenant.id);
      } catch (error) {
        console.error('Error fetching tenant:', error);
        toast.error('Erro ao carregar informações do tenant');
      }
    };

    fetchTenantId();
  }, [slug]);

  // Fetch projects for the tenant
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!tenantId) return;

        const response = await fetch(`/api/tenants/${tenantId}/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const projectsData = await response.json();
        setProjects(projectsData);

        // Select the first project by default if available
        if (projectsData.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Erro ao carregar projetos');
      }
    };

    fetchProjects();
  }, [tenantId]);

  // Fetch data on component mount and when project changes
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!tenantId || !selectedProjectId) return;

      const queryParams = new URLSearchParams();
      queryParams.append('tenantId', tenantId);
      queryParams.append('projectId', selectedProjectId);

      const response = await fetch(
        `/api/forms/identificacao-riscos?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching identificacao riscos:', error);
      toast.error('Erro ao carregar dados de identificação de riscos');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when project changes
  useEffect(() => {
    fetchData();
  }, [tenantId, selectedProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Create a new item with the form data
      const newItem: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais = {
        ...formData,
        id: formData.id || crypto.randomUUID(),
        faseProjecto: formData.faseProjecto,
        estatuto: formData.estatuto,
        extensao: formData.extensao,
        duduacao: formData.duduacao,
        probabilidade: formData.probabilidade,
        riscosImpactos: { id: formData.riscosImpactosId, descricao: '' },
        factorAmbientalImpactado: {
          id: formData.factorAmbientalImpactadoId,
          descricao: '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setData((prev) => [newItem, ...prev]);
      // Refresh data to ensure we have the latest records
      await fetchData();

      toast.success('Registro salvo com sucesso!');

      // Only close the form and reset selected item after successful submission
      setShowForm(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle project change
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  // Handle edit
  const handleEdit = (
    item: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais
  ) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        setIsSubmitting(true);

        if (!tenantId) {
          throw new Error('TenantId is required');
        }

        await remove(id, { tenantId });
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success('Registro excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o registro.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Create columns with actions
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>
                Identificação e Avaliação de Riscos e Impactos
              </CardTitle>
              <CardDescription>
                Formulário para identificação e avaliação de riscos e impactos
                ambientais e sociais
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(undefined);
                setShowForm(!showForm);
              }}
              disabled={isSubmitting || !tenantId || !selectedProjectId}
            >
              <Plus className='h-4 w-4 mr-2' />
              {showForm ? 'Cancelar' : 'Novo Registro'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!tenantId ? (
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
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Selecione um Projeto
              </label>
              <select
                className='form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                value={selectedProjectId || ''}
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

          {isLoading && (
            <div className='text-center p-4'>
              <p>Carregando dados...</p>
            </div>
          )}

          {showForm ? (
            <IdentificacaoAvaliacaoRiscosForm
              initialData={selectedItem}
              onSubmit={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(undefined);
              }}
              isLoading={isSubmitting}
              tenantId={tenantId || undefined}
              projectId={selectedProjectId || undefined}
            />
          ) : (
            !isLoading &&
            selectedProjectId && (
              <DataTable
                columns={columns}
                data={data}
                searchKey='actiactividade'
                filename='identificacao-avaliacao-riscos'
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
