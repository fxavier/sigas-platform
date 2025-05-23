// app/tenants/[slug]/esms-elements/relatorio-auditoria-interna/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioAuditoriaInternaForm } from '@/components/forms/relatorio-auditoria-interna';
import { createColumns } from '@/components/forms/relatorio-auditoria-interna/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileSearch } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useRelatorioAuditoriaInterna,
  type RelatorioAuditoriaInterna,
} from '@/hooks/use-relatorio-auditoria-interna';
import { RelatorioAuditoriaInternaFormData } from '@/lib/validations/relatorio-auditoria-interna';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function RelatorioAuditoriaInternaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    RelatorioAuditoriaInterna | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useRelatorioAuditoriaInterna();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: RelatorioAuditoriaInternaFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Relatório atualizado com sucesso');
      } else {
        await create(formData);
        toast.success('Relatório criado com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o relatório.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      // Convert the response object to form data structure
      const formData: RelatorioAuditoriaInternaFormData = {
        tenantId: item.tenantId,
        projectId: item.projectId,
        ambitoAuditoria: item.ambitoAuditoria,
        dataAuditoria: item.dataAuditoria,
        dataRelatorio: item.dataRelatorio,
        auditorLider: item.auditorLider,
        auditorObservador: item.auditorObservador,
        resumoAuditoria: item.resumoAuditoria,
        // Convert não conformidades from database format to form format
        descricaoNaoConformidades: item.descricaoNaoConformidade.map((nc) => ({
          processo: nc.processo,
          clausula: nc.clausula,
          naoConformidade: nc.naoConformidade,
        })),
      };

      // Create a combined item that TypeScript will accept
      const editItem = {
        ...formData,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        descricaoNaoConformidade: item.descricaoNaoConformidade,
      };

      setSelectedItem(editItem);
      setShowForm(true);
    } else {
      toast.error('Relatório não encontrado.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      try {
        await remove(id);
        toast.success('Relatório excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o relatório.');
      }
    }
  };

  // Calculate statistics
  const stats = data.reduce(
    (acc, item) => {
      acc.totalAuditorias++;
      acc.totalNaoConformidades += item.descricaoNaoConformidade.length;

      // Count auditorias with no non-conformities
      if (item.descricaoNaoConformidade.length === 0) {
        acc.auditoriasSemNC++;
      }

      // Count unique auditors
      acc.auditores.add(item.auditorLider);
      acc.auditores.add(item.auditorObservador);

      return acc;
    },
    {
      totalAuditorias: 0,
      totalNaoConformidades: 0,
      auditoriasSemNC: 0,
      auditores: new Set<string>(),
    }
  );

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
              <CardTitle className='flex items-center gap-2'>
                <FileSearch className='h-5 w-5 text-primary' />
                Relatórios de Auditoria Interna
              </CardTitle>
              <CardDescription>
                Gestão e registro de auditorias internas do sistema de gestão
                ambiental e social
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(undefined);
                setShowForm(!showForm);
              }}
              disabled={isLoading || !currentTenantId || !currentProjectId}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              {showForm ? 'Cancelar' : 'Novo Relatório'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!currentTenantId ? (
            <Alert className='mb-4'>
              <Info className='h-4 w-4' />
              <AlertTitle>Aviso</AlertTitle>
              <AlertDescription>
                Carregando informações do tenant...
              </AlertDescription>
            </Alert>
          ) : !currentProjectId ? (
            <Alert className='mb-4' variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Projeto não selecionado</AlertTitle>
              <AlertDescription>
                Selecione um projeto no painel lateral para visualizar os
                relatórios.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <FileSearch className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas das Auditorias
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Total de auditorias:
                        </span>
                        <Badge variant='default'>{stats.totalAuditorias}</Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Não conformidades:
                        </span>
                        <Badge
                          variant={
                            stats.totalNaoConformidades > 0
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {stats.totalNaoConformidades} identificadas
                        </Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Auditorias sem NC:
                        </span>
                        <Badge
                          variant='default'
                          className='bg-green-100 text-green-800'
                        >
                          {stats.auditoriasSemNC} de {stats.totalAuditorias}
                        </Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Auditores únicos:
                        </span>
                        <Badge variant='outline'>
                          {stats.auditores.size} auditores
                        </Badge>
                      </div>

                      {stats.totalNaoConformidades > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Média NC por auditoria:
                          </span>
                          <Badge variant='secondary'>
                            {(
                              stats.totalNaoConformidades /
                              stats.totalAuditorias
                            ).toFixed(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className='text-center p-4'>
                  <p>Carregando dados...</p>
                </div>
              ) : error ? (
                <Alert variant='destructive' className='mb-4'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  {showForm ? (
                    <div className='border p-4 rounded-md mb-4 bg-gray-50'>
                      <h3 className='text-lg font-medium mb-4'>
                        {selectedItem ? 'Editar Relatório' : 'Novo Relatório'}
                      </h3>
                      <RelatorioAuditoriaInternaForm
                        initialData={selectedItem}
                        onSubmit={handleSuccess}
                        onCancel={() => {
                          setShowForm(false);
                          setSelectedItem(undefined);
                        }}
                        isLoading={isLoading}
                      />
                    </div>
                  ) : data.length === 0 ? (
                    <div className='text-center py-8 px-4'>
                      <FileSearch className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum relatório de auditoria registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece registrando auditorias internas para monitorar a
                        conformidade do sistema de gestão ambiental e social.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar relatório
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='ambitoAuditoria'
                      filename='relatorios-auditoria-interna'
                    />
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
