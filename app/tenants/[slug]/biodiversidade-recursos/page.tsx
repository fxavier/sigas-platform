// app/tenants/[slug]/esms-elements/biodiversidade-recursos/page.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BiodiversidadeRecursosForm } from '@/components/forms/biodiversidade-recursos';
import { createColumns } from '@/components/forms/biodiversidade-recursos/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Sprout } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useBiodiversidadeRecursos } from '@/hooks/use-biodiversidade-recursos';
import { BiodiversidadeRecursosFormData } from '@/lib/validations/biodiversidade-recursos';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import Link from 'next/link';

export default function BiodiversidadeRecursosPage() {
  const params = useParams();
  const { currentTenantId } = useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useBiodiversidadeRecursos();

  // Handle successful form submission
  const handleSuccess = async (formData: BiodiversidadeRecursosFormData) => {
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

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir este recurso? Este recurso não poderá ser excluído se estiver sendo usado em avaliações de risco.'
      )
    ) {
      try {
        await remove(id);
        toast.success('Recurso excluído com sucesso');
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
  });

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Sprout className='h-5 w-5 text-primary' />
                Recursos de Biodiversidade
              </CardTitle>
              <CardDescription>
                Cadastro e gestão de recursos de biodiversidade para avaliação
                de impactos ambientais
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(undefined);
                setShowForm(!showForm);
              }}
              disabled={isLoading || !currentTenantId}
              className='gap-2'
            >
              <Plus className='h-4 w-4' />
              {showForm ? 'Cancelar' : 'Novo Recurso'}
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
                          ? 'Editar Recurso'
                          : 'Novo Recurso de Biodiversidade'}
                      </h3>
                      <BiodiversidadeRecursosForm
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
                      <Sprout className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum recurso de biodiversidade cadastrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando recursos de biodiversidade para uso
                        nas avaliações de impacto ambiental.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar Recurso
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
                          Os recursos de biodiversidade cadastrados aqui serão
                          utilizados nas triagens ambientais para identificação
                          de riscos e impactos. Depois de cadastrados, você
                          poderá avaliar cada recurso em suas triagens
                          ambientais.
                        </AlertDescription>
                      </Alert>

                      <DataTable
                        columns={columns}
                        data={data}
                        searchKey='description'
                        filename='recursos-biodiversidade'
                      />

                      <div className='mt-4'>
                        <Link
                          href={`/tenants/${slug}/esms-elements/triagem-ambiental`}
                        >
                          <Button variant='outline' className='gap-2'>
                            <Sprout className='h-4 w-4' />
                            Ir para Triagem Ambiental
                          </Button>
                        </Link>
                      </div>
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
