// app/tenants/[slug]/esms-elements/relatorio-simulacro/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioSimulacroForm } from '@/components/forms/relatorio-simulacro/form';
import { createColumns } from '@/components/forms/relatorio-simulacro/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useRelatorioSimulacro,
  type RelatorioSimulacro,
} from '@/hooks/use-relatorio-simulacro';
import { RelatorioSimulacroFormData } from '@/lib/validations/relatorio-simulacro';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function RelatorioSimulacroPage() {
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
    createRelatorioSimulacro,
    updateRelatorioSimulacro,
    deleteRelatorioSimulacro,
  } = useRelatorioSimulacro();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: RelatorioSimulacroFormData) => {
    try {
      const data = {
        ...formData,
        outraAssinatura: formData.outraAssinatura || null,
      };

      if (selectedItem?.id) {
        await updateRelatorioSimulacro(selectedItem.id, data);
        toast.success('Registro atualizado com sucesso');
      } else {
        await createRelatorioSimulacro(data);
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
        await deleteRelatorioSimulacro(id);
        toast.success('Registro excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o registro.');
      }
    }
  };

  // Count emergency types
  const emergencyTypes = data.reduce(
    (acc: Record<string, number>, item: RelatorioSimulacro) => {
      const type = item.tipoEmergenciaSimulada;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
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
                <FileText className='h-5 w-5 text-primary' />
                Relatório de Simulacro
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento de simulacros de emergência realizados no
                projeto
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
              {showForm ? 'Cancelar' : 'Novo Simulacro'}
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
              {Object.keys(emergencyTypes).length > 0 && (
                <Alert className='mb-4 bg-green-50 border-green-200'>
                  <FileText className='h-4 w-4 text-green-600' />
                  <AlertTitle className='text-green-800'>
                    Resumo de Tipos de Emergência
                  </AlertTitle>
                  <AlertDescription className='text-green-700'>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {Object.entries(emergencyTypes).map(
                        ([type, count]: [string, number]) => {
                          const label =
                            type === 'SAUDE_E_SEGURANCA'
                              ? 'Saúde e Segurança'
                              : 'Ambiental';
                          let badgeVariant:
                            | 'default'
                            | 'destructive'
                            | 'outline'
                            | 'secondary' = 'default';

                          if (type === 'SAUDE_E_SEGURANCA') {
                            badgeVariant = 'destructive';
                          } else if (type === 'AMBIENTAL') {
                            badgeVariant = 'secondary';
                          }

                          return (
                            <Badge
                              key={type}
                              variant={badgeVariant}
                              className='text-sm'
                            >
                              {label}: {count}
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
                        Formulário de Relatório de Simulacro
                      </h3>
                      <RelatorioSimulacroForm
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
                      <FileText className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum relatório de simulacro registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando relatórios de simulacros para
                        monitorar a preparação da equipe para situações de
                        emergência.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar relatório de simulacro
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='local'
                      filename='relatorio-simulacro'
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
