// lib/hooks/use-registo-comunicacoes.ts
import { useState, useEffect, useCallback } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { RegistoComunicacoesFormData } from '@/lib/validations/registo-comunicacoes';

// Define the API response type that includes the relationships
export interface RegistoComunicacoesResponse
  extends RegistoComunicacoesFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type used within the component
export type RegistoComunicacoes = RegistoComunicacoesResponse;

export const useRegistoComunicacoes = () => {
  const [data, setData] = useState<RegistoComunicacoesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<RegistoComunicacoesFormData>({
    endpoint: 'registo-comunicacoes',
  });

  // Fetch data based on tenant and project
  const fetchData = useCallback(async () => {
    if (!currentTenantId || !currentProjectId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forms/registo-comunicacoes?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: RegistoComunicacoesResponse[] = result.map(
        (item: any) => {
          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            data: new Date(item.data),
            local: item.local,
            horario: item.horario,
            agenda: item.agenda,
            participantes: item.participantes,
            encontroAtendeuSeuProposito: item.encontroAtendeuSeuProposito,
            porqueNaoAtendeu: item.porqueNaoAtendeu,
            haNecessidadeRetomarTema: item.haNecessidadeRetomarTema,
            poruqNecessarioRetomarTema: item.poruqNecessarioRetomarTema,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching registo comunicacoes:', err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados');
    } finally {
      setIsLoading(false);
    }
  }, [currentTenantId, currentProjectId]);

  // Load data when tenant or project changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create new record
  const create = async (formData: RegistoComunicacoesFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    return formApi.create(formData, {
      tenantId: currentTenantId,
      projectId: currentProjectId,
    });
  };

  // Update existing record
  const update = async (id: string, formData: RegistoComunicacoesFormData) => {
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

  return {
    data,
    isLoading,
    error,
    fetchData,
    create,
    update,
    remove,
  };
};
