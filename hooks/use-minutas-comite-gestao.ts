// lib/hooks/use-minutas-comite-gestao.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  MinutasComiteGestaoFormData,
  MinutasComiteGestaoCompletoFormData,
  ResultadoComiteFormData,
} from '@/lib/validations/minutas-comite-gestao';

// Define the API response type that includes the relationships
export interface MinutasComiteGestaoResponse
  extends Omit<MinutasComiteGestaoFormData, 'resultado'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  resultadoComiteGestaoAmbientalESocial: ResultadoComiteGestaoResponse;
}

export interface ResultadoComiteGestaoResponse extends ResultadoComiteFormData {
  id: string;
  tenantId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type used within the component
export type MinutasComiteGestao = MinutasComiteGestaoResponse;

export const useMinutasComiteGestao = () => {
  const [data, setData] = useState<MinutasComiteGestaoResponse[]>([]);
  const [resultados, setResultados] = useState<ResultadoComiteGestaoResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<MinutasComiteGestaoCompletoFormData>({
    endpoint: 'minutas-comite-gestao',
  });

  // Fetch data based on tenant and project
  const fetchData = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !currentTenantId || !currentProjectId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forms/minutas-comite-gestao?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: MinutasComiteGestaoResponse[] = result.map(
        (item: any) => {
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            presididoPor: item.presididoPor,
            convidado: item.convidado,
            ausenciasJustificadas: item.ausenciasJustificadas,
            data: new Date(item.data),
            hora: item.hora,
            local: item.local,
            agenda: item.agenda,
            resultadoComiteGestaoAmbientalESocialId:
              item.resultadoComiteGestaoAmbientalESocialId,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            resultadoComiteGestaoAmbientalESocial: {
              ...item.resultadoComiteGestaoAmbientalESocial,
              dataRevisaoEAprovacao: new Date(
                item.resultadoComiteGestaoAmbientalESocial.dataRevisaoEAprovacao
              ),
              createdAt: new Date(
                item.resultadoComiteGestaoAmbientalESocial.createdAt
              ),
              updatedAt: new Date(
                item.resultadoComiteGestaoAmbientalESocial.updatedAt
              ),
            },
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching minutas comite gestao:', err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, currentTenantId, currentProjectId]);

  // Fetch available resultados for selection
  const fetchResultados = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !currentTenantId || !currentProjectId) {
      setResultados([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/resultado-comite-gestao?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar resultados');
      }

      const result = await response.json();
      const processedResultados: ResultadoComiteGestaoResponse[] = result.map(
        (item: any) => ({
          ...item,
          dataRevisaoEAprovacao: new Date(item.dataRevisaoEAprovacao),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })
      );

      setResultados(processedResultados);
    } catch (err: any) {
      console.error('Error fetching resultados:', err);
    }
  }, [isLoaded, isSignedIn, currentTenantId, currentProjectId]);

  // Load data when tenant or project changes
  useEffect(() => {
    fetchData();
    fetchResultados();
  }, [fetchData, fetchResultados]);

  // Create new record (includes both minuta and resultado)
  const create = async (formData: MinutasComiteGestaoCompletoFormData) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Usuário não autenticado');
    }
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
    formData: MinutasComiteGestaoCompletoFormData
  ) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Usuário não autenticado');
    }
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
    if (!isLoaded || !isSignedIn) {
      throw new Error('Usuário não autenticado');
    }
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.remove(id, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Create a new resultado
  const createResultado = async (resultadoData: ResultadoComiteFormData) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Usuário não autenticado');
    }
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    const response = await fetch(
      `/api/resultado-comite-gestao?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resultadoData,
          tenantId: currentTenantId,
          projectId: currentProjectId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create resultado');
    }

    return await response.json();
  };

  return {
    data,
    resultados,
    isLoading,
    error,
    fetchData,
    fetchResultados,
    create,
    update,
    remove,
    createResultado,
  };
};
