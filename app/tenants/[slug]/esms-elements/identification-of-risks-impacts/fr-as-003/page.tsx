'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ControleRequisitosForm } from '@/components/forms/controle-requisitos';
import { createColumns } from '@/components/forms/controle-requisitos/columns';
import { DataTable } from '@/components/ui/data-table';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useControleRequisitos } from '@/hooks/use-controle-requisitos';
import { ControleRequisitosFormData } from '@/lib/validations/controle-requisitos';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function ControleRequisitosPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useControleRequisitos();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: ControleRequisitosFormData) => {
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
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setShowForm(true);
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

  // Count expired items (control date in the past)
  const expiredItems = data.filter((item) => {
    const controlDate = new Date(item.dataControle);
    const today = new Date();
    return controlDate < today;
  });

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
                Controle de Requisitos Legais
              </CardTitle>
              <CardDescription>
                Gestão e monitoramento de conformidade com requisitos legais
                ambientais e sociais
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
              {showForm ? 'Cancelar' : 'Novo Requisito'}
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
              {expiredItems.length > 0 && (
                <Alert className='mb-4 bg-amber-50 border-amber-200'>
                  <Calendar className='h-4 w-4 text-amber-600' />
                  <AlertTitle className='text-amber-800'>Atenção!</AlertTitle>
                  <AlertDescription className='text-amber-700'>
                    <p>
                      Existem{' '}
                      <Badge
                        variant='outline'
                        className='text-amber-600 border-amber-300 bg-amber-100'
                      >
                        {expiredItems.length}
                      </Badge>{' '}
                      requisito(s) legal(is) com data de controle vencida.
                      Considere revisar estes itens para garantir conformidade.
                    </p>
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
                    <ControleRequisitosForm
                      initialData={selectedItem}
                      onSubmit={handleSuccess}
                      onCancel={() => {
                        setShowForm(false);
                        setSelectedItem(undefined);
                      }}
                      isLoading={isLoading}
                    />
                  ) : data.length === 0 ? (
                    <div className='text-center py-8 px-4'>
                      <FileText className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum requisito legal registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando requisitos legais e seus respectivos
                        documentos para monitorar a conformidade do projeto.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar requisito legal
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='tituloDocumento'
                      filename='controle-requisitos-legais'
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
