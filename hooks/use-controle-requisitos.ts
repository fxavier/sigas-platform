import { useState, useEffect } from 'react';
import { ControleRequisitosFormData } from '@/lib/validations/controle-requisitos';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { toast } from 'sonner';

export type ControleRequisitos = {
  id: string;
  numnumero: string;
  tituloDocumento: string;
  descricao: Date;
  revocacoesAlteracoes?: string | null;
  requisitoConformidade?: string | null;
  dataControle: Date;
  observation?: string | null;
  ficheiroDaLei?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  projectId: string;
};

export function useControleRequisitos() {
  const [data, setData] = useState<ControleRequisitos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const fetchData = async () => {
    if (!currentTenantId || !currentProjectId) {
      setIsLoading(false);
      setData([]);
      toast.error(
        'Não foi possível carregar os registros de controle de requisitos legais'
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(
        '/api/forms/controle-requisitos',
        window.location.origin
      );
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          'Falha ao carregar os registros de controle de requisitos legais'
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching controle requisitos:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast.error(
        'Não foi possível carregar os registros de controle de requisitos legais'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (newData: ControleRequisitosFormData) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Não foi possível identificar o tenant ou projeto');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...newData,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      const url = new URL(
        '/api/forms/controle-requisitos',
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

  const update = async (id: string, updateData: ControleRequisitosFormData) => {
    if (!currentTenantId) {
      toast.error('Não foi possível identificar o tenant');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(
        '/api/forms/controle-requisitos',
        window.location.origin
      );
      url.searchParams.append('id', id);
      url.searchParams.append('tenantId', currentTenantId);

      const dataToSend = {
        ...updateData,
        tenantId: currentTenantId,
        projectId: updateData.projectId || currentProjectId,
        id,
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
        '/api/forms/controle-requisitos',
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

  useEffect(() => {
    if (currentTenantId && currentProjectId) {
      fetchData();
    } else {
      setData([]);
      setIsLoading(false);
    }
  }, [currentTenantId, currentProjectId]);

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
