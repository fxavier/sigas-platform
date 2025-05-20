// components/organizations/organization-list.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tenant } from '@prisma/client';
import { Plus, Building, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreateOrganizationModal } from '@/components/organizations/create-organization-modal';
import axios from 'axios';
import { toast } from 'sonner';

interface OrganizationListProps {
  organizations: Tenant[];
  canCreate: boolean;
}

export function OrganizationList({
  organizations,
  canCreate,
}: OrganizationListProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState<Record<string, boolean>>({});

  const handleSelectTenant = async (tenant: Tenant) => {
    try {
      // Set loading state for this tenant
      setIsAssigning({
        ...isAssigning,
        [tenant.id]: true,
      });

      // Call API to assign the user to this tenant
      await axios.post('/api/users/assign-tenant', {
        tenantId: tenant.id,
      });

      // Show success message
      toast.success('Acessando organização', {
        description: `Você está acessando ${tenant.name}`,
      });

      // Redirect to the tenant's dashboard
      router.push(`/tenants/${tenant.slug}/dashboard`);
    } catch (error) {
      console.error('Error assigning tenant:', error);
      toast.error('Falha ao acessar organização');
      setIsAssigning({
        ...isAssigning,
        [tenant.id]: false,
      });
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Organizações</h1>
          <p className='text-muted-foreground mt-1'>
            Gerencie suas organizações e projetos associados
          </p>
        </div>

        <div className='flex space-x-3'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard')}
            className='flex items-center'
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Ir para Dashboard
          </Button>

          {canCreate && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Nova Organização
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {organizations.map((org) => (
          <Card
            key={org.id}
            className='cursor-pointer hover:shadow-md transition-all border-2 border-border hover:border-primary'
            onClick={() => handleSelectTenant(org)}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='bg-primary/10 p-3 rounded-full'>
                    <Building className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-medium'>{org.name}</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {org.description || 'Sem descrição'}
                    </p>
                  </div>
                </div>
                {isAssigning[org.id] ? (
                  <div className='animate-spin h-5 w-5 text-primary'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                  </div>
                ) : (
                  <ChevronRight className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Organization Card */}
        {canCreate && (
          <Card
            className='cursor-pointer hover:shadow-md transition-all border-2 border-dashed border-border hover:border-primary'
            onClick={() => setIsModalOpen(true)}
          >
            <CardContent className='p-6 flex items-center justify-center h-full'>
              <div className='text-center'>
                <div className='bg-primary/10 p-3 rounded-full mx-auto mb-3'>
                  <Plus className='h-6 w-6 text-primary' />
                </div>
                <h3 className='font-medium'>Nova Organização</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Criar uma nova organização
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
