// app/tenants/[slug]/esms-elements/triagem-ambiental/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TriagemAmbientalForm } from '@/components/forms/triagem-ambiental';
import { createColumns } from '@/components/forms/triagem-ambiental/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Activity } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useTriagemAmbiental,
  type TriagemAmbiental,
} from '@/hooks/use-triagem-ambiental';
import { TriagemAmbientalFormData } from '@/lib/validations/triagem-ambiental';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function TriagemAmbientalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);

  // Initialize hook for data fetching
  const {
    data,
    isLoading,
    error,
    fetchData,
    createTriagemAmbiental,
    updateTriagemAmbiental,
    deleteTriagemAmbiental,
  } = useTriagemAmbiental();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: TriagemAmbientalFormData) => {
    try {
      const data = {
        ...formData,
        consultaEngajamento: formData.consultaEngajamento || null,
        accoesRecomendadas: formData.accoesRecomendadas || null,
      };

      if (selectedItem?.id) {
        await updateTriagemAmbiental(selectedItem.id, data);
        toast.success('Registro atualizado com sucesso');
      } else {
        await createTriagemAmbiental(data);
        toast.success('Registro criado com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o registro.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Registro não encontrado.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteTriagemAmbiental(id);
        toast.success('Registro excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o registro.');
      }
    }
  };

  // Count risk categories
  const riskCategories = data.reduce(
    (acc: Record<string, number>, item: TriagemAmbiental) => {
      const category = item.resultadoTriagem.categoriaRisco;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  // Create columns with actions
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // Debug logs to troubleshoot form display issue
  console.log('Show Form State:', showForm);
  console.log('Selected Item:', selectedItem);
  console.log('Is Loading:', isLoading);
  console.log('Tenant ID:', currentTenantId);
  console.log('Project ID:', currentProjectId);

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5 text-primary' />
                Triagem Ambiental e Social
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento de triagens ambientais e sociais para
                subprojetos
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                console.log(
                  'Button clicked, toggling form state from',
                  showForm,
                  'to',
                  !showForm
                );
                setSelectedItem(undefined);
                setShowForm(!showForm);
              }}
              disabled={isLoading || !currentTenantId || !currentProjectId}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              {showForm ? 'Cancelar' : 'Nova Triagem'}
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
                registros.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {Object.keys(riskCategories).length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Activity className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Resumo de Categorias de Risco
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {Object.entries(riskCategories).map(
                        ([category, count]: [string, number]) => {
                          let badgeVariant:
                            | 'default'
                            | 'destructive'
                            | 'outline'
                            | 'secondary' = 'default';

                          if (
                            category.includes('Alto') ||
                            category.includes('A')
                          ) {
                            badgeVariant = 'destructive';
                          } else if (
                            category.includes('Médio') ||
                            category.includes('B')
                          ) {
                            badgeVariant = 'secondary';
                          } else if (
                            category.includes('Baixo') ||
                            category.includes('C')
                          ) {
                            badgeVariant = 'outline';
                          }

                          return (
                            <Badge
                              key={category}
                              variant={badgeVariant}
                              className='text-sm'
                            >
                              {category}: {count}
                            </Badge>
                          );
                        }
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
                        Formulário de Triagem Ambiental
                      </h3>
                      <TriagemAmbientalForm
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
                      <Activity className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhuma triagem ambiental registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando triagens ambientais para monitorar os
                        impactos ambientais e sociais dos subprojetos.
                      </p>
                      <Button
                        onClick={() => {
                          console.log(
                            'Empty state button clicked, setting showForm to true'
                          );
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar triagem ambiental
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='subprojecto.nome'
                      filename='triagem-ambiental-social'
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
