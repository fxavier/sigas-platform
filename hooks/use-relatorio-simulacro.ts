// lib/hooks/use-relatorio-simulacro.ts
import { useState, useEffect, useCallback } from 'react';
import { RelatorioSimulacroFormData } from '@/lib/validations/relatorio-simulacro';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export type RelatorioSimulacro = {
  id: string;
  tenantId: string;
  projectId: string;
  local: string;
  dataCriacao: Date;
  tipoEmergenciaSimulada: 'SAUDE_E_SEGURANCA' | 'AMBIENTAL';
  objectoDoSimulacro:
    | 'DISPOSITIVOS_DE_EMERGENCIA'
    | 'REACAO_DOS_COLABORADORES'
    | 'ACTUACAO_DA_EQUIPA_DE_EMERGENCIA';
  descricaoDocenario: string;
  assinaturaCoordenadorEmergencia: string;
  outraAssinatura?: string | null;
  relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia?: Array<{
    avaliacaoClassificacaoEmergencia: {
      id: string;
      perguntaId: string;
      resposta: 'SIM' | 'NAO' | 'N_A';
      comentarios: string | null;
      pergunta: {
        id: string;
        codigo: string;
        pergunta: string;
      };
    };
  }>;
  relatorioDeSimulacroOnRecomendacoes?: Array<{
    recomendacoes: {
      id: string;
      acao: string;
      responsavel: string;
      prazo: string;
    };
  }>;
};

interface UseRelatorioSimulacroProps {
  onSuccess?: () => void;
}

export const useRelatorioSimulacro = ({
  onSuccess,
}: UseRelatorioSimulacroProps = {}) => {
  const router = useRouter();
  const [data, setData] = useState<RelatorioSimulacro[]>([]);
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
      const url = new URL(
        '/api/forms/relatorio-simulacro',
        window.location.origin
      );
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          'Falha ao carregar registros de relatório de simulacro'
        );
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching relatorio simulacro:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast.error(
        'Não foi possível carregar os registros de relatório de simulacro'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createRelatorioSimulacro = useCallback(
    async (data: RelatorioSimulacroFormData) => {
      try {
        setIsLoading(true);

        const url = new URL(
          '/api/forms/relatorio-simulacro',
          window.location.origin
        );
        url.searchParams.append('tenantId', currentTenantId || '');

        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to create relatorio simulacro'
          );
        }

        toast.success('Relatório de simulacro criado com sucesso');
        await fetchData();
        onSuccess?.();
      } catch (error) {
        console.error('Error creating relatorio simulacro:', error);
        toast.error(error instanceof Error ? error.message : 'Algo deu errado');
      } finally {
        setIsLoading(false);
      }
    },
    [currentTenantId, onSuccess, fetchData]
  );

  const updateRelatorioSimulacro = useCallback(
    async (id: string, data: RelatorioSimulacroFormData) => {
      try {
        setIsLoading(true);

        const url = new URL(
          '/api/forms/relatorio-simulacro',
          window.location.origin
        );
        url.searchParams.append('id', id);
        url.searchParams.append('tenantId', currentTenantId || '');

        const response = await fetch(url.toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to update relatorio simulacro'
          );
        }

        toast.success('Relatório de simulacro atualizado com sucesso');
        await fetchData();
        onSuccess?.();
      } catch (error) {
        console.error('Error updating relatorio simulacro:', error);
        toast.error(error instanceof Error ? error.message : 'Algo deu errado');
      } finally {
        setIsLoading(false);
      }
    },
    [currentTenantId, onSuccess, fetchData]
  );

  const deleteRelatorioSimulacro = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);

        const url = new URL(
          '/api/forms/relatorio-simulacro',
          window.location.origin
        );
        url.searchParams.append('id', id);
        url.searchParams.append('tenantId', currentTenantId || '');

        const response = await fetch(url.toString(), {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to delete relatorio simulacro'
          );
        }

        toast.success('Relatório de simulacro excluído com sucesso');
        await fetchData();
        onSuccess?.();
      } catch (error) {
        console.error('Error deleting relatorio simulacro:', error);
        toast.error(error instanceof Error ? error.message : 'Algo deu errado');
      } finally {
        setIsLoading(false);
      }
    },
    [currentTenantId, onSuccess, fetchData]
  );

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
    createRelatorioSimulacro,
    updateRelatorioSimulacro,
    deleteRelatorioSimulacro,
  };
};
