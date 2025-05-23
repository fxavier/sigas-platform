// lib/hooks/use-tabela-accao.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { TabelaAccao } from '@/lib/types/forms';

export const useTabelaAccao = () => {
  const [data, setData] = useState<TabelaAccao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<TabelaAccao>({
    endpoint: 'tabela-accao',
  });

  // Fetch data based on tenant
  const fetchData = async () => {
    if (!currentTenantId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forms/tabela-accao?tenantId=${currentTenantId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching tabela accao:', err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when tenant changes
  useEffect(() => {
    if (currentTenantId) {
      fetchData();
    } else {
      setData([]);
    }
  }, [currentTenantId]);

  // Create new record
  const create = async (formData: Omit<TabelaAccao, 'id'>) => {
    if (!currentTenantId) {
      throw new Error('Tenant é obrigatório');
    }

    const fullData = {
      ...formData,
      tenantId: currentTenantId,
    } as TabelaAccao;

    const result = await formApi.create(fullData, {
      tenantId: currentTenantId,
    });

    // Refresh data after creation
    await fetchData();

    return result;
  };

  // Update existing record
  const update = async (id: string, formData: TabelaAccao) => {
    if (!currentTenantId) {
      throw new Error('Tenant é obrigatório');
    }

    return formApi.update(id, formData, {
      tenantId: currentTenantId,
    });
  };

  // Delete record
  const remove = async (id: string) => {
    if (!currentTenantId) {
      throw new Error('Tenant é obrigatório');
    }

    return formApi.remove(id, {
      tenantId: currentTenantId,
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
