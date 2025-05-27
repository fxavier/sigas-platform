// app/tenants/[slug]/esms-elements/external-communication-and-grievance-mechanism/fr-as-026/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FichaRegistoQueixasReclamacoesForm } from '@/components/forms/ficha-registo-queixas-reclamacoes/form';
import { createColumns } from '@/components/forms/ficha-registo-queixas-reclamacoes/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useFichaRegistoQueixasReclamacoes,
  type FichaRegistoQueixasReclamacoes,
} from '@/hooks/use-ficha-registo-queixas-reclamacoes';
import { FichaRegistoQueixasReclamacoesFormData } from '@/lib/validations/ficha-registo-queixas-reclamacoes';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function FichaRegistoQueixasReclamacoesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    FichaRegistoQueixasReclamacoes | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useFichaRegistoQueixasReclamacoes();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (
    formData: FichaRegistoQueixasReclamacoesFormData
  ) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Ficha atualizada com sucesso');
      } else {
        await create(formData);
        toast.success('Ficha criada com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar a ficha.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      // Convert the response object to form data structure
      const formData: FichaRegistoQueixasReclamacoesFormData = {
        tenantId: item.tenantId,
        projectId: item.projectId,
        numeroQueixa: item.numeroQueixa,
        nomeCompletoReclamante: item.nomeCompletoReclamante,
        genero: item.genero,
        idade: item.idade,
        celular: item.celular,
        email: item.email,
        endereco: item.endereco,
        quarteirao: item.quarteirao,
        bairro: item.bairro,
        localidade: item.localidade,
        postoAdministrativo: item.postoAdministrativo,
        distrito: item.distrito,
        local: item.local,
        dataReclamacao: item.dataReclamacao,
        hora: item.hora,
        breveDescricaoFactos: item.breveDescricaoFactos,
        queixaAceita: item.queixaAceita,
        justificativaParaRejeicao: item.justificativaParaRejeicao,
        reclamanteNotificado: item.reclamanteNotificado,
        metodoNotificacao: item.metodoNotificacao,
        outroMetodoNotificacao: item.outroMetodoNotificacao,
        categoriaQueixaId: item.categoriaQueixaId,
        descricao_factos_apos_investigacao:
          item.descricao_factos_apos_investigacao,
        dataEncerramento: item.dataEncerramento,
        reclamanteNotificadoSobreEncerramento:
          item.reclamanteNotificadoSobreEncerramento,
        reclamanteSatisfeito: item.reclamanteSatisfeito,
        recursosGastosReparacaoReclamacao:
          item.recursosGastosReparacaoReclamacao,
        dataEncerramentoReclamacao: item.dataEncerramentoReclamacao,
        diasDesdeQueixaAoEncerramento: item.diasDesdeQueixaAoEncerramento,
        monitoriaAposEncerramento: item.monitoriaAposEncerramento,
        accaoMonitoriaAposEncerramento: item.accaoMonitoriaAposEncerramento,
        responsavelMonitoriaAposEncerramento:
          item.responsavelMonitoriaAposEncerramento,
        prazoMonitoriaAposEncerramento: item.prazoMonitoriaAposEncerramento,
        estadoMonitoriaAposEncerramento: item.estadoMonitoriaAposEncerramento,
        accoesPreventivasSugeridas: item.accoesPreventivasSugeridas,
        responsavelAccoesPreventivasSugeridas:
          item.responsavelAccoesPreventivasSugeridas,
        prazoAccoesPreventivasSugeridas: item.prazoAccoesPreventivasSugeridas,
        estadoAccoesPreventivasSugeridas: item.estadoAccoesPreventivasSugeridas,
        // Extract IDs from the relationship arrays
        subcategoriaQueixaIds: item.subcategoriaQueixa.map((sub) => sub.id),
        resolucaoQueixaIds: item.resolucaoQueixa.map((res) => res.id),
        fotosDocumentosComprovativoEncerramentoIds:
          item.fotosDocumentosComprovativoEncerramento.map((foto) => foto.id),
      };

      // Create a combined item that TypeScript will accept
      const editItem = {
        ...formData,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        categoriaQueixa: item.categoriaQueixa,
        subcategoriaQueixa: item.subcategoriaQueixa,
        resolucaoQueixa: item.resolucaoQueixa,
        fotosDocumentosComprovativoEncerramento:
          item.fotosDocumentosComprovativoEncerramento,
      };

      setSelectedItem(editItem);
      setShowForm(true);
    } else {
      toast.error('Ficha não encontrada.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ficha?')) {
      try {
        await remove(id);
        toast.success('Ficha excluída com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir a ficha.');
      }
    }
  };

  // Count statistics
  const stats = data.reduce(
    (acc, item) => {
      // Count by acceptance status
      acc.statusCounts[item.queixaAceita] =
        (acc.statusCounts[item.queixaAceita] || 0) + 1;

      // Count by gender
      acc.genderCounts[item.genero] = (acc.genderCounts[item.genero] || 0) + 1;

      // Count closed vs open
      if (item.dataEncerramento) {
        acc.closedCount++;
        if (item.reclamanteSatisfeito === 'SIM') {
          acc.satisfiedCount++;
        }
        if (item.diasDesdeQueixaAoEncerramento) {
          acc.totalResolutionDays += item.diasDesdeQueixaAoEncerramento;
          acc.resolutionTimeCount++;
        }
      } else {
        acc.openCount++;
      }

      // Count by notification method
      if (item.metodoNotificacao) {
        acc.notificationMethods[item.metodoNotificacao] =
          (acc.notificationMethods[item.metodoNotificacao] || 0) + 1;
      }

      // Count monitoring
      if (item.monitoriaAposEncerramento === 'SIM') {
        acc.monitoringCount++;
      }

      return acc;
    },
    {
      statusCounts: {} as Record<string, number>,
      genderCounts: {} as Record<string, number>,
      closedCount: 0,
      openCount: 0,
      satisfiedCount: 0,
      totalResolutionDays: 0,
      resolutionTimeCount: 0,
      notificationMethods: {} as Record<string, number>,
      monitoringCount: 0,
    }
  );

  const averageResolutionTime =
    stats.resolutionTimeCount > 0
      ? Math.round(stats.totalResolutionDays / stats.resolutionTimeCount)
      : 0;

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
                FR.AS.026 - Ficha de Registo de Queixas e Reclamações
              </CardTitle>
              <CardDescription>
                Sistema de gestão de queixas e reclamações externas com
                rastreamento completo do processo de resolução
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
            <Alert className='mb-4' variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Projeto não selecionado</AlertTitle>
              <AlertDescription>
                Selecione um projeto no painel lateral para visualizar as
                fichas.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <FileText className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas de Queixas e Reclamações
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <span className='text-sm font-medium'>
                          Total de queixas:
                        </span>
                        <Badge variant='default'>{data.length}</Badge>
                      </div>

                      <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm font-medium'>Status:</span>
                        <Badge variant='default' className='text-xs'>
                          Abertas: {stats.openCount}
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          Fechadas: {stats.closedCount}
                        </Badge>
                        {stats.satisfiedCount > 0 && (
                          <Badge variant='outline' className='text-xs'>
                            Satisfeitos: {stats.satisfiedCount}
                          </Badge>
                        )}
                      </div>

                      {Object.keys(stats.statusCounts).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por aceitação:
                          </span>
                          {Object.entries(stats.statusCounts).map(
                            ([status, count]) => (
                              <Badge
                                key={status}
                                variant={
                                  status === 'SIM' ? 'default' : 'destructive'
                                }
                                className='text-xs'
                              >
                                {status === 'SIM' ? 'Aceitas' : 'Rejeitadas'}:{' '}
                                {count}
                              </Badge>
                            )
                          )}
                        </div>
                      )}

                      {averageResolutionTime > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Tempo médio de resolução:
                          </span>
                          <Badge variant='outline' className='text-xs'>
                            {averageResolutionTime} dias
                          </Badge>
                        </div>
                      )}

                      {stats.monitoringCount > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Com monitoria pós-encerramento:
                          </span>
                          <Badge variant='secondary' className='text-xs'>
                            {stats.monitoringCount} queixas
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
                        {selectedItem ? 'Editar Ficha' : 'Nova Ficha'}
                      </h3>
                      <FichaRegistoQueixasReclamacoesForm
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
                        Nenhuma ficha de queixas registrada
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece registrando queixas e reclamações externas para
                        manter um sistema de gestão de comunicações eficaz.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar ficha
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='numeroQueixa'
                      filename='fichas-registo-queixas-reclamacoes'
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
