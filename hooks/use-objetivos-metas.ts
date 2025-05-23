// hooks/use-objetivos-metas.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { ObjetivosMetasFormData } from '@/lib/validations/objetivos-metas';

// Define relationship types
interface MembroEquipa {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
}

interface TabelaAcao {
  id: string;
  accao: string;
  pessoaResponsavel: string;
  prazo: Date;
  dataConclusao: Date;
}

// Define the API response type that includes the relationships
export interface ObjetivosMetasResponse
  extends Omit<
    ObjetivosMetasFormData,
    'membrosDaEquipaIds' | 'tabelasAcoesIds'
  > {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  membrosDaEquipa: MembroEquipa[];
  tabelasAccoes: TabelaAcao[];
}

// Type used within the component
export type ObjetivosMetas = ObjetivosMetasResponse;

export const useObjetivosMetas = () => {
  const [data, setData] = useState<ObjetivosMetasResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<ObjetivosMetasFormData>({
    endpoint: 'objetivos-metas',
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
        `/api/forms/objetivos-metas?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: ObjetivosMetasResponse[] = result.map(
        (item: any) => {
          // Ensure we have arrays for relationships (even if empty)
          const membrosDaEquipa = Array.isArray(item.membrosDaEquipa)
            ? item.membrosDaEquipa
            : [];
          const tabelasAccoes = Array.isArray(item.tabelasAccoes)
            ? item.tabelasAccoes
            : [];

          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            numeroRefOAndM: item.numeroRefOAndM,
            aspetoRefNumero: item.aspetoRefNumero,
            centroCustos: item.centroCustos,
            objectivo: item.objectivo,
            publicoAlvo: item.publicoAlvo,
            orcamentoRecursos: item.orcamentoRecursos,
            refDocumentoComprovativo: item.refDocumentoComprovativo,
            dataInicio: new Date(item.dataInicio),
            dataConclusaoPrevista: new Date(item.dataConclusaoPrevista),
            dataConclusaoReal: new Date(item.dataConclusaoReal),
            pgasAprovadoPor: item.pgasAprovadoPor,
            dataAprovacao: new Date(item.dataAprovacao),
            observacoes: item.observacoes,
            oAndMAlcancadoFechado: item.oAndMAlcancadoFechado,
            assinaturaDirectorGeral: item.assinaturaDirectorGeral,
            data: new Date(item.data),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            membrosDaEquipa,
            tabelasAccoes,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching objetivos metas:', err);
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
  const create = async (formData: ObjetivosMetasFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (id: string, formData: ObjetivosMetasFormData) => {
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

  // Get team members
  const fetchMembrosEquipa = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/membros-equipa?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar membros da equipa');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching membros equipa:', err);
      return [];
    }
  };

  // Get tabela acoes
  const fetchTabelaAccoes = async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/tabela-accoes?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar tabela de ações');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching tabela acoes:', err);
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
    fetchMembrosEquipa,
    fetchTabelaAccoes,
  };
};
