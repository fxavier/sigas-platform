// lib/hooks/use-triagem-ambiental.ts
import { useState, useEffect, useCallback } from 'react';
import { TriagemAmbientalFormData } from '@/lib/validations/triagem-ambiental';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TriagemAmbientalSocial } from '@prisma/client';

export type TriagemAmbiental = {
  id: string;
  tenantId: string;
  projectId: string;
  responsavelPeloPreenchimentoId: string;
  responsavelPelaVerificacaoId: string;
  subprojectoId: string;
  consultaEngajamento: string | null;
  accoesRecomendadas: string | null;
  resultadoTriagemId: string;
  createdAt: Date;
  updatedAt: Date;
  responsavelPeloPreenchimento: {
    id: string;
    nome: string;
    funcao: string;
    contacto: string;
    data: Date;
    assinatura?: string;
  };
  responsavelPelaVerificacao: {
    id: string;
    nome: string;
    funcao: string;
    contacto: string;
    data: Date;
    assinatura?: string;
  };
  subprojecto: {
    id: string;
    nome: string;
    referenciaDoContracto?: string;
    nomeEmpreiteiro?: string;
    custoEstimado?: number;
    localizacao: string;
    coordenadasGeograficas?: string;
    tipoSubprojecto: string;
    areaAproximada: string;
  };
  resultadoTriagem: {
    id: string;
    categoriaRisco: string;
    descricao: string;
    instrumentosASeremDesenvolvidos: string;
    subprojectoId: string;
  };
  identificacaoRiscos?: Array<{
    identificacaoRiscos: {
      id: string;
      biodiversidadeRecursosNaturaisId: string;
      resposta: 'SIM' | 'NAO';
      comentario: string | null;
      normaAmbientalSocial: string | null;
      biodiversidadeRecursosNaturais: {
        id: string;
        reference: string;
        description: string;
      };
    };
  }>;
};

interface UseTriagemAmbientalProps {
  onSuccess?: () => void;
}

export const useTriagemAmbiental = ({
  onSuccess,
}: UseTriagemAmbientalProps = {}) => {
  const router = useRouter();
  const [data, setData] = useState<TriagemAmbiental[]>([]);
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
        '/api/forms/triagem-ambiental',
        window.location.origin
      );
      url.searchParams.append('tenantId', currentTenantId);
      url.searchParams.append('projectId', currentProjectId);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Falha ao carregar registros de triagem ambiental');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Error fetching triagem ambiental:', err);
      setError(err.message || 'Erro ao carregar dados');
      toast.error(
        'Não foi possível carregar os registros de triagem ambiental'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createTriagemAmbiental = useCallback(
    async (
      data: Omit<TriagemAmbientalSocial, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/triagem-ambiental', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create triagem ambiental');
        }

        toast.success('Triagem ambiental created successfully');
        router.refresh();
        onSuccess?.();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [router, onSuccess]
  );

  const updateTriagemAmbiental = useCallback(
    async (
      id: string,
      data: Partial<
        Omit<TriagemAmbientalSocial, 'id' | 'createdAt' | 'updatedAt'>
      >
    ) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/triagem-ambiental/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update triagem ambiental');
        }

        toast.success('Triagem ambiental updated successfully');
        router.refresh();
        onSuccess?.();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [router, onSuccess]
  );

  const deleteTriagemAmbiental = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/triagem-ambiental/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete triagem ambiental');
        }

        toast.success('Triagem ambiental deleted successfully');
        router.refresh();
        onSuccess?.();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [router, onSuccess]
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
    createTriagemAmbiental,
    updateTriagemAmbiental,
    deleteTriagemAmbiental,
  };
};
