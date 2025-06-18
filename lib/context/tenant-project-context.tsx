'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TenantProjectContextType {
  currentTenantId: string | null;
  currentProjectId: string | null;
  setCurrentTenantId: (id: string | null) => void;
  setCurrentProjectId: (id: string | null) => void;
}

const TenantProjectContext = createContext<TenantProjectContextType>({
  currentTenantId: null,
  currentProjectId: null,
  setCurrentTenantId: () => {},
  setCurrentProjectId: () => {},
});

export const useTenantProjectContext = () => useContext(TenantProjectContext);

interface TenantProjectProviderProps {
  children: ReactNode;
}

// Inner component that uses useSearchParams
const TenantProjectProviderInner = ({
  children,
}: TenantProjectProviderProps) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract tenant slug from URL
  useEffect(() => {
    if (pathname) {
      const tenantSlugMatch = pathname.match(/\/tenants\/([^\/]+)/);

      if (tenantSlugMatch && tenantSlugMatch[1]) {
        // We have the slug, now we need to fetch the ID
        const fetchTenantId = async (slug: string) => {
          try {
            const response = await fetch(`/api/tenants/by-slug/${slug}`);

            if (response.ok) {
              const tenant = await response.json();
              setCurrentTenantId(tenant.id);

              // Store in localStorage for persistence
              localStorage.setItem('currentTenantId', tenant.id);
              localStorage.setItem('currentTenantSlug', slug);
            }
          } catch (error) {
            console.error('Error fetching tenant ID:', error);
          }
        };

        fetchTenantId(tenantSlugMatch[1]);
      }
    }
  }, [pathname]);

  // Extract project ID from URL or query params
  useEffect(() => {
    if (pathname) {
      // First check URL pattern for direct project reference
      const projectIdMatch = pathname.match(/\/projects\/([^\/]+)/);

      if (projectIdMatch && projectIdMatch[1]) {
        setCurrentProjectId(projectIdMatch[1]);
        localStorage.setItem('currentProjectId', projectIdMatch[1]);
      } else {
        // Check query params
        const projectId = searchParams.get('projectId');

        if (projectId) {
          setCurrentProjectId(projectId);
          localStorage.setItem('currentProjectId', projectId);
        } else {
          // If not in URL or query, try to get from localStorage
          const storedProjectId = localStorage.getItem('currentProjectId');
          if (storedProjectId) {
            setCurrentProjectId(storedProjectId);
          }
        }
      }
    }
  }, [pathname, searchParams]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedTenantId = localStorage.getItem('currentTenantId');
    const storedProjectId = localStorage.getItem('currentProjectId');

    if (storedTenantId) {
      setCurrentTenantId(storedTenantId);
    }

    if (storedProjectId) {
      setCurrentProjectId(storedProjectId);
    }
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (currentTenantId) {
      localStorage.setItem('currentTenantId', currentTenantId);
    } else {
      localStorage.removeItem('currentTenantId');
    }

    if (currentProjectId) {
      localStorage.setItem('currentProjectId', currentProjectId);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  }, [currentTenantId, currentProjectId]);

  return (
    <TenantProjectContext.Provider
      value={{
        currentTenantId,
        currentProjectId,
        setCurrentTenantId,
        setCurrentProjectId,
      }}
    >
      {children}
    </TenantProjectContext.Provider>
  );
};

// Main provider with Suspense boundary
export const TenantProjectProvider = ({
  children,
}: TenantProjectProviderProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TenantProjectProviderInner>{children}</TenantProjectProviderInner>
    </Suspense>
  );
};
