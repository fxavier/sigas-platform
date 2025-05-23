// hooks/use-relatorio-inicial-incidente.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { RelatorioInicialIncidenteFormData } from '@/lib/validations/relatorio-inicial-incidente';

// Define relationship types
interface Incidente {
  id: string;
  descricao: string;
}

// Define the API response type that includes the relationships
export interface RelatorioInicialIncidenteResponse
  extends Omit<RelatorioInicialIncidenteFormData, 'incidentesIds'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  incidentes: Incidente[];
}

// Type used within the component
export type RelatorioInicialIncidente = RelatorioInicialIncidenteResponse;

export const useRelatorioInicialIncidente = () => {
  const [data, setData] = useState<RelatorioInicialIncidenteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<RelatorioInicialIncidenteFormData>({
    endpoint: 'relatorio-inicial-incidente',
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
        `/api/forms/relatorio-inicial-incidente?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: RelatorioInicialIncidenteResponse[] = result.map(
        (item: any) => {
          // Ensure we have arrays for relationships (even if empty)
          const incidentes = Array.isArray(item.incidentes)
            ? item.incidentes
            : [];

          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            dataIncidente: new Date(item.dataIncidente),
            horaIncidente: new Date(item.horaIncidente),
            seccao: item.seccao,
            localIncidente: item.localIncidente,
            dataComunicacao: new Date(item.dataComunicacao),
            supervisor: item.supervisor,
            tipoIncidente: item.tipoIncidente,
            empregado: item.empregado,
            nomeFuncionario: item.nomeFuncionario,
            subcontratante: item.subcontratante,
            nomeSubcontratado: item.nomeSubcontratado,
            descricaoCircunstanciaIncidente:
              item.descricaoCircunstanciaIncidente,
            infoSobreFeriodosETratamentoFeito:
              item.infoSobreFeriodosETratamentoFeito,
            declaracaoDeTestemunhas: item.declaracaoDeTestemunhas,
            conclusaoPreliminar: item.conclusaoPreliminar,
            recomendacoes: item.recomendacoes,
            inclusaoEmMateriaSeguranca: item.inclusaoEmMateriaSeguranca,
            prazo: item.prazo ? new Date(item.prazo) : null,
            necessitaDeInvestigacaoAprofundada:
              item.necessitaDeInvestigacaoAprofundada,
            incidenteReportavel: item.incidenteReportavel,
            credoresObrigadosASeremNotificados:
              item.credoresObrigadosASeremNotificados,
            autorDoRelatorio: item.autorDoRelatorio,
            dataCriacao: new Date(item.dataCriacao),
            nomeProvedor: item.nomeProvedor,
            data: new Date(item.data),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            incidentes,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching relatorio inicial incidente:', err);
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
  const create = async (formData: RelatorioInicialIncidenteFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (
    id: string,
    formData: RelatorioInicialIncidenteFormData
  ) => {
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

  // Get incidentes
  const fetchIncidentes = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/incidentes?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar incidentes');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching incidentes:', err);
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
    fetchIncidentes,
  };
};
