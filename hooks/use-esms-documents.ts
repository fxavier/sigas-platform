// hooks/use-esms-documents.ts
import { useState, useEffect } from 'react';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import {
  DocumentType,
  ESMSDocumentFormData,
} from '@/lib/validations/esms-documents';

// Define the API response type
export interface ESMSDocumentResponse extends ESMSDocumentFormData {
  id: string;
  dataCriacao: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useESMSDocuments = (documentType: DocumentType) => {
  const [data, setData] = useState<ESMSDocumentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  // Fetch data based on tenant and project
  const fetchData = async () => {
    if (!currentTenantId || !currentProjectId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/esms-documents/${documentType}?tenantId=${currentTenantId}&projectId=${currentProjectId}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar documentos');
      }

      const result = await response.json();

      // Process the result to ensure proper date handling
      const processedData: ESMSDocumentResponse[] = result.map((item: any) => ({
        ...item,
        dataCriacao: new Date(item.dataCriacao),
        dataRevisao: item.dataRevisao ? new Date(item.dataRevisao) : null,
        periodoRetencao: item.periodoRetencao
          ? new Date(item.periodoRetencao)
          : null,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      setData(processedData);
    } catch (err: any) {
      console.error(`Error fetching ${documentType}:`, err);
      setError(err.message || 'Ocorreu um erro ao buscar os documentos');
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
  }, [currentTenantId, currentProjectId, documentType]);

  // Create new document
  const create = async (formData: ESMSDocumentFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    const response = await fetch(
      `/api/esms-documents/${documentType}?tenantId=${currentTenantId}&projectId=${currentProjectId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao criar documento');
    }

    return response.json();
  };

  // Update existing document
  const update = async (id: string, formData: ESMSDocumentFormData) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    const response = await fetch(
      `/api/esms-documents/${documentType}?id=${id}&tenantId=${currentTenantId}&projectId=${currentProjectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao atualizar documento');
    }

    return response.json();
  };

  // Delete document
  const remove = async (id: string) => {
    if (!currentTenantId || !currentProjectId) {
      throw new Error('Tenant e Projeto são obrigatórios');
    }

    const response = await fetch(
      `/api/esms-documents/${documentType}?id=${id}&tenantId=${currentTenantId}&projectId=${currentProjectId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao excluir documento');
    }

    return response.json();
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
