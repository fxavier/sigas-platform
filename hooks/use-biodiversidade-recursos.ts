// lib/hooks/use-biodiversidade-recursos.ts
import { useState, useEffect } from 'react';
import { BiodiversidadeRecursosFormData } from '@/lib/validations/biodiversidade-recursos';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { toast } from 'sonner';

export type BiodiversidadeRecurso = {
  id: string;
  reference: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
};

export function useBiodiversidadeRecursos() {
  const [data, setData] = useState<BiodiversidadeRecurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId } = useTenantProjectContext();

  const fetchData = async () => {
    if (!currentTenantId) {
      setIsLoading(false);
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(
        '/api/biodiversidade-recursos',
        window.location.origin
      );
      url.searchParams.append('tenantId', currentTenantId);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Falha ao carregar registros de biodiversidade');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching biodiversidade recursos:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast.error('Não foi possível carregar os registros de biodiversidade');
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (formData: BiodiversidadeRecursosFormData) => {
    if (!currentTenantId) {
      toast.error('Não foi possível identificar o tenant');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        tenantId: currentTenantId,
      };

      const url = new URL(
        '/api/biodiversidade-recursos',
        window.location.origin
      );
      url.searchParams.append('tenantId', currentTenantId);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar registro');
      }

      const result = await response.json();
      setData((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      console.error('Error creating registro:', err);
      setError(err.message || 'Erro ao criar registro');
      toast.error(err.message || 'Falha ao criar registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (
    id: string,
    updateData: BiodiversidadeRecursosFormData
  ) => {
    if (!currentTenantId) {
      toast.error('Não foi possível identificar o tenant');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(
        '/api/biodiversidade-recursos',
        window.location.origin
      );
      url.searchParams.append('id', id);
      url.searchParams.append('tenantId', currentTenantId);

      const dataToSend = {
        ...updateData,
        tenantId: currentTenantId,
      };

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar registro');
      }

      const result = await response.json();
      setData((prev) => prev.map((item) => (item.id === id ? result : item)));
      return result;
    } catch (err: any) {
      console.error('Error updating registro:', err);
      setError(err.message || 'Erro ao atualizar registro');
      toast.error(err.message || 'Falha ao atualizar registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!currentTenantId) {
      toast.error('Não foi possível identificar o tenant');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(
        '/api/biodiversidade-recursos',
        window.location.origin
      );
      url.searchParams.append('id', id);
      url.searchParams.append('tenantId', currentTenantId);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao remover registro');
      }

      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error removing registro:', err);
      setError(err.message || 'Erro ao remover registro');
      toast.error(err.message || 'Falha ao remover registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when tenant changes
  useEffect(() => {
    if (currentTenantId) {
      fetchData();
    } else {
      setData([]);
      setIsLoading(false);
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
  };
}
