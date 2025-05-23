// app/tenants/[slug]/esms-elements/relatorio-incidente/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RelatorioIncidenteForm } from '@/components/forms/relatorio-incidente';
import { createColumns } from '@/components/forms/relatorio-incidente/columns';
import { DataTable } from '@/components/ui/data-table';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Info, AlertTriangle, FileX } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  useRelatorioIncidente,
  type RelatorioIncidente,
} from '@/hooks/use-relatorio-incidente';
import { RelatorioIncidenteFormData } from '@/lib/validations/relatorio-incidente';
import { toast } from 'sonner';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Badge } from '@/components/ui/badge';

export default function RelatorioIncidentePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentTenantId, currentProjectId, setCurrentProjectId } =
    useTenantProjectContext();
  const slug = params.slug as string;

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    RelatorioIncidente | undefined
  >(undefined);

  // Initialize hook for data fetching
  const { data, isLoading, error, fetchData, create, update, remove } =
    useRelatorioIncidente();

  // Set project ID from URL query param if available
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setCurrentProjectId(projectId);
    }
  }, [searchParams, setCurrentProjectId]);

  // Handle successful form submission
  const handleSuccess = async (formData: RelatorioIncidenteFormData) => {
    try {
      if (selectedItem?.id) {
        await update(selectedItem.id, formData);
        toast.success('Relatório atualizado com sucesso');
      } else {
        await create(formData);
        toast.success('Relatório criado com sucesso');
      }

      // Reset form and reload data
      setShowForm(false);
      setSelectedItem(undefined);
      fetchData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ocorreu um erro ao salvar o relatório.');
    }
  };

  // Handle edit button click
  const handleEdit = (id: string) => {
    const item = data.find((item) => item.id === id);
    if (item) {
      // Convert the response object to form data structure
      const formData: RelatorioIncidenteFormData = {
        tenantId: item.tenantId,
        projectId: item.projectId,
        dataIncidente: item.dataIncidente,
        horaIncident: item.horaIncident,
        descricaoDoIncidente: item.descricaoDoIncidente,
        detalhesLesao: item.detalhesLesao,
        accoesImediatasTomadas: item.accoesImediatasTomadas,
        tipoFuncionario: item.tipoFuncionario,
        categoriaPessoaEnvolvida: item.categoriaPessoaEnvolvida,
        formaActividade: item.formaActividade,
        foiRealizadaAvaliacaoRisco: item.foiRealizadaAvaliacaoRisco,
        existePadraoControleRisco: item.existePadraoControleRisco,
        tipoConsequenciaIncidenteReal: item.tipoConsequenciaIncidenteReal,
        tipoConsequenciaIncidentePotencial:
          item.tipoConsequenciaIncidentePotencial,
        efeitosIncidenteReal: item.efeitosIncidenteReal,
        classificacaoGravidadeIncidenteReal:
          item.classificacaoGravidadeIncidenteReal,
        efeitosIncidentePotencial: item.efeitosIncidentePotencial,
        classificacaoGravidadeIncidentePotencial:
          item.classificacaoGravidadeIncidentePotencial,
        esteFoiIncidenteSemBarreira: item.esteFoiIncidenteSemBarreira,
        foiIncidenteRepetitivo: item.foiIncidenteRepetitivo,
        foiIncidenteResultanteFalhaProcesso:
          item.foiIncidenteResultanteFalhaProcesso,
        danosMateriais: item.danosMateriais,
        valorDanos: item.valorDanos,
        statusInvestigacao: item.statusInvestigacao,
        dataInvestigacaoCompleta: item.dataInvestigacaoCompleta,
        ausenciaOuFalhaDefesas: item.ausenciaOuFalhaDefesas,
        descricaoAusenciaOuFalhaDefesas: item.descricaoAusenciaOuFalhaDefesas,
        accoesIndividuaisOuEquipe: item.accoesIndividuaisOuEquipe,
        descricaoAccaoIndividualOuEquipe: item.descricaoAccaoIndividualOuEquipe,
        tarefaOuCondicoesAmbientaisLocalTrabalho:
          item.tarefaOuCondicoesAmbientaisLocalTrabalho,
        descricaoTarefaOuCondicoesAmbientaisLocalTrabalho:
          item.descricaoTarefaOuCondicoesAmbientaisLocalTrabalho,
        tarefaOuCondicoesAmbientaisHumano:
          item.tarefaOuCondicoesAmbientaisHumano,
        descricaoTarefaOuCondicoesAmbientaisHumano:
          item.descricaoTarefaOuCondicoesAmbientaisHumano,
        factoresOrganizacionais: item.factoresOrganizacionais,
        descricaoFactoresOrganizacionais: item.descricaoFactoresOrganizacionais,
        causasSubjacentesEPrincipaisFactoresContribuintes:
          item.causasSubjacentesEPrincipaisFactoresContribuintes,
        descricaoIncidenteAposInvestigacao:
          item.descricaoIncidenteAposInvestigacao,
        principaisLicoes: item.principaisLicoes,
        resgistoRiscoActivosActualizadosAposInvestigacao:
          item.resgistoRiscoActivosActualizadosAposInvestigacao,
        voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao:
          item.voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao,
        comoPartilhou: item.comoPartilhou,
        superiorHierarquicoResponsavel: item.superiorHierarquicoResponsavel,
        telefoneSuperiorHierarquicoResponsavel:
          item.telefoneSuperiorHierarquicoResponsavel,
        tituloSuperiorHierarquicoResponsavel:
          item.tituloSuperiorHierarquicoResponsavel,
        emailSuperiorHierarquicoResponsavel:
          item.emailSuperiorHierarquicoResponsavel,
        // Extract IDs from the relationship arrays
        pessoasEnvolvidasIds: item.equipaInvestigacaoIncidente.map(
          (pessoa) => pessoa.id
        ),
        accoesCorrectivasIds: item.accoesCorrectivasPermanentesTomar.map(
          (accao) => accao.id
        ),
        fotografiasIds: item.fotografias.map((foto) => foto.id),
      };

      // Create a combined item that TypeScript will accept
      const editItem = {
        ...formData,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        equipaInvestigacaoIncidente: item.equipaInvestigacaoIncidente,
        accoesCorrectivasPermanentesTomar:
          item.accoesCorrectivasPermanentesTomar,
        fotografias: item.fotografias,
      };

      setSelectedItem(editItem);
      setShowForm(true);
    } else {
      toast.error('Relatório não encontrado.');
    }
  };

  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      try {
        await remove(id);
        toast.success('Relatório excluído com sucesso');
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Ocorreu um erro ao excluir o relatório.');
      }
    }
  };

  // Count statistics
  const stats = data.reduce(
    (acc, item) => {
      // Count by effect type
      acc.effects[item.efeitosIncidenteReal] =
        (acc.effects[item.efeitosIncidenteReal] || 0) + 1;

      // Count by employee type
      acc.employeeTypes[item.tipoFuncionario] =
        (acc.employeeTypes[item.tipoFuncionario] || 0) + 1;

      // Count material damages
      if (item.danosMateriais === 'SIM') {
        acc.materialDamages++;
        if (item.valorDanos) {
          acc.totalDamageValue += Number(item.valorDanos);
        }
      }

      // Count by status
      if (item.statusInvestigacao) {
        acc.investigationStatus[item.statusInvestigacao] =
          (acc.investigationStatus[item.statusInvestigacao] || 0) + 1;
      }

      return acc;
    },
    {
      effects: {} as Record<string, number>,
      employeeTypes: {} as Record<string, number>,
      materialDamages: 0,
      totalDamageValue: 0,
      investigationStatus: {} as Record<string, number>,
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
                <FileX className='h-5 w-5 text-primary' />
                Relatórios de Incidentes
              </CardTitle>
              <CardDescription>
                Gestão e registro detalhado de incidentes e acidentes de
                trabalho
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
              {showForm ? 'Cancelar' : 'Novo Relatório'}
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
                relatórios.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {data.length > 0 && (
                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                  <FileX className='h-4 w-4 text-blue-600' />
                  <AlertTitle className='text-blue-800'>
                    Estatísticas de Incidentes
                  </AlertTitle>
                  <AlertDescription className='text-blue-700'>
                    <div className='mt-2 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        <span className='text-sm font-medium'>
                          Total de incidentes:
                        </span>
                        <Badge variant='default'>{data.length}</Badge>
                      </div>

                      {Object.keys(stats.effects).length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Por efeito:
                          </span>
                          {Object.entries(stats.effects).map(
                            ([effect, count]) => (
                              <Badge
                                key={effect}
                                variant='secondary'
                                className='text-xs'
                              >
                                {effect === 'SAUDE'
                                  ? 'Saúde'
                                  : effect === 'SEGURANCA'
                                  ? 'Segurança'
                                  : effect === 'AMBIENTE'
                                  ? 'Ambiente'
                                  : effect === 'COMUNIDADE'
                                  ? 'Comunidade'
                                  : effect}
                                : {count}
                              </Badge>
                            )
                          )}
                        </div>
                      )}

                      {stats.materialDamages > 0 && (
                        <div className='flex flex-wrap gap-2 items-center'>
                          <span className='text-sm font-medium'>
                            Danos materiais:
                          </span>
                          <Badge variant='destructive' className='text-xs'>
                            {stats.materialDamages} incidentes
                          </Badge>
                          {stats.totalDamageValue > 0 && (
                            <Badge variant='outline' className='text-xs'>
                              Total:{' '}
                              {stats.totalDamageValue.toLocaleString('pt-MZ', {
                                style: 'currency',
                                currency: 'MZN',
                              })}
                            </Badge>
                          )}
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
                        {selectedItem ? 'Editar Relatório' : 'Novo Relatório'}
                      </h3>
                      <RelatorioIncidenteForm
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
                      <FileX className='h-12 w-12 mx-auto text-gray-300 mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum relatório de incidente registrado
                      </h3>
                      <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                        Comece registrando incidentes e acidentes de trabalho
                        para manter um histórico detalhado e análise de
                        segurança.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedItem(undefined);
                          setShowForm(true);
                        }}
                        className='gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        Adicionar relatório
                      </Button>
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data}
                      searchKey='descricaoDoIncidente'
                      filename='relatorios-incidentes'
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
