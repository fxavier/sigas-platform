// components/navigation/sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Building,
  FileText,
  FileStack,
  AlertTriangle,
  Sprout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const router = useRouter();
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isESMSDocumentsOpen, setIsESMSDocumentsOpen] = useState(false);
  const [isESMSElementsOpen, setIsESMSElementsOpen] = useState(false);
  const [activeSubmenus, setActiveSubmenus] = useState<Record<string, boolean>>(
    {}
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showProjectSelection, setShowProjectSelection] = useState(false);

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

  // Helper function to toggle submenu state
  const toggleSubmenu = (key: string) => {
    setActiveSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Set first project as selected when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowProjectSelection(false);
  };

  // Check if the current path is related to ESMS
  const isESMSPath =
    pathname.includes('/esms-documents') || pathname.includes('/esms-elements');

  // Define navigation items - ALWAYS include Dashboard
  const navItems = [
    {
      title: 'Dashboard',
      href: `/tenants/${tenant.slug}/dashboard`,
      icon: LayoutDashboard,
    },
  ];

  // Add Organizations only for ADMIN and MANAGER roles
  if (isAdminOrManager) {
    navItems.push({
      title: 'Organizações',
      href: '/organizations',
      icon: Building,
    });
  }

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

  if (isAdminOrManager) {
    navItems.push({
      title: 'Biodiversidade e Recursos Naturais',
      href: `/tenants/${tenant.slug}/biodiversidade-recursos`,
      icon: Sprout,
    });
  }

  if (isAdminOrManager) {
    navItems.push({
      title: 'Perguntas para Avaliação de Classificação de Emergência',
      href: `/tenants/${tenant.slug}/perguntas-avaliacao-classificacao-emergencia`,
      icon: FileText,
    });
  }

  // Function to navigate to ESMS section with project context
  const navigateToESMS = (path: string) => {
    if (!selectedProjectId) {
      toast.error('Selecione um projeto primeiro');
      setShowProjectSelection(true);
      return;
    }

    router.push(
      `/tenants/${tenant.slug}${path}?projectId=${selectedProjectId}`
    );
  };

  // Render a submenu item and its children recursively
  const renderSubmenuItem = (item: any, level = 0, parentPath = '') => {
    const fullPath = `${parentPath}${item.href}`;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = pathname.startsWith(fullPath);
    const submenuKey = `submenu-${fullPath}`;
    const isSubmenuOpen = activeSubmenus[submenuKey] || isActive;

    return (
      <div key={fullPath} className='mb-1'>
        <div
          className={cn(
            'flex items-center justify-between rounded-md pl-3 pr-2 py-2 text-sm font-medium cursor-pointer',
            isActive
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
            level > 0 && `ml-${2 * level}`
          )}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={(e) => {
            e.preventDefault();
            if (hasSubmenu) {
              toggleSubmenu(submenuKey);
            } else {
              // This is an end node, navigate with project context
              navigateToESMS(fullPath);
            }
          }}
        >
          <div className='flex-1 flex items-center'>
            <span>{item.title}</span>
          </div>
          {hasSubmenu && (
            <div className='ml-2'>
              {isSubmenuOpen ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </div>
          )}
        </div>

        {hasSubmenu && isSubmenuOpen && (
          <div className='ml-2 mt-1 space-y-1'>
            {item.submenu.map((subItem: any) =>
              renderSubmenuItem(subItem, level + 1, parentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='h-full border-r bg-white w-64 flex flex-col overflow-hidden'>
      <div className='p-4 border-b flex flex-col gap-2 flex-shrink-0'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold'>Navigation</h2>
        </div>

        {/* Project selector */}
        <div className='w-full'>
          <div className='flex items-center gap-2'>
            <Select
              value={selectedProjectId}
              onValueChange={handleProjectSelect}
              disabled={isLoading || projects.length === 0}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    isLoading
                      ? 'Carregando projetos...'
                      : projects.length === 0
                      ? 'Nenhum projeto disponível'
                      : 'Selecione um projeto'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setIsCreateModalOpen(true)}
                    disabled={!canCreateProjects}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Criar novo projeto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        <ScrollArea className='h-full'>
          <div className='p-2 pb-6'>
            {/* Main navigation items - ALWAYS show these */}
            <nav className='space-y-1'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4',
                      pathname === item.href ? 'text-primary' : ''
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>

            {/* ESMS Documents Section - Available to all users */}
            <div className='mt-6'>
              <div
                className='flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900'
                onClick={() => {
                  if (!selectedProjectId) {
                    toast.error('Selecione um projeto primeiro');
                    setShowProjectSelection(true);
                    return;
                  }
                  setIsESMSDocumentsOpen(!isESMSDocumentsOpen);
                }}
              >
                <div className='flex items-center gap-3'>
                  <FileText className='h-4 w-4' />
                  <span>ESMS Documents</span>
                </div>
                <div className='flex items-center'>
                  {!selectedProjectId && (
                    <AlertTriangle className='h-4 w-4 text-amber-500 mr-2' />
                  )}
                  {isESMSDocumentsOpen ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </div>
              </div>
              {isESMSDocumentsOpen && selectedProjectId && (
                <div className='mt-1 pl-9 space-y-1'>
                  <div
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                      pathname.includes('/esms-documents/politicas')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => navigateToESMS('/esms-documents/politicas')}
                  >
                    Políticas
                  </div>
                  <div
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                      pathname.includes('/esms-documents/manuais')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => navigateToESMS('/esms-documents/manuais')}
                  >
                    Manuais
                  </div>
                  <div
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                      pathname.includes('/esms-documents/procedimentos')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() =>
                      navigateToESMS('/esms-documents/procedimentos')
                    }
                  >
                    Procedimentos
                  </div>
                  <div
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                      pathname.includes('/esms-documents/formularios')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() =>
                      navigateToESMS('/esms-documents/formularios')
                    }
                  >
                    Formulários
                  </div>
                  <div
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                      pathname.includes('/esms-documents/modelos')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => navigateToESMS('/esms-documents/modelos')}
                  >
                    Modelos
                  </div>
                </div>
              )}
            </div>

            {/* ESMS Elements Section - Available to all users */}
            <div className='mt-2'>
              <div
                className='flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900'
                onClick={() => {
                  if (!selectedProjectId) {
                    toast.error('Selecione um projeto primeiro');
                    setShowProjectSelection(true);
                    return;
                  }
                  setIsESMSElementsOpen(!isESMSElementsOpen);
                }}
              >
                <div className='flex items-center gap-3'>
                  <FileStack className='h-4 w-4' />
                  <span>ESMS Elements</span>
                </div>
                <div className='flex items-center'>
                  {!selectedProjectId && (
                    <AlertTriangle className='h-4 w-4 text-amber-500 mr-2' />
                  )}
                  {isESMSElementsOpen ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </div>
              </div>

              {isESMSElementsOpen && selectedProjectId && (
                <div className='mt-1 space-y-1'>
                  {/* ES Risks and Impacts Identification */}
                  <div className='pl-4'>
                    {renderSubmenuItem({
                      title: 'ES Risks and Impacts Identification',
                      href: `/esms-elements/risks-impacts`,
                      submenu: [
                        {
                          title:
                            'FR.AS.002 - Identificação e Avaliação de impactos e riscos ambientais e sociais',
                          href: `/esms-elements/identification-of-risks-impacts/fr-as-002`,
                        },
                        {
                          title: 'FR.AS.003 - Controle de requisitos legais',
                          href: `/esms-elements/identification-of-risks-impacts/fr-as-003`,
                        },
                        {
                          title: 'FR.AS.023 - Triagem ambiental e social',
                          href: `/esms-elements/identification-of-risks-impacts/fr-as-023`,
                        },
                        {
                          title: 'MOD.AS.01 - Instrução do processo de AIA',
                          href: `/esms-elements/identification-of-risks-impacts/mod-as-01`,
                        },
                        {
                          title:
                            'MOD.AS.02 - Ficha de informação ambiental preliminar',
                          href: `/esms-elements/identification-of-risks-impacts/mod-as-02`,
                        },
                      ],
                    })}
                  </div>

                  {/* Management Programs */}
                  <div className='pl-4'>
                    {renderSubmenuItem({
                      title: 'Management Programs',
                      href: `/esms-elements/management-programs`,
                      submenu: [
                        {
                          title:
                            'FR.AS.020 - Registo do objectivos e metas ambientais e sociais',
                          href: `/esms-elements/management-programs/fr-as-020`,
                        },
                        {
                          title: 'FR.AS.009 - Relatório de acidente_incidente',
                          href: `/esms-elements/management-programs/fr-as-009`,
                        },
                        {
                          title: 'FR.AS.028 - Relatório Inicial de Incidente',
                          href: `/esms-elements/management-programs/relatorio-inicial-incidente`,
                        },
                      ],
                    })}
                  </div>
                  {/* Organizational Capacity and Competence */}
                  <div className='pl-4'>
                    {renderSubmenuItem({
                      title: 'Organizational Capacity and Competence',
                      href: `/esms-elements/organizational-capacity-and-competence`,
                      submenu: [
                        {
                          title:
                            'FR.AS.005 - Matriz de Identificacao das necessidades de treinamento',
                          href: `/esms-elements/organizational-capacity-and-competence/fr-as-005`,
                        },
                      ],
                    })}
                  </div>

                  {/* Emergency Preparedness and Response */}
                  <div className='pl-4'>
                    {renderSubmenuItem({
                      title: 'Emergency Preparedness and Response',
                      href: `/esms-elements/emergency-preparedness-response`,
                      submenu: [
                        {
                          title: 'FR.AS.010 - Relatório de Simulacro',
                          href: `/esms-elements/emergency-preparedness-response/fr-as-010`,
                        },
                      ],
                    })}
                  </div>

                  {/* Monitoring and Review - Just showing a couple as examples */}
                  <div className='pl-4'>
                    {renderSubmenuItem({
                      title: 'Monitoring and Review',
                      href: `/esms-elements/monitoring-and-review`,
                      submenu: [
                        {
                          title: 'FR.AS.016 - Relatório de Auditoria',
                          href: `/esms-elements/monitoring-and-review/fr-as-016`,
                        },
                      ],
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Projects section */}
            <div className='mt-6'>
              <div
                className='flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-900'
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              >
                <div className='flex items-center gap-3'>
                  <FolderKanban className='h-4 w-4' />
                  <span>
                    {user.role === 'USER' ? 'My Projects' : 'Projects'}
                  </span>
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
                            ? 'bg-primary/10 text-primary'
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
      </div>

      {/* Project Selection Dialog */}
      <Dialog
        open={showProjectSelection}
        onOpenChange={setShowProjectSelection}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Selecione um Projeto</DialogTitle>
            <DialogDescription>
              Você precisa selecionar um projeto para acessar os documentos e
              elementos ESMS.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Select
              value={selectedProjectId}
              onValueChange={handleProjectSelect}
              disabled={isLoading || projects.length === 0}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    isLoading
                      ? 'Carregando projetos...'
                      : projects.length === 0
                      ? 'Nenhum projeto disponível'
                      : 'Selecione um projeto'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {projects.length === 0 && !isLoading && (
              <div className='text-sm text-amber-600 flex items-center gap-2'>
                <AlertTriangle className='h-4 w-4' />
                <span>
                  Nenhum projeto disponível. Crie um projeto primeiro.
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setShowProjectSelection(false)}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              disabled={!selectedProjectId || !canCreateProjects}
              onClick={() => {
                setShowProjectSelection(false);
                setIsCreateModalOpen(true);
              }}
            >
              Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
