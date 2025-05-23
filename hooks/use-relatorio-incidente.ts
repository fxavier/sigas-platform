// hooks/use-relatorio-incidente.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { RelatorioIncidenteFormData } from '@/lib/validations/relatorio-incidente';

// Define relationship types
interface PessoaEnvolvida {
  id: string;
  nome: string;
  funcao: string;
}

interface AccaoCorrectiva {
  id: string;
  accao: string;
  prazo: Date;
  responsavel: string;
}

interface Fotografia {
  id: string;
  fotografia: string;
}

// Define the API response type that includes the relationships
export interface RelatorioIncidenteResponse
  extends Omit<
    RelatorioIncidenteFormData,
    'pessoasEnvolvidasIds' | 'accoesCorrectivasIds' | 'fotografiasIds'
  > {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  equipaInvestigacaoIncidente: PessoaEnvolvida[];
  accoesCorrectivasPermanentesTomar: AccaoCorrectiva[];
  fotografias: Fotografia[];
}

// Type used within the component
export type RelatorioIncidente = RelatorioIncidenteResponse;

export const useRelatorioIncidente = () => {
  const [data, setData] = useState<RelatorioIncidenteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<RelatorioIncidenteFormData>({
    endpoint: 'relatorio-incidente',
  });

  // Fetch data based on tenant and project
  const fetchData = async () => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forms/relatorio-incidente?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: RelatorioIncidenteResponse[] = result.map(
        (item: any) => {
          // Ensure we have arrays for relationships (even if empty)
          const equipaInvestigacaoIncidente = Array.isArray(
            item.equipaInvestigacaoIncidente
          )
            ? item.equipaInvestigacaoIncidente
            : [];
          const accoesCorrectivasPermanentesTomar = Array.isArray(
            item.accoesCorrectivasPermanentesTomar
          )
            ? item.accoesCorrectivasPermanentesTomar
            : [];
          const fotografias = Array.isArray(item.fotografias)
            ? item.fotografias
            : [];

          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            dataIncidente: new Date(item.dataIncidente),
            horaIncident: new Date(item.horaIncident),
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
            dataInvestigacaoCompleta: item.dataInvestigacaoCompleta
              ? new Date(item.dataInvestigacaoCompleta)
              : null,
            ausenciaOuFalhaDefesas: item.ausenciaOuFalhaDefesas,
            descricaoAusenciaOuFalhaDefesas:
              item.descricaoAusenciaOuFalhaDefesas,
            accoesIndividuaisOuEquipe: item.accoesIndividuaisOuEquipe,
            descricaoAccaoIndividualOuEquipe:
              item.descricaoAccaoIndividualOuEquipe,
            tarefaOuCondicoesAmbientaisLocalTrabalho:
              item.tarefaOuCondicoesAmbientaisLocalTrabalho,
            descricaoTarefaOuCondicoesAmbientaisLocalTrabalho:
              item.descricaoTarefaOuCondicoesAmbientaisLocalTrabalho,
            tarefaOuCondicoesAmbientaisHumano:
              item.tarefaOuCondicoesAmbientaisHumano,
            descricaoTarefaOuCondicoesAmbientaisHumano:
              item.descricaoTarefaOuCondicoesAmbientaisHumano,
            factoresOrganizacionais: item.factoresOrganizacionais,
            descricaoFactoresOrganizacionais:
              item.descricaoFactoresOrganizacionais,
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
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            equipaInvestigacaoIncidente,
            accoesCorrectivasPermanentesTomar,
            fotografias,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching relatorio incidente:', err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when tenant or project changes
  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      fetchData();
    } else {
      setData([]);
    }
  }, [currentTenantId, currentProjectId]);

  // Create new record
  const create = async (formData: RelatorioIncidenteFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (id: string, formData: RelatorioIncidenteFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.update(id, formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Delete record
  const remove = async (id: string) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.remove(id, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Get pessoas envolvidas
  const fetchPessoasEnvolvidas = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/pessoas-envolvidas?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar pessoas envolvidas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching pessoas envolvidas:', err);
      return [];
    }
  };

  // Get accoes correctivas
  const fetchAccoesCorrectivas = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/accoes-correctivas?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar ações correctivas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching accoes correctivas:', err);
      return [];
    }
  };

  // Get fotografias
  const fetchFotografias = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/fotografias-incidente?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar fotografias');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching fotografias:', err);
      return [];
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
    create,
    update,
    remove,
    fetchPessoasEnvolvidas,
    fetchAccoesCorrectivas,
    fetchFotografias,
  };
};
