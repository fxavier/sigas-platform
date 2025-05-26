'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PerguntaAvaliacaoClassificacaoEmergenciaForm } from '@/components/forms/perguntas-avaliacao-classificacao-emergencia';
import { createColumns } from '@/components/forms/perguntas-avaliacao-classificacao-emergencia/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, HelpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  usePerguntasAvaliacaoClassificacaoEmergencia,
  type PerguntaAvaliacaoClassificacaoEmergencia,
} from '@/hooks/use-perguntas-avaliacao-classificacao-emergencia';
import { PerguntaAvaliacaoClassificacaoEmergenciaFormData } from '@/lib/validations/perguntas-avaliacao-classificacao-emergencia';
import { toast } from 'sonner';
import {
  useTenantProjectContext,
  TenantProjectProvider,
} from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

function PerguntasAvaliacaoClassificacaoEmergenciaPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    PerguntaAvaliacaoClassificacaoEmergencia | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    usePerguntasAvaliacaoClassificacaoEmergencia();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (
    formData: PerguntaAvaliacaoClassificacaoEmergenciaFormData
  ) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Pergunta de avaliação atualizada com sucesso');
      } else {
        await create(formData);
        toast.success('Pergunta de avaliação criada com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar a pergunta de avaliação.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Pergunta de avaliação não encontrada.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir esta pergunta de avaliação?'
      )
    ) {
      try {
        await remove(id);
        toast.success('Pergunta de avaliação excluída com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir a pergunta de avaliação.');
      }
    }
  };

  // Count statistics
  const stats = {
    total: data.length,
    codigosUnicos: new Set(data.map((item) => item.codigo)).size,
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
              <CardTitle className='flex items-center gap-2'>
                <HelpCircle className='h-5 w-5 text-primary' />
                Perguntas de Avaliação - Classificação de Emergência
              </CardTitle>
              <CardDescription>
                Gerenciamento de perguntas para avaliação e classificação de
                situações de emergência
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
              {showForm ? 'Cancelar' : 'Nova Pergunta'}
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
                perguntas de avaliação.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <HelpCircle className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas das Perguntas
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <span className='text-sm font-medium'>
                          Total de perguntas:
                        </span>
                        <Badge variant='default'>{stats.total}</Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>
                          Códigos únicos:
                        </span>
                        <Badge variant='secondary' className='text-xs'>
                          {stats.codigosUnicos}
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
                          ? 'Editar Pergunta de Avaliação'
                          : 'Nova Pergunta de Avaliação'}
                      </h3>
                      <PerguntaAvaliacaoClassificacaoEmergenciaForm
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
                      <HelpCircle className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhuma pergunta de avaliação registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece criando perguntas para avaliação e classificação
                        de situações de emergência. Estas perguntas serão
                        utilizadas nos relatórios de simulacro.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar pergunta
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='pergunta'
                      filename='perguntas-avaliacao-classificacao-emergencia'
                    />
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Alert className='bg-amber-50 border-amber-200'>
        <Info className='h-4 w-4 text-amber-600' />
        <AlertTitle className='text-amber-800'>
          Informação Importante
        </AlertTitle>
        <AlertDescription className='text-amber-700'>
          As perguntas criadas aqui serão utilizadas nos relatórios de simulacro
          para avaliar e classificar situações de emergência. Certifique-se de
          que as perguntas são claras e relevantes para o contexto de
          emergência.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default function PerguntasAvaliacaoClassificacaoEmergenciaPage() {
  return (
    <TenantProjectProvider>
      <PerguntasAvaliacaoClassificacaoEmergenciaPageContent />
    </TenantProjectProvider>
  );
}
