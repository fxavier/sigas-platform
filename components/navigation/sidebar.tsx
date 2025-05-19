// components/navigation/sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tenant, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateProjectModal } from '@/components/projects/create-project-modal';

interface SidebarProps {
  tenant: Tenant;
  user: User;
}

interface Project {
  id: string;
  name: string;
}

export function Sidebar({ tenant, user }: SidebarProps) {
  const pathname = usePathname();
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const canCreateProjects = user.role === 'ADMIN' || user.role === 'MANAGER';
  const isAdmin = user.role === 'ADMIN';
  const isAdminOrManager = user.role === 'ADMIN' || user.role === 'MANAGER';

  // Fetch projects based on user role
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['sidebarProjects', tenant.id, user.id, user.role],
    queryFn: async () => {
      console.log('Fetching projects for user role:', user.role);
      // Different endpoint based on user role
      const endpoint = isAdminOrManager
        ? `/api/tenants/${tenant.id}/projects`
        : `/api/tenants/${tenant.id}/projects/assigned`;

      const response = await axios.get(endpoint);
      console.log('Received projects:', response.data);
      return response.data;
    },
  });

  // Define navigation items - ALWAYS include Dashboard
  const navItems = [
    {
      title: 'Dashboard',
      href: `/tenants/${tenant.slug}/dashboard`,
      icon: LayoutDashboard,
    },
  ];

  // Add admin and manager specific items
  if (isAdminOrManager) {
    navItems.push({
      title: 'User Management',
      href: `/tenants/${tenant.slug}/settings/users`,
      icon: Users,
    });
  }

  // Add admin only items
  if (isAdmin) {
    navItems.push({
      title: 'Organization Settings',
      href: `/tenants/${tenant.slug}/settings/general`,
      icon: Settings,
    });
  }

  return (
    <div className='h-full border-r bg-white w-64 flex flex-col'>
      <div className='p-4 border-b'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold'>Navigation</h2>
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-2'>
          {/* Main navigation items - ALWAYS show these */}
          <nav className='space-y-1'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <item.icon className='h-4 w-4' />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Projects section */}
          <div className='mt-6'>
            <div
              className='flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900'
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            >
              <div className='flex items-center gap-3'>
                <FolderKanban className='h-4 w-4' />
                <span>{user.role === 'USER' ? 'My Projects' : 'Projects'}</span>
              </div>
              {isProjectsOpen ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </div>

            {isProjectsOpen && (
              <div className='mt-1 pl-9 space-y-1'>
                {isLoading ? (
                  // Skeleton loaders for projects
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-8 w-full' />
                  </div>
                ) : projects.length === 0 ? (
                  <div className='text-sm text-gray-500 py-2'>
                    {user.role === 'USER'
                      ? 'No projects assigned yet'
                      : 'No projects created yet'}
                  </div>
                ) : (
                  // Project list
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/tenants/${tenant.slug}/projects/${project.id}`}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm font-medium',
                        pathname ===
                          `/tenants/${tenant.slug}/projects/${project.id}` ||
                          pathname.startsWith(
                            `/tenants/${tenant.slug}/projects/${project.id}/`
                          )
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {project.name}
                    </Link>
                  ))
                )}

                {/* Create project button for admins and managers */}
                {canCreateProjects && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start text-gray-500 hover:text-gray-900 mt-2'
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    New Project
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Create project modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tenantId={tenant.id}
        tenantSlug={tenant.slug}
      />
    </div>
  );
}
