// app/tenants/[slug]/esms-documents/[documentType]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ESMSDocumentForm } from '@/components/forms/esms-documents/document-form';
import { createESMSDocumentColumns } from '@/components/forms/esms-documents/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useESMSDocuments,
  type ESMSDocumentResponse,
} from '@/hooks/use-esms-documents';
import {
  ESMSDocumentFormData,
  DocumentType,
  documentTypeLabels,
} from '@/lib/validations/esms-documents';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function ESMSDocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;
  const documentType = params.documentType as DocumentType;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ESMSDocumentResponse | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useESMSDocuments(documentType);

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: ESMSDocumentFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Documento atualizado com sucesso');
      } else {
        await create(formData);
        toast.success('Documento criado com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Ocorreu um erro ao salvar o documento.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setShowForm(true);
    } else {
      toast.error('Documento não encontrado.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await remove(id);
        toast.success('Documento excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Ocorreu um erro ao excluir o documento.');
      }
    }
  };

  // Handle view/download button click
  const handleDownload = (fileUrl: string, fileName: string) => {
    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao fazer download do arquivo');
    }
  };

  // Handle view document
  const handleView = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      window.open(item.ficheiro, '_blank');
    }
  };

  // Count status categories
  const statusCounts = data.reduce(
    (acc: Record<string, number>, item: ESMSDocumentResponse) => {
      const status = item.estadoDocumento;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  // Create columns with actions
  const columns = createESMSDocumentColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
    onDownload: handleDownload,
  });

  // Validate document type
  if (!documentTypeLabels[documentType]) {
    return (
      <div className='space-y-4 p-6'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Tipo de documento inválido: {documentType}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                {documentTypeLabels[documentType]}
              </CardTitle>
              <CardDescription>
                Gestão de documentos{' '}
                {documentTypeLabels[documentType].toLowerCase()} do projeto
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
              {showForm
                ? 'Cancelar'
                : `Novo ${documentTypeLabels[documentType].slice(0, -1)}`}
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
                documentos.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {Object.keys(statusCounts).length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <FileText className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Resumo de Estados
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {Object.entries(statusCounts).map(
                        ([status, count]: [string, number]) => {
                          const variantMap = {
                            REVISAO: 'outline' as const,
                            EM_USO: 'default' as const,
                            ABSOLETO: 'destructive' as const,
                          };

                          return (
                            <Badge
                              key={status}
                              variant={
                                variantMap[status as keyof typeof variantMap] ||
                                'outline'
                              }
                              className='text-sm'
                            >
                              {status === 'REVISAO' && 'Em Revisão'}
                              {status === 'EM_USO' && 'Em Uso'}
                              {status === 'ABSOLETO' && 'Obsoleto'}: {count}
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
                  <p>Carregando documentos...</p>
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
                        {selectedItem ? 'Editar Documento' : 'Novo Documento'}
                      </h3>
                      <ESMSDocumentForm
                        documentType={documentType}
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
                        Nenhum documento registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece adicionando{' '}
                        {documentTypeLabels[documentType].toLowerCase()} para
                        organizar a documentação do projeto.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar documento
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='nomeDocumento'
                      filename={`${documentType}-${Date.now()}`}
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
