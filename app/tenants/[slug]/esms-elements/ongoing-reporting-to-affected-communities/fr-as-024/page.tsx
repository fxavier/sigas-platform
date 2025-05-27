// app/tenants/[slug]/esms-elements/stakeholders-engagement/registo-comunicacoes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegistoComunicacoesForm } from '@/components/forms/registo-comunicacoes/form';
import { createColumns } from '@/components/forms/registo-comunicacoes/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Users, MessageSquare } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useRegistoComunicacoes,
  type RegistoComunicacoes,
} from '@/hooks/use-registo-comunicacoes';
import { RegistoComunicacoesFormData } from '@/lib/validations/registo-comunicacoes';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function RegistoComunicacoesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useRegistoComunicacoes();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: RegistoComunicacoesFormData) => {
    try {
      const data = {
        ...formData,
        porqueNaoAtendeu: formData.porqueNaoAtendeu || undefined,
        poruqNecessarioRetomarTema:
          formData.poruqNecessarioRetomarTema || undefined,
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

  // Calculate statistics
  const totalEncontros = data.length;
  const encontrosEficazes = data.filter(
    (item) => item.encontroAtendeuSeuProposito === 'SIM'
  ).length;
  const temasParaRetomar = data.filter(
    (item) => item.haNecessidadeRetomarTema === 'SIM'
  ).length;

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
                <MessageSquare className='h-5 w-5 text-primary' />
                Registo de Comunicações/Relatório às Partes Interessadas
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento das comunicações e encontros realizados
                com as partes interessadas do projeto
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
              {showForm ? 'Cancelar' : 'Nova Comunicação'}
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
              {totalEncontros > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Users className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Resumo das Comunicações
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <Badge variant='outline' className='text-sm bg-white'>
                        Total: {totalEncontros} encontros
                      </Badge>
                      <Badge
                        variant='default'
                        className='text-sm bg-green-100 text-green-800 border-green-300'
                      >
                        Eficazes: {encontrosEficazes} (
                        {Math.round((encontrosEficazes / totalEncontros) * 100)}
                        %)
                      </Badge>
                      {temasParaRetomar > 0 && (
                        <Badge
                          variant='destructive'
                          className='text-sm bg-amber-100 text-amber-800 border-amber-300'
                        >
                          Temas p/ retomar: {temasParaRetomar}
                        </Badge>
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
                        Formulário de Registo de Comunicações
                      </h3>
                      <RegistoComunicacoesForm
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
                      <MessageSquare className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhuma comunicação registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando registros de comunicações e encontros
                        realizados com as partes interessadas do projeto.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar comunicação
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='local'
                      filename='registo-comunicacoes'
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
