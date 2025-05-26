'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MatrizTreinamentoForm } from '@/components/forms/organizational-capacity-competence/matriz-treinamento-form';
import { createColumns } from '@/components/forms/organizational-capacity-competence/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, GraduationCap } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useMatrizTreinamento,
  type MatrizTreinamentoResponse,
} from '@/hooks/use-matriz-treinamento';
import { MatrizTreinamentoFormData } from '@/lib/validations/organizational-capacity-competence';
import { toast } from 'sonner';
import {
  useTenantProjectContext,
  TenantProjectProvider,
} from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

function MatrizTreinamentoPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    MatrizTreinamentoResponse | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useMatrizTreinamento();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: MatrizTreinamentoFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Matriz de treinamento atualizada com sucesso');
      } else {
        await create(formData);
        toast.success('Matriz de treinamento criada com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar a matriz de treinamento.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Matriz de treinamento não encontrada.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir esta matriz de treinamento?'
      )
    ) {
      try {
        await remove(id);
        toast.success('Matriz de treinamento excluída com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir a matriz de treinamento.');
      }
    }
  };

  // Count statistics
  const stats = data.reduce(
    (acc, item) => {
      // Count by eficacia
      acc.eficacia[item.eficacia] = (acc.eficacia[item.eficacia] || 0) + 1;

      // Count by area de treinamento
      if (item.areaTreinamento?.name) {
        acc.areas[item.areaTreinamento.name] =
          (acc.areas[item.areaTreinamento.name] || 0) + 1;
      }

      // Sum totals
      acc.totalPalestras += item.totais_palestras;
      acc.totalHoras += item.total_horas;
      acc.totalPessoas += item.total_pessoas_informadas_caixa_ferramentas;

      return acc;
    },
    {
      eficacia: {} as Record<string, number>,
      areas: {} as Record<string, number>,
      totalPalestras: 0,
      totalHoras: 0,
      totalPessoas: 0,
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
                <GraduationCap className='h-5 w-5 text-primary' />
                Matriz de Treinamento
              </CardTitle>
              <CardDescription>
                FR.AS.005 - Matriz de Identificação das necessidades de
                treinamento
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
              {showForm ? 'Cancelar' : 'Nova Matriz'}
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
                Selecione um projeto no painel lateral para visualizar as
                matrizes de treinamento.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <GraduationCap className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas de Treinamento
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <span className='text-sm font-medium'>
                          Total de matrizes:
                        </span>
                        <Badge variant='default'>{data.length}</Badge>
                      </div>

                      {Object.keys(stats.eficacia).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por eficácia:
                          </span>
                          {Object.entries(stats.eficacia).map(
                            ([eficacia, count]) => (
                              <Badge
                                key={eficacia}
                                variant={
                                  eficacia === 'Eficaz'
                                    ? 'default'
                                    : 'destructive'
                                }
                                className='text-xs'
                              >
                                {eficacia === 'Eficaz'
                                  ? 'Eficaz'
                                  : 'Não Eficaz'}
                                : {count}
                              </Badge>
                            )
                          )}
                        </div>
                      )}

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>Totais:</span>
                        <Badge variant='secondary' className='text-xs'>
                          {stats.totalPalestras} palestras
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          {stats.totalHoras} horas
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                          {stats.totalPessoas} pessoas informadas
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
                          ? 'Editar Matriz de Treinamento'
                          : 'Nova Matriz de Treinamento'}
                      </h3>
                      <MatrizTreinamentoForm
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
                      <GraduationCap className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhuma matriz de treinamento registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece criando matrizes de treinamento para identificar
                        e gerenciar as necessidades de capacitação da equipe.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar matriz
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='aprovado_por'
                      filename='matriz-treinamento'
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

export default function MatrizTreinamentoPage() {
  return (
    <TenantProjectProvider>
      <MatrizTreinamentoPageContent />
    </TenantProjectProvider>
  );
}
