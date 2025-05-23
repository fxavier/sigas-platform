// lib/hooks/use-form-api.ts
import { useState } from 'react';

interface FormApiOptions {
  endpoint: string;
}

interface ExtraParams {
  tenantId?: string;
  projectId?: string;
}

export function useFormApi<T = any>({ endpoint }: FormApiOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildQueryParams = (params?: ExtraParams) => {
    if (!params) return '';

    const queryParams = new URLSearchParams();

    if (params.tenantId) {
      queryParams.append('tenantId', params.tenantId);
    }

    if (params.projectId) {
      queryParams.append('projectId', params.projectId);
    }

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  const create = async (data: Partial<T>, params?: ExtraParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryString = buildQueryParams(params);
      const response = await fetch(`/api/forms/${endpoint}${queryString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: string, data: Partial<T>, params?: ExtraParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('id', id);

      if (params?.tenantId) {
        queryParams.append('tenantId', params.tenantId);
      }

      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }

      const response = await fetch(
        `/api/forms/${endpoint}?${queryParams.toString()}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string, params?: ExtraParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append('id', id);

      if (params?.tenantId) {
        queryParams.append('tenantId', params.tenantId);
      }

      if (params?.projectId) {
        queryParams.append('projectId', params.projectId);
      }

      const response = await fetch(
        `/api/forms/${endpoint}?${queryParams.toString()}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    update,
    remove,
    isLoading,
    error,
  };
}
