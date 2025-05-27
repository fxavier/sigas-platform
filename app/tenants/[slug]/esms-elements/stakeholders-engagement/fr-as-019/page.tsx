// app/tenants/[slug]/esms-elements/matriz-stakeholder/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MatrizStakeholderForm } from '@/components/forms/matriz-stakeholder/form';
import { createColumns } from '@/components/forms/matriz-stakeholder/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Users } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useMatrizStakeholder,
  type MatrizStakeholderResponse,
} from '@/hooks/use-matriz-stakeholder';
import { MatrizStakeholderFormData } from '@/lib/validations/matriz-stakeholder';
import { toast } from 'sonner';
import {
  useTenantProjectContext,
  TenantProjectProvider,
} from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

function MatrizStakeholderPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MatrizStakeholderResponse | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useMatrizStakeholder();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: MatrizStakeholderFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Matriz de stakeholder atualizada com sucesso');
      } else {
        await create(formData);
        toast.success('Matriz de stakeholder criada com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar a matriz de stakeholder.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Matriz de stakeholder não encontrada.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir esta matriz de stakeholder?'
      )
    ) {
      try {
        await remove(id);
        toast.success('Matriz de stakeholder excluída com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir a matriz de stakeholder.');
      }
    }
  };

  // Calculate statistics
  const stats = data.reduce(
    (acc, item) => {
      // Count by posicionamento
      acc.posicionamento[item.percepcaoOuPosicionamento] =
        (acc.posicionamento[item.percepcaoOuPosicionamento] || 0) + 1;

      // Count by potencia impacto
      acc.potenciaImpacto[item.potenciaImpacto] =
        (acc.potenciaImpacto[item.potenciaImpacto] || 0) + 1;

      // Count by alcance
      acc.alcance[item.alcance] = (acc.alcance[item.alcance] || 0) + 1;

      // Count by categoria
      if (item.categoria?.nome) {
        acc.categorias[item.categoria.nome] =
          (acc.categorias[item.categoria.nome] || 0) + 1;
      }

      // Count unique responsaveis
      acc.responsaveis.add(item.interlocutor_responsavel_por_relacionamento);

      return acc;
    },
    {
      posicionamento: {} as Record<string, number>,
      potenciaImpacto: {} as Record<string, number>,
      alcance: {} as Record<string, number>,
      categorias: {} as Record<string, number>,
      responsaveis: new Set<string>(),
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
                <Users className='h-5 w-5 text-primary' />
                Matriz de Stakeholder
              </CardTitle>
              <CardDescription>
                Gestão e análise de stakeholders do projeto - mapeamento de
                relacionamentos, interesses e estratégias de engajamento
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
              {showForm ? 'Cancelar' : 'Novo Stakeholder'}
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
                Selecione um projeto no painel lateral para visualizar a matriz
                de stakeholders.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Users className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Análise de Stakeholders
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-3'>
                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Total de stakeholders:
                        </span>
                        <Badge variant='default'>{data.length}</Badge>
                      </div>

                      {Object.keys(stats.posicionamento).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por posicionamento:
                          </span>
                          {Object.entries(stats.posicionamento).map(
                            ([posicionamento, count]) => {
                              let variant:
                                | 'default'
                                | 'destructive'
                                | 'secondary' = 'secondary';
                              if (posicionamento === 'POSITIVO')
                                variant = 'default';
                              if (posicionamento === 'NEGATIVO')
                                variant = 'destructive';

                              const label =
                                posicionamento === 'POSITIVO'
                                  ? 'Positivo'
                                  : posicionamento === 'NEGATIVO'
                                  ? 'Negativo'
                                  : 'Neutro';

                              return (
                                <Badge
                                  key={posicionamento}
                                  variant={variant}
                                  className='text-xs'
                                >
                                  {label}: {count}
                                </Badge>
                              );
                            }
                          )}
                        </div>
                      )}

                      {Object.keys(stats.potenciaImpacto).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por potência de impacto:
                          </span>
                          {Object.entries(stats.potenciaImpacto).map(
                            ([potencia, count]) => {
                              let variant:
                                | 'default'
                                | 'destructive'
                                | 'outline' = 'outline';
                              if (potencia === 'ALTO') variant = 'destructive';
                              if (potencia === 'MEDIO') variant = 'default';

                              const label =
                                potencia === 'ALTO'
                                  ? 'Alto'
                                  : potencia === 'MEDIO'
                                  ? 'Médio'
                                  : 'Baixo';

                              return (
                                <Badge
                                  key={potencia}
                                  variant={variant}
                                  className='text-xs'
                                >
                                  {label}: {count}
                                </Badge>
                              );
                            }
                          )}
                        </div>
                      )}

                      {Object.keys(stats.alcance).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por alcance:
                          </span>
                          {Object.entries(stats.alcance).map(
                            ([alcance, count]) => {
                              const label =
                                alcance === 'LOCAL'
                                  ? 'Local'
                                  : alcance === 'REGIONAL'
                                  ? 'Regional'
                                  : alcance === 'NACIONAL'
                                  ? 'Nacional'
                                  : 'Internacional';

                              return (
                                <Badge
                                  key={alcance}
                                  variant='outline'
                                  className='text-xs'
                                >
                                  {label}: {count}
                                </Badge>
                              );
                            }
                          )}
                        </div>
                      )}

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Responsáveis únicos:
                        </span>
                        <Badge variant='secondary' className='text-xs'>
                          {stats.responsaveis.size} pessoas
                        </Badge>
                      </div>
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
                        {selectedItem
                          ? 'Editar Stakeholder'
                          : 'Novo Stakeholder'}
                      </h3>
                      <MatrizStakeholderForm
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
                      <Users className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum stakeholder mapeado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece mapeando os stakeholders do projeto para
                        identificar relacionamentos, interesses e desenvolver
                        estratégias de engajamento adequadas.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Mapear primeiro stakeholder
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Alert className='mb-4 bg-green-50 border-green-200'>
                        <Info className='h-4 w-4 text-green-600' />
                        <AlertTitle className='text-green-800'>
                          Informação sobre Stakeholders
                        </AlertTitle>
                        <AlertDescription className='text-green-700'>
                          A matriz de stakeholders é fundamental para o sucesso
                          do projeto. Ela permite identificar todos os
                          interessados, avaliar seu nível de influência e
                          desenvolver estratégias de engajamento personalizadas
                          para cada grupo.
                        </AlertDescription>
                      </Alert>

                      <DataTable
                        columns={columns}
                        data={data}
                        searchKey='stakeholder'
                        filename='matriz-stakeholder'
                      />
                    </>
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

export default function MatrizStakeholderPage() {
  return (
    <TenantProjectProvider>
      <MatrizStakeholderPageContent />
    </TenantProjectProvider>
  );
}
