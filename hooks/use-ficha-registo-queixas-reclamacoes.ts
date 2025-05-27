// hooks/use-ficha-registo-queixas-reclamacoes.ts
import { useState, useEffect } from 'react';
import { useFormApi } from '@/hooks/use-form-api';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { FichaRegistoQueixasReclamacoesFormData } from '@/lib/validations/ficha-registo-queixas-reclamacoes';

// Define relationship types
interface CategoriaQueixa {
  id: string;
  nome: string;
}

interface SubcategoriaQueixa {
  id: string;
  nome: string;
  categoriaQueixaId: string;
}

interface ResolucaoQueixa {
  id: string;
  accao_correctiva: string;
  responsavel: string;
  prazo: string;
  estado: string;
}

interface FotosDocumentosComprovativoEncerramento {
  id: string;
  foto: string;
}

// Define the API response type that includes the relationships
export interface FichaRegistoQueixasReclamacoesResponse
  extends Omit<
    FichaRegistoQueixasReclamacoesFormData,
    | 'subcategoriaQueixaIds'
    | 'resolucaoQueixaIds'
    | 'fotosDocumentosComprovativoEncerramentoIds'
  > {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  categoriaQueixa?: CategoriaQueixa | null;
  subcategoriaQueixa: SubcategoriaQueixa[];
  resolucaoQueixa: ResolucaoQueixa[];
  fotosDocumentosComprovativoEncerramento: FotosDocumentosComprovativoEncerramento[];
}

// Type used within the component
export type FichaRegistoQueixasReclamacoes =
  FichaRegistoQueixasReclamacoesResponse;

export const useFichaRegistoQueixasReclamacoes = () => {
  const [data, setData] = useState<FichaRegistoQueixasReclamacoesResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Initialize form API with the endpoint
  const formApi = useFormApi<FichaRegistoQueixasReclamacoesFormData>({
    endpoint: 'ficha-registo-queixas-reclamacoes',
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
        `/api/forms/ficha-registo-queixas-reclamacoes?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }

      // Get raw result from API
      const result = await response.json();

      // Process the result to ensure it matches our expected type
      const processedData: FichaRegistoQueixasReclamacoesResponse[] =
        result.map((item: any) => {
          // Ensure we have arrays for relationships (even if empty)
          const subcategoriaQueixa = Array.isArray(item.subcategoriaQueixa)
            ? item.subcategoriaQueixa
            : [];
          const resolucaoQueixa = Array.isArray(item.resolucaoQueixa)
            ? item.resolucaoQueixa
            : [];
          const fotosDocumentosComprovativoEncerramento = Array.isArray(
            item.fotosDocumentosComprovativoEncerramento
          )
            ? item.fotosDocumentosComprovativoEncerramento
            : [];

          // Return a properly formatted response object
          return {
            id: item.id,
            tenantId: item.tenantId,
            projectId: item.projectId,
            numeroQueixa: item.numeroQueixa,
            nomeCompletoReclamante: item.nomeCompletoReclamante,
            genero: item.genero,
            idade: item.idade,
            celular: item.celular,
            email: item.email,
            endereco: item.endereco,
            quarteirao: item.quarteirao,
            bairro: item.bairro,
            localidade: item.localidade,
            postoAdministrativo: item.postoAdministrativo,
            distrito: item.distrito,
            local: item.local,
            dataReclamacao: new Date(item.dataReclamacao),
            hora: item.hora,
            breveDescricaoFactos: item.breveDescricaoFactos,
            queixaAceita: item.queixaAceita,
            justificativaParaRejeicao: item.justificativaParaRejeicao,
            reclamanteNotificado: item.reclamanteNotificado,
            metodoNotificacao: item.metodoNotificacao,
            outroMetodoNotificacao: item.outroMetodoNotificacao,
            categoriaQueixaId: item.categoriaQueixaId,
            descricao_factos_apos_investigacao:
              item.descricao_factos_apos_investigacao,
            dataEncerramento: item.dataEncerramento
              ? new Date(item.dataEncerramento)
              : null,
            reclamanteNotificadoSobreEncerramento:
              item.reclamanteNotificadoSobreEncerramento,
            reclamanteSatisfeito: item.reclamanteSatisfeito,
            recursosGastosReparacaoReclamacao:
              item.recursosGastosReparacaoReclamacao,
            dataEncerramentoReclamacao: item.dataEncerramentoReclamacao
              ? new Date(item.dataEncerramentoReclamacao)
              : null,
            diasDesdeQueixaAoEncerramento: item.diasDesdeQueixaAoEncerramento,
            monitoriaAposEncerramento: item.monitoriaAposEncerramento,
            accaoMonitoriaAposEncerramento: item.accaoMonitoriaAposEncerramento,
            responsavelMonitoriaAposEncerramento:
              item.responsavelMonitoriaAposEncerramento,
            prazoMonitoriaAposEncerramento: item.prazoMonitoriaAposEncerramento,
            estadoMonitoriaAposEncerramento:
              item.estadoMonitoriaAposEncerramento,
            accoesPreventivasSugeridas: item.accoesPreventivasSugeridas,
            responsavelAccoesPreventivasSugeridas:
              item.responsavelAccoesPreventivasSugeridas,
            prazoAccoesPreventivasSugeridas:
              item.prazoAccoesPreventivasSugeridas,
            estadoAccoesPreventivasSugeridas:
              item.estadoAccoesPreventivasSugeridas,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            categoriaQueixa: item.categoriaQueixa,
            subcategoriaQueixa,
            resolucaoQueixa,
            fotosDocumentosComprovativoEncerramento,
          };
        });

      setData(processedData);
    } catch (err: any) {
      console.error('Error fetching ficha registo queixas reclamacoes:', err);
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
  const create = async (formData: FichaRegistoQueixasReclamacoesFormData) => {
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
    formData: FichaRegistoQueixasReclamacoesFormData
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

  // Get categorias queixas
  const fetchCategoriasQueixas = async () => {
    if (!currentTenantId || !currentProjectId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/categorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias de queixas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching categorias queixas:', err);
      return [];
    }
  };

  // Get subcategorias queixas
  const fetchSubcategoriasQueixas = async (categoriaId?: string) => {
    if (!currentTenantId || !currentProjectId) {
      return [];
    }

    try {
      const url = categoriaId
        ? `/api/subcategorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}&categoriaId=${categoriaId}`
        : `/api/subcategorias-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Falha ao buscar subcategorias de queixas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching subcategorias queixas:', err);
      return [];
    }
  };

  // Get resolucoes queixas
  const fetchResolucoesQueixas = async () => {
    if (!currentTenantId || !currentProjectId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/resolucoes-queixas?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar resoluções de queixas');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching resolucoes queixas:', err);
      return [];
    }
  };

  // Get fotos documentos
  const fetchFotosDocumentos = async () => {
    if (!currentTenantId || !currentProjectId) {
      return [];
    }

    try {
      const response = await fetch(
        `/api/fotos-documentos-comprovativo-encerramento?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar fotos e documentos');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching fotos documentos:', err);
      return [];
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
    create,
    update,
    remove,
    fetchCategoriasQueixas,
    fetchSubcategoriasQueixas,
    fetchResolucoesQueixas,
    fetchFotosDocumentos,
  };
};
