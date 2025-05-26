import { useState, useEffect } from 'react';
import { PerguntaAvaliacaoClassificacaoEmergenciaFormData } from '@/lib/validations/perguntas-avaliacao-classificacao-emergencia';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { toast } from 'sonner';

export type PerguntaAvaliacaoClassificacaoEmergencia = {
  id: string;
  codigo: string;
  pergunta: string;
  tenantId: string;
  projectId: string;
};

export function usePerguntasAvaliacaoClassificacaoEmergencia() {
  const [data, setData] = useState<PerguntaAvaliacaoClassificacaoEmergencia[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const fetchData = async () => {
    if (!currentTenantId || !currentProjectId) {
      setIsLoading(false);
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/perguntas-avaliacao', window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Falha ao carregar perguntas de avaliação');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching perguntas avaliacao:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast.error('Não foi possível carregar as perguntas de avaliação');
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (
    formData: PerguntaAvaliacaoClassificacaoEmergenciaFormData
  ) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Não foi possível identificar o tenant ou projeto');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        tenantId: currentTenantId,
        projectId: currentProjectId,
      };

      const url = new URL('/api/perguntas-avaliacao', window.location.origin);
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar pergunta');
      }

      const result = await response.json();
      setData((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      console.error('Error creating pergunta:', err);
      setError(err.message || 'Erro ao criar pergunta');
      toast.error(err.message || 'Falha ao criar pergunta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (
    id: string,
    updateData: PerguntaAvaliacaoClassificacaoEmergenciaFormData
  ) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Não foi possível identificar o tenant ou projeto');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/perguntas-avaliacao', window.location.origin);
      url.searchParams.append('id', id);
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const dataToSend = {
        ...updateData,
        tenantId: currentTenantId,
        projectId: currentProjectId,
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
        throw new Error(errorData.error || 'Falha ao atualizar pergunta');
      }

      const result = await response.json();
      setData((prev) => prev.map((item) => (item.id === id ? result : item)));
      return result;
    } catch (err: any) {
      console.error('Error updating pergunta:', err);
      setError(err.message || 'Erro ao atualizar pergunta');
      toast.error(err.message || 'Falha ao atualizar pergunta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!currentTenantId || !currentProjectId) {
      toast.error('Não foi possível identificar o tenant ou projeto');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/perguntas-avaliacao', window.location.origin);
      url.searchParams.append('id', id);
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao remover pergunta');
      }

      setData((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error removing pergunta:', err);
      setError(err.message || 'Erro ao remover pergunta');
      toast.error(err.message || 'Falha ao remover pergunta');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when tenant or project changes
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
