// app/tenants/[slug]/esms-elements/organizational-capacity-and-competence/minutas-comite-gestao/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MinutasComiteGestaoForm } from '@/components/forms/minutas-comite-gestao/form';
import { createColumns } from '@/components/forms/minutas-comite-gestao/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Info,
  AlertTriangle,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useMinutasComiteGestao,
  type MinutasComiteGestao,
} from '@/hooks/use-minutas-comite-gestao';
import {
  MinutasComiteGestaoCompletoFormData,
  ResultadoComiteFormData,
} from '@/lib/validations/minutas-comite-gestao';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function MinutasComiteGestaoPage() {
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
    resultados,
    isLoading,
    error,
    fetchData,
    fetchResultados,
    create,
    update,
    remove,
    createResultado,
  } = useMinutasComiteGestao();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (
    formData: MinutasComiteGestaoCompletoFormData
  ) => {
    try {
      const data = {
        ...formData,
        minuta: {
          ...formData.minuta,
          ausenciasJustificadas:
            formData.minuta.ausenciasJustificadas || undefined,
        },
      };

      if (selectedItem?.id) {
        await update(selectedItem.id, data);
        toast.success('Registro atualizado com sucesso');
      } else {
        await create(data);
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
        await remove(id);
        toast.success('Registro excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o registro.');
      }
    }
  };

  // Handle creating new resultado
  const handleCreateResultado = async (
    resultadoData: ResultadoComiteFormData
  ) => {
    try {
      const newResultado = await createResultado(resultadoData);
      toast.success('Resultado criado com sucesso');
      fetchResultados(); // Refresh the resultados list
      return newResultado;
    } catch (error) {
      console.error('Error creating resultado:', error);
      toast.error('Erro ao criar resultado');
      throw error;
    }
  };

  // Calculate statistics
  const totalReunioes = data.length;
  const reunioesEsteAno = data.filter(
    (item) => new Date(item.data).getFullYear() === new Date().getFullYear()
  ).length;

  // Count situations
  const situacaoStats = data.reduce(
    (acc: Record<string, number>, item: MinutasComiteGestao) => {
      const situacao =
        item.resultadoComiteGestaoAmbientalESocial?.situacao || 'N/A';
      const situacaoKey = situacao.toLowerCase();

      if (situacaoKey.includes('concluí') || situacaoKey.includes('finaliz')) {
        acc.concluidas = (acc.concluidas || 0) + 1;
      } else if (
        situacaoKey.includes('andamento') ||
        situacaoKey.includes('progresso')
      ) {
        acc.emAndamento = (acc.emAndamento || 0) + 1;
      } else if (
        situacaoKey.includes('pendente') ||
        situacaoKey.includes('atras')
      ) {
        acc.pendentes = (acc.pendentes || 0) + 1;
      } else {
        acc.outras = (acc.outras || 0) + 1;
      }
      return acc;
    },
    { concluidas: 0, emAndamento: 0, pendentes: 0, outras: 0 }
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
                <Calendar className='h-5 w-5 text-primary' />
                Minutas do Comitê de Gestão Ambiental e Social
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento das reuniões do comitê de gestão
                ambiental e social, incluindo agendas, decisões e ações
                resultantes
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
              {showForm ? 'Cancelar' : 'Nova Minuta'}
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
              {/* Statistics */}
              {totalReunioes > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Users className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Resumo das Reuniões do Comitê
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <Badge variant='outline' className='text-sm bg-white'>
                          Total: {totalReunioes} reuniões
                        </Badge>
                        <Badge variant='outline' className='text-sm bg-white'>
                          Este ano: {reunioesEsteAno}
                        </Badge>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {situacaoStats.concluidas > 0 && (
                          <Badge
                            variant='default'
                            className='text-sm bg-green-100 text-green-800 border-green-300'
                          >
                            <CheckCircle className='h-3 w-3 mr-1' />
                            Concluídas: {situacaoStats.concluidas}
                          </Badge>
                        )}
                        {situacaoStats.emAndamento > 0 && (
                          <Badge
                            variant='secondary'
                            className='text-sm bg-blue-100 text-blue-800 border-blue-300'
                          >
                            <Clock className='h-3 w-3 mr-1' />
                            Em andamento: {situacaoStats.emAndamento}
                          </Badge>
                        )}
                        {situacaoStats.pendentes > 0 && (
                          <Badge
                            variant='destructive'
                            className='text-sm bg-red-100 text-red-800 border-red-300'
                          >
                            <AlertCircle className='h-3 w-3 mr-1' />
                            Pendentes: {situacaoStats.pendentes}
                          </Badge>
                        )}
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
                        Formulário de Minuta do Comitê
                      </h3>
                      <MinutasComiteGestaoForm
                        initialData={selectedItem}
                        onSubmit={handleSuccess}
                        onCancel={() => {
                          setShowForm(false);
                          setSelectedItem(undefined);
                        }}
                        isLoading={isLoading}
                        resultados={resultados}
                        onCreateResultado={handleCreateResultado}
                      />
                    </div>
                  ) : data.length === 0 ? (
                    <div className='text-center py-8 px-4'>
                      <Calendar className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhuma minuta registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando minutas das reuniões do comitê de
                        gestão ambiental e social para acompanhar as decisões e
                        ações definidas.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar minuta
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='presididoPor'
                      filename='minutas-comite-gestao'
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
