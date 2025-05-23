// hooks/use-relatorio-auditoria-interna.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { RelatorioAuditoriaInternaFormData } from '@/lib/validations/relatorio-auditoria-interna';

// Define relationship types
interface DescricaoNaoConformidade {
  id: string;
  processo: string;
  clausula: string;
  naoConformidade: string;
}

// Define the API response type that includes the relationships
export interface RelatorioAuditoriaInternaResponse
  extends Omit<RelatorioAuditoriaInternaFormData, 'descricaoNaoConformidades'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  descricaoNaoConformidade: DescricaoNaoConformidade[];
}

// Type used within the component
export type RelatorioAuditoriaInterna = RelatorioAuditoriaInternaResponse;

export const useRelatorioAuditoriaInterna = () => {
  const [data, setData] = useState<RelatorioAuditoriaInternaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<RelatorioAuditoriaInternaFormData>({
    endpoint: 'relatorio-auditoria-interna',
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
        `/api/forms/relatorio-auditoria-interna?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || 'Falha ao buscar dados'
        );
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: RelatorioAuditoriaInternaResponse[] = result.map(
        (item: any) => {
          // Ensure we have arrays for relationships (even if empty)
          const descricaoNaoConformidade = Array.isArray(
            item.descricaoNaoConformidade
          )
            ? item.descricaoNaoConformidade
            : [];

          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            ambitoAuditoria: item.ambitoAuditoria,
            dataAuditoria: new Date(item.dataAuditoria),
            dataRelatorio: new Date(item.dataRelatorio),
            auditorLider: item.auditorLider,
            auditorObservador: item.auditorObservador,
            resumoAuditoria: item.resumoAuditoria,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            descricaoNaoConformidade,
          };
        }
      );

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching relatorio auditoria interna:', err);
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
  const create = async (formData: RelatorioAuditoriaInternaFormData) => {
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
    formData: RelatorioAuditoriaInternaFormData
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
