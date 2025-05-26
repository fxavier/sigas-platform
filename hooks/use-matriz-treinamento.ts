import { useState, useEffect, useCallback } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { MatrizTreinamentoFormData } from '@/lib/validations/organizational-capacity-competence';

// Define relationship types
interface AreaTreinamento {
  id: string;
  name: string;
}

interface CaixaFerramentas {
  id: string;
  name: string;
}

interface Funcao {
  id: string;
  name: string;
}

// Define the API response type that includes the relationships
export interface MatrizTreinamentoResponse extends MatrizTreinamentoFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  areaTreinamento: AreaTreinamento;
  caixaFerramentas: CaixaFerramentas;
  funcao: Funcao;
}

// Type used within the component
export type MatrizTreinamento = MatrizTreinamentoResponse;

export const useMatrizTreinamento = () => {
  const [data, setData] = useState<MatrizTreinamentoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<MatrizTreinamentoFormData>({
    endpoint: 'matriz-treinamento',
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
        `/api/forms/matriz-treinamento?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: MatrizTreinamentoResponse[] = result.map(
        (item: any) => {
          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            data: item.data ? new Date(item.data) : null,
            funcaoId: item.funcaoId,
            areaTreinamentoId: item.areaTreinamentoId,
            caixaFerramentasId: item.caixaFerramentasId,
            totais_palestras: item.totais_palestras,
            total_horas: item.total_horas,
            total_caixa_ferramentas: item.total_caixa_ferramentas,
            total_pessoas_informadas_caixa_ferramentas:
              item.total_pessoas_informadas_caixa_ferramentas,
            eficacia: item.eficacia,
            accoes_treinamento_nao_eficaz: item.accoes_treinamento_nao_eficaz,
            aprovado_por: item.aprovado_por,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            areaTreinamento: item.areaTreinamento,
            caixaFerramentas: item.caixa_ferramentas,
            funcao: item.funcao,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching matriz treinamento:', err);
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
  const create = async (formData: MatrizTreinamentoFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (id: string, formData: MatrizTreinamentoFormData) => {
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

  // Get areas de treinamento
  const fetchAreasTreinamento = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/areas-treinamento?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar áreas de treinamento');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching areas treinamento:', err);
      return [];
    }
  }, [currentTenantId]);

  // Get caixa de ferramentas
  const fetchCaixaFerramentas = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/caixa-ferramentas?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar caixa de ferramentas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching caixa ferramentas:', err);
      return [];
    }
  }, [currentTenantId]);

  // Get funcoes
  const fetchFuncoes = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(`/api/funcoes?tenantId=${currentTenantId}`);

      if (!response.ok) {
        throw new Error('Falha ao buscar funções');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching funcoes:', err);
      return [];
    }
  }, [currentTenantId]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    create,
    update,
    remove,
    fetchAreasTreinamento,
    fetchCaixaFerramentas,
    fetchFuncoes,
  };
};
