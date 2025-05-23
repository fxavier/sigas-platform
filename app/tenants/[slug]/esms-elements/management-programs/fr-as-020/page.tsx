// app/tenants/[slug]/esms-elements/objetivos-metas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ObjetivosMetasForm } from '@/components/forms/objetivos-metas';
import { createColumns } from '@/components/forms/objetivos-metas/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Target } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useObjetivosMetas,
  type ObjetivosMetas,
} from '@/hooks/use-objetivos-metas';
import { ObjetivosMetasFormData } from '@/lib/validations/objetivos-metas';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function ObjetivosMetasPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ObjetivosMetas | undefined>(
    undefined
  );

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useObjetivosMetas();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: ObjetivosMetasFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Registro atualizado com sucesso');
      } else {
        await create(formData);
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
      // Convert the response object to form data structure
      const formData: ObjetivosMetasFormData = {
        tenantId: item.tenantId,
        projectId: item.projectId,
        numeroRefOAndM: item.numeroRefOAndM,
        aspetoRefNumero: item.aspetoRefNumero,
        centroCustos: item.centroCustos,
        objectivo: item.objectivo,
        publicoAlvo: item.publicoAlvo,
        orcamentoRecursos: item.orcamentoRecursos,
        refDocumentoComprovativo: item.refDocumentoComprovativo,
        dataInicio: item.dataInicio,
        dataConclusaoPrevista: item.dataConclusaoPrevista,
        dataConclusaoReal: item.dataConclusaoReal,
        pgasAprovadoPor: item.pgasAprovadoPor,
        dataAprovacao: item.dataAprovacao,
        observacoes: item.observacoes,
        oAndMAlcancadoFechado: item.oAndMAlcancadoFechado,
        assinaturaDirectorGeral: item.assinaturaDirectorGeral,
        data: item.data,
        // Extract IDs from the relationship arrays
        membrosDaEquipaIds: item.membrosDaEquipa.map((membro) => membro.id),
        tabelasAcoesIds: item.tabelasAccoes.map((acao) => acao.id),
      };

      // Create a combined item that TypeScript will accept
      const editItem = {
        ...formData,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        membrosDaEquipa: item.membrosDaEquipa,
        tabelasAccoes: item.tabelasAccoes,
      };

      setSelectedItem(editItem);
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

  // Count status categories
  const statusCounts = data.reduce(
    (acc: Record<string, number>, item: ObjetivosMetas) => {
      const status = item.oAndMAlcancadoFechado;
      acc[status] = (acc[status] || 0) + 1;
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
                <Target className='h-5 w-5 text-primary' />
                Objetivos e Metas Ambientais e Sociais
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento de objetivos e metas ambientais e sociais
                do projeto
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
              {showForm ? 'Cancelar' : 'Novo Objetivo'}
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
              {Object.keys(statusCounts).length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Target className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Resumo de Status
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {Object.entries(statusCounts).map(
                        ([status, count]: [string, number]) => (
                          <Badge
                            key={status}
                            variant={status === 'SIM' ? 'default' : 'outline'}
                            className='text-sm'
                          >
                            {status === 'SIM' ? 'Alcançados' : 'Em progresso'}:{' '}
                            {count}
                          </Badge>
                        )
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
                        {selectedItem ? 'Editar Objetivo' : 'Novo Objetivo'}
                      </h3>
                      <ObjetivosMetasForm
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
                      <Target className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum objetivo ou meta registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando objetivos e metas ambientais e
                        sociais para monitorar o desempenho do projeto.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar objetivo
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='objectivo'
                      filename='objetivos-metas-ambientais-sociais'
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
