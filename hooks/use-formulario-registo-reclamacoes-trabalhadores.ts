// hooks/use-formulario-registo-reclamacoes-trabalhadores.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { FormularioRegistoReclamacoesTrabalhadoresFormData } from '@/lib/validations/formulario-registo-reclamacoes-trabalhadores';

// Define the API response type
export interface FormularioRegistoReclamacoesTrabalhadoresResponse
  extends FormularioRegistoReclamacoesTrabalhadoresFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type used within the component
export type FormularioRegistoReclamacoesTrabalhadoresData =
  FormularioRegistoReclamacoesTrabalhadoresResponse;

export const useWorkerComplaintForm = () => {
  const [data, setData] = useState<
    FormularioRegistoReclamacoesTrabalhadoresResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<FormularioRegistoReclamacoesTrabalhadoresFormData>(
    {
      endpoint: 'formulario-registo-reclamacoes-trabalhadores',
    }
  );

  // Fetch data based on tenant and project
  const fetchData = async () => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forms/formulario-registo-reclamacoes-trabalhadores?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: FormularioRegistoReclamacoesTrabalhadoresResponse[] =
        result.map((item: any) => {
          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            nome: item.nome,
            empresa: item.empresa,
            dataReclamacao: new Date(item.dataReclamacao),
            horaReclamacao: item.horaReclamacao,
            metodoPreferidoDoContacto: item.metodoPreferidoDoContacto,
            detalhesDoContacto: item.detalhesDoContacto,
            linguaPreferida: item.linguaPreferida,
            outraLinguaPreferida: item.outraLinguaPreferida,
            detalhesDareclamacao: item.detalhesDareclamacao,
            numeroIdentificacaoResponsavelRecepcao:
              item.numeroIdentificacaoResponsavelRecepcao,
            nomeResponsavelRecepcao: item.nomeResponsavelRecepcao,
            funcaoResponsavelRecepcao: item.funcaoResponsavelRecepcao,
            assinaturaResponsavelRecepcao: item.assinaturaResponsavelRecepcao,
            dataRecepcao: item.dataRecepcao,
            detalhesResponsavelRecepcao: item.detalhesResponsavelRecepcao,
            detalhesAcompanhamento: item.detalhesAcompanhamento,
            dataEncerramento: item.dataEncerramento
              ? new Date(item.dataEncerramento)
              : null,
            assinatura: item.assinatura,
            confirmarRecepcaoResposta: item.confirmarRecepcaoResposta,
            nomeDoConfirmante: item.nomeDoConfirmante,
            dataConfirmacao: item.dataConfirmacao
              ? new Date(item.dataConfirmacao)
              : null,
            assinaturaConfirmacao: item.assinaturaConfirmacao,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });

      setData(processedData);
    } catch (err: any) {
      console.error(
        'Error fetching formulario registo reclamacoes trabalhadores:',
        err
      );
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
  const create = async (
    formData: FormularioRegistoReclamacoesTrabalhadoresFormData
  ) => {
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
    formData: FormularioRegistoReclamacoesTrabalhadoresFormData
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
