// hooks/use-matriz-stakeholder.ts
import { useState, useEffect, useCallback } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { MatrizStakeholderFormData } from '@/lib/validations/matriz-stakeholder';

// Define relationship types
interface Categoria {
  id: string;
  nome: string;
}

interface AreaActuacao {
  id: string;
  nome: string;
}

interface PrincipaisInteresses {
  id: string;
  nome: string;
}

// Define the API response type that includes the relationships
export interface MatrizStakeholderResponse extends MatrizStakeholderFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  categoria: Categoria;
  areaActuacao: AreaActuacao;
  principaisInteresses: PrincipaisInteresses;
}

// Type used within the component
export type MatrizStakeholder = MatrizStakeholderResponse;

export const useMatrizStakeholder = () => {
  const [data, setData] = useState<MatrizStakeholderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<MatrizStakeholderFormData>({
    endpoint: 'matriz-stakeholder',
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
        `/api/forms/matriz-stakeholder?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: MatrizStakeholderResponse[] = result.map(
        (item: any) => {
          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            stakeholder: item.stakeholder,
            categoriaId: item.categoriaId,
            alcance: item.alcance,
            areaActuacaoId: item.areaActuacaoId,
            descricao: item.descricao,
            historico_relacionamento: item.historico_relacionamento,
            percepcaoEmRelacaoAoEmprendedor:
              item.percepcaoEmRelacaoAoEmprendedor,
            principaisInteressesId: item.principaisInteressesId,
            oportunidades_associadas: item.oportunidades_associadas,
            riscos_associados: item.riscos_associados,
            percepcaoOuPosicionamento: item.percepcaoOuPosicionamento,
            potenciaImpacto: item.potenciaImpacto,
            diagnostico_directriz_posicionamento:
              item.diagnostico_directriz_posicionamento,
            interlocutor_responsavel_por_relacionamento:
              item.interlocutor_responsavel_por_relacionamento,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            categoria: item.categoria,
            areaActuacao: item.areaActuacao,
            principaisInteresses: item.principaisInteresses,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching matriz stakeholder:', err);
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
  const create = async (formData: MatrizStakeholderFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (id: string, formData: MatrizStakeholderFormData) => {
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

  // Get categorias
  const fetchCategorias = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/categorias?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching categorias:', err);
      return [];
    }
  }, [currentTenantId]);

  // Get areas de actuacao
  const fetchAreasActuacao = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/areas-actuacao?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar áreas de actuação');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching areas actuacao:', err);
      return [];
    }
  }, [currentTenantId]);

  // Get principais interesses
  const fetchPrincipaisInteresses = useCallback(async () => {
    if (!currentTenantId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/principais-interesses?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar principais interesses');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching principais interesses:', err);
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
    fetchCategorias,
    fetchAreasActuacao,
    fetchPrincipaisInteresses,
  };
};
