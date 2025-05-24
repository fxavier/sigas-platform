import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export function useTenantProjects(tenantId: string) {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['tenant-projects', tenantId],
    queryFn: async () => {
      const response = await axios.get(`/api/tenants/${tenantId}/projects`);
      return response.data;
    },
    enabled: !!tenantId,
  });

  return {
    projects,
    isLoading,
  };
}
