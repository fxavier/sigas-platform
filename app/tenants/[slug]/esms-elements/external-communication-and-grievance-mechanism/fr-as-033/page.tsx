// app/tenants/[slug]/esms-elements/external-communication-and-grievance-mechanism/fr-as-033/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormularioRegistoReclamacoesTrabalhadoresForm } from '@/components/forms/formulario-registo-reclamacoes-trabalhadores/form';
import { createColumns } from '@/components/forms/formulario-registo-reclamacoes-trabalhadores/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, Users } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useWorkerComplaintForm,
  type FormularioRegistoReclamacoesTrabalhadoresData,
} from '@/hooks/use-formulario-registo-reclamacoes-trabalhadores';
import { FormularioRegistoReclamacoesTrabalhadoresFormData } from '@/lib/validations/formulario-registo-reclamacoes-trabalhadores';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function FormularioRegistoReclamacoesTrabalhadoresPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    FormularioRegistoReclamacoesTrabalhadoresData | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useWorkerComplaintForm();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (
    formData: FormularioRegistoReclamacoesTrabalhadoresFormData
  ) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Formulário atualizado com sucesso');
      } else {
        await create(formData);
        toast.success('Formulário criado com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o formulário.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      // Convert the response object to form data structure
      const formData: FormularioRegistoReclamacoesTrabalhadoresFormData = {
        tenantId: item.tenantId,
        projectId: item.projectId,
        nome: item.nome,
        empresa: item.empresa,
        dataReclamacao: item.dataReclamacao,
        horaReclamacao: item.horaReclamacao,
        metodoPreferidoDoContacto: item.metodoPreferidoDoContacto,
        detalhesDoContacto: item.detalhesDoContacto,
        linguaPreferida: item.linguaPreferida,
        outraLinguaPreferida: item.outraLinguaPreferida,
        detalhesDareclamacao: item.detalhesDareclamacao,
        numeroIdentificacaoResponsavelRecepcao:
          item.numeroIdentificacaoResponsavelRecepcao,
        nomeResponsavelRecepcao: item.nomeResponsavelRecepcao,
        funcaoResponsavelRecepcao: item.funcaoResponsavelRecepcao,
        assinaturaResponsavelRecepcao: item.assinaturaResponsavelRecepcao,
        dataRecepcao: item.dataRecepcao,
        detalhesResponsavelRecepcao: item.detalhesResponsavelRecepcao,
        detalhesAcompanhamento: item.detalhesAcompanhamento,
        dataEncerramento: item.dataEncerramento,
        assinatura: item.assinatura,
        confirmarRecepcaoResposta: item.confirmarRecepcaoResposta,
        nomeDoConfirmante: item.nomeDoConfirmante,
        dataConfirmacao: item.dataConfirmacao,
        assinaturaConfirmacao: item.assinaturaConfirmacao,
      };

      // Create a combined item that TypeScript will accept
      const editItem = {
        ...formData,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };

      setSelectedItem(editItem);
      setShowForm(true);
    } else {
      toast.error('Formulário não encontrado.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
      try {
        await remove(id);
        toast.success('Formulário excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o formulário.');
      }
    }
  };

  // Count statistics
  const stats = data.reduce(
    (acc, item) => {
      // Count by contact method
      acc.contactMethods[item.metodoPreferidoDoContacto] =
        (acc.contactMethods[item.metodoPreferidoDoContacto] || 0) + 1;

      // Count by language preference
      acc.languages[item.linguaPreferida] =
        (acc.languages[item.linguaPreferida] || 0) + 1;

      // Count by status
      if (item.dataEncerramento) {
        acc.closedCount++;
        if (item.confirmarRecepcaoResposta === 'SIM') {
          acc.confirmedCount++;
        }
      } else {
        acc.openCount++;
      }

      // Count unique companies
      if (!acc.companies.includes(item.empresa)) {
        acc.companies.push(item.empresa);
      }

      // Count anonymous vs named
      if (item.nome) {
        acc.namedCount++;
      } else {
        acc.anonymousCount++;
      }

      return acc;
    },
    {
      contactMethods: {} as Record<string, number>,
      languages: {} as Record<string, number>,
      closedCount: 0,
      openCount: 0,
      confirmedCount: 0,
      companies: [] as string[],
      namedCount: 0,
      anonymousCount: 0,
    }
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
                <Users className='h-5 w-5 text-primary' />
                FR.AS.033 - Formulário de Registo de Reclamações dos
                Trabalhadores
              </CardTitle>
              <CardDescription>
                Sistema de gestão de reclamações internas dos trabalhadores com
                processo completo de recepção e acompanhamento
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
              {showForm ? 'Cancelar' : 'Novo Formulário'}
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
                formulários.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <Users className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas de Reclamações dos Trabalhadores
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <span className='text-sm font-medium'>
                          Total de reclamações:
                        </span>
                        <Badge variant='default'>{data.length}</Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>Status:</span>
                        <Badge variant='default' className='text-xs'>
                          Em Aberto: {stats.openCount}
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          Encerradas: {stats.closedCount}
                        </Badge>
                        {stats.confirmedCount > 0 && (
                          <Badge variant='outline' className='text-xs'>
                            Confirmadas: {stats.confirmedCount}
                          </Badge>
                        )}
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>Anonimato:</span>
                        <Badge variant='default' className='text-xs'>
                          Identificadas: {stats.namedCount}
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          Anônimas: {stats.anonymousCount}
                        </Badge>
                      </div>

                      {Object.keys(stats.contactMethods).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por método de contacto:
                          </span>
                          {Object.entries(stats.contactMethods).map(
                            ([method, count]) => (
                              <Badge
                                key={method}
                                variant='outline'
                                className='text-xs'
                              >
                                {method === 'TELEFONE'
                                  ? 'Telefone'
                                  : method === 'EMAIL'
                                  ? 'Email'
                                  : method === 'PRESENCIAL'
                                  ? 'Presencial'
                                  : method}
                                : {count}
                              </Badge>
                            )
                          )}
                        </div>
                      )}

                      {stats.companies.length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Empresas envolvidas:
                          </span>
                          <Badge variant='outline' className='text-xs'>
                            {stats.companies.length} empresa
                            {stats.companies.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
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
                        {selectedItem ? 'Editar Formulário' : 'Novo Formulário'}
                      </h3>
                      <FormularioRegistoReclamacoesTrabalhadoresForm
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
                      <Users className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum formulário de reclamação registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece registrando reclamações dos trabalhadores para
                        manter um canal de comunicação interna efetivo.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar formulário
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='empresa'
                      filename='formularios-registo-reclamacoes-trabalhadores'
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
