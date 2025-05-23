// app/tenants/[slug]/esms-elements/identification-of-risks-impacts/mod-as-02/page.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FichaAmbientalForm } from '@/components/forms/ficha-ambiental/form';
import { createColumns } from '@/components/forms/ficha-ambiental/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFichaAmbiental } from '@/hooks/use-ficha-ambiental';
import { FichaInformacaoAmbientalFormValues } from '@/lib/validations/ficha-ambiental';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

export default function FichaAmbientalPage() {
  const params = useParams();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useFichaAmbiental();

  // Handle successful form submission
  const handleSuccess = async (
    formData: FichaInformacaoAmbientalFormValues
  ) => {
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
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Registro não encontrado.');
    }
  };

  // Handle view button click
  const handleView = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      // For now, we just edit the item in read-only mode (a future enhancement could be a separate view mode)
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

  // Create columns with actions
  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  });

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                MOD.AS.02 - Ficha de informação ambiental preliminar
              </CardTitle>
              <CardDescription>
                Gestão e cadastro de fichas de informação ambiental preliminar
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
              {showForm ? 'Cancelar' : 'Nova Ficha'}
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
            <Alert variant='destructive' className='mb-4'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Projeto não selecionado</AlertTitle>
              <AlertDescription>
                Selecione um projeto no painel lateral para visualizar os
                registros.
              </AlertDescription>
            </Alert>
          ) : (
            <>
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
                        {selectedItem?.id
                          ? 'Editar Ficha de Informação Ambiental'
                          : 'Nova Ficha de Informação Ambiental'}
                      </h3>
                      <FichaAmbientalForm
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
                        Nenhuma ficha ambiental registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando uma ficha de informação ambiental
                        preliminar para um projeto.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar Ficha Ambiental
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Alert className='mb-4 bg-blue-50 border-blue-200'>
                        <Info className='h-4 w-4 text-blue-600' />
                        <AlertTitle className='text-blue-600'>
                          Informação
                        </AlertTitle>
                        <AlertDescription className='text-blue-700'>
                          As fichas de informação ambiental preliminar são
                          utilizadas para o processo de licenciamento ambiental,
                          fornecendo informações essenciais sobre o impacto
                          ambiental potencial de um projeto.
                        </AlertDescription>
                      </Alert>

                      <DataTable
                        columns={columns}
                        data={data}
                        searchKey='nomeActividade'
                        filename='fichas-ambientais'
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
