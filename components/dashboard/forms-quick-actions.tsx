'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  FileText,
  Users,
  AlertTriangle,
  Leaf,
  Building,
  MessageSquare,
  Calendar,
  BookOpen,
  Camera,
  UserCheck,
  ClipboardList,
  Target,
  Gavel,
  AlertCircle,
  ChevronDown,
  Zap,
  Clock,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuickAction {
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  href: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  isNew?: boolean;
  isPopular?: boolean;
}

interface FormsQuickActionsProps {
  tenantSlug: string;
  projectId?: string;
}

export function FormsQuickActions({
  tenantSlug,
  projectId,
}: FormsQuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quickActions: QuickAction[] = [
    {
      name: 'Nova Triagem Ambiental',
      description: 'Criar nova avaliação de triagem ambiental',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: `/tenants/${tenantSlug}/triagem-ambiental/new`,
      category: 'environmental',
      priority: 'high',
      isPopular: true,
    },
    {
      name: 'Ficha Ambiental',
      description: 'Registrar informações ambientais preliminares',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: `/tenants/${tenantSlug}/ficha-ambiental/new`,
      category: 'environmental',
      priority: 'high',
      isPopular: true,
    },
    {
      name: 'Relatório de Incidente',
      description: 'Reportar novo incidente de segurança',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: `/tenants/${tenantSlug}/relatorio-incidente/new`,
      category: 'safety',
      priority: 'high',
      isPopular: true,
    },
    {
      name: 'Queixa/Reclamação',
      description: 'Registrar nova queixa da comunidade',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: `/tenants/${tenantSlug}/queixas-reclamacoes/new`,
      category: 'social',
      priority: 'high',
      isPopular: true,
    },
    {
      name: 'Minuta Comitê',
      description: 'Criar minuta de reunião do comitê',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: `/tenants/${tenantSlug}/minutas-comite/new`,
      category: 'management',
      priority: 'medium',
    },
    {
      name: 'Matriz Treinamento',
      description: 'Registrar nova matriz de treinamento',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: `/tenants/${tenantSlug}/matriz-treinamento/new`,
      category: 'social',
      priority: 'medium',
    },
    {
      name: 'Controle Requisitos',
      description: 'Adicionar controle de requisitos legais',
      icon: Gavel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: `/tenants/${tenantSlug}/controle-requisitos/new`,
      category: 'compliance',
      priority: 'high',
    },
    {
      name: 'Objetivos e Metas',
      description: 'Definir objetivos ambientais e sociais',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: `/tenants/${tenantSlug}/objetivos-metas/new`,
      category: 'management',
      priority: 'medium',
    },
    {
      name: 'Relatório Simulacro',
      description: 'Documentar simulacro de emergência',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: `/tenants/${tenantSlug}/relatorio-simulacro/new`,
      category: 'safety',
      priority: 'medium',
      isNew: true,
    },
    {
      name: 'Auditoria Interna',
      description: 'Criar relatório de auditoria interna',
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: `/tenants/${tenantSlug}/auditoria-interna/new`,
      category: 'compliance',
      priority: 'low',
    },
  ];

  const categories = [
    { key: 'all', name: 'Todos', icon: FileText },
    { key: 'environmental', name: 'Ambiental', icon: Leaf },
    { key: 'social', name: 'Social', icon: Users },
    { key: 'safety', name: 'Segurança', icon: AlertTriangle },
    { key: 'management', name: 'Gestão', icon: Building },
    { key: 'compliance', name: 'Conformidade', icon: Gavel },
  ];

  const filteredActions =
    selectedCategory === 'all'
      ? quickActions
      : quickActions.filter((action) => action.category === selectedCategory);

  const popularActions = quickActions.filter((action) => action.isPopular);
  const recentActions = quickActions.slice(0, 4); // Mock recent actions

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Ações Rápidas</h2>
          <p className='text-muted-foreground'>
            Acesso rápido aos formulários mais utilizados
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              Novo Formulário
              <ChevronDown className='h-4 w-4 ml-2' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Formulários Disponíveis</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {quickActions.map((action, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link href={action.href} className='flex items-center'>
                  <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
                  {action.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Popular Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5 text-yellow-500' />
            Formulários Populares
          </CardTitle>
          <CardDescription>
            Os formulários mais utilizados pela sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {popularActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className='hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer'>
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`h-10 w-10 ${action.bgColor} rounded-lg flex items-center justify-center`}
                        >
                          <IconComponent
                            className={`h-5 w-5 ${action.color}`}
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate'>
                            {action.name}
                          </p>
                          <p className='text-xs text-muted-foreground truncate'>
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5 text-blue-500' />
            Usados Recentemente
          </CardTitle>
          <CardDescription>Formulários acessados recentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {recentActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer'>
                    <div
                      className={`h-8 w-8 ${action.bgColor} rounded-md flex items-center justify-center`}
                    >
                      <IconComponent className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm'>{action.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {action.description}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      {action.isNew && (
                        <Badge variant='secondary' className='text-xs'>
                          Novo
                        </Badge>
                      )}
                      <Badge
                        variant={
                          action.priority === 'high'
                            ? 'destructive'
                            : action.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                        }
                        className='text-xs'
                      >
                        {action.priority === 'high'
                          ? 'Alta'
                          : action.priority === 'medium'
                          ? 'Média'
                          : 'Baixa'}
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className='flex flex-wrap gap-2'>
        {categories.map((category) => (
          <Badge
            key={category.key}
            variant={selectedCategory === category.key ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => setSelectedCategory(category.key)}
          >
            <category.icon className='h-3 w-3 mr-1' />
            {category.name}
          </Badge>
        ))}
      </div>

      {/* All Actions Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} href={action.href}>
              <Card className='hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer h-full'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div
                      className={`h-12 w-12 ${action.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className='flex gap-1'>
                      {action.isNew && (
                        <Badge variant='secondary' className='text-xs'>
                          Novo
                        </Badge>
                      )}
                      {action.isPopular && (
                        <Badge variant='outline' className='text-xs'>
                          <Star className='h-3 w-3 mr-1' />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className='font-semibold mb-2'>{action.name}</h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    {action.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <Badge
                      variant={
                        action.priority === 'high'
                          ? 'destructive'
                          : action.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {action.priority === 'high'
                        ? 'Alta Prioridade'
                        : action.priority === 'medium'
                        ? 'Média Prioridade'
                        : 'Baixa Prioridade'}
                    </Badge>
                    <Zap className='h-4 w-4 text-muted-foreground' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
