'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingTask {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'review' | 'approval' | 'deadline';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  formType: string;
  assignee?: string;
  href: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  href?: string;
}

interface FormsStatusWidgetProps {
  tenantSlug: string;
  projectId?: string;
}

export function FormsStatusWidget({
  tenantSlug,
  projectId,
}: FormsStatusWidgetProps) {
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - In a real implementation, this would fetch from APIs
  const mockPendingTasks: PendingTask[] = [
    {
      id: '1',
      title: 'Revisão de Triagem Ambiental',
      description: 'Triagem ambiental do Projeto Hidroelétrico aguarda revisão',
      type: 'review',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      formType: 'Triagem Ambiental',
      assignee: 'Ana Silva',
      href: `/tenants/${tenantSlug}/triagem-ambiental/review/1`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: '2',
      title: 'Relatório de Incidente Pendente',
      description:
        'Incidente de segurança reportado ontem precisa ser finalizado',
      type: 'form',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      formType: 'Relatório de Incidente',
      assignee: 'Carlos Oliveira',
      href: `/tenants/${tenantSlug}/relatorio-incidente/edit/2`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: '3',
      title: 'Aprovação de Objetivos e Metas',
      description: 'Novos objetivos ambientais aguardam aprovação da gerência',
      type: 'approval',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      formType: 'Objetivos e Metas',
      assignee: 'Diretor Geral',
      href: `/tenants/${tenantSlug}/objetivos-metas/approve/3`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: '4',
      title: 'Prazo de Auditoria Interna',
      description: 'Auditoria interna trimestral vence em 1 semana',
      type: 'deadline',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      formType: 'Auditoria Interna',
      href: `/tenants/${tenantSlug}/auditoria-interna/new`,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: '5',
      title: 'Queixa da Comunidade',
      description: 'Nova queixa registrada precisa de investigação',
      type: 'form',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      formType: 'Queixas e Reclamações',
      assignee: 'Luísa Mendes',
      href: `/tenants/${tenantSlug}/queixas-reclamacoes/investigate/5`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Novo Relatório de Incidente',
      message: 'Incidente de segurança reportado no setor de construção',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      href: `/tenants/${tenantSlug}/relatorio-incidente/view/latest`,
    },
    {
      id: '2',
      title: 'Triagem Ambiental Aprovada',
      message: 'Triagem ambiental do Projeto Solar foi aprovada',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      href: `/tenants/${tenantSlug}/triagem-ambiental/view/approved`,
    },
    {
      id: '3',
      title: 'Prazo de Controle de Requisitos',
      message: 'Controle de requisitos legais vence em 3 dias',
      type: 'info',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
    },
    {
      id: '4',
      title: 'Matriz de Treinamento Atualizada',
      message: 'Nova matriz de treinamento foi adicionada ao sistema',
      type: 'info',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPendingTasks(mockPendingTasks);
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    fetchData();
  }, [tenantSlug, projectId]);

  const highPriorityTasks = pendingTasks.filter(
    (task) => task.priority === 'high'
  );
  const unreadNotifications = notifications.filter((notif) => !notif.read);
  const overdueTasks = pendingTasks.filter((task) => task.dueDate < new Date());

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'form':
        return FileText;
      case 'review':
        return Clock;
      case 'approval':
        return CheckCircle;
      case 'deadline':
        return Calendar;
      default:
        return FileText;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Tarefas Pendentes
                </p>
                <p className='text-2xl font-bold'>{pendingTasks.length}</p>
              </div>
              <div className='h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Clock className='h-5 w-5 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Alta Prioridade
                </p>
                <p className='text-2xl font-bold'>{highPriorityTasks.length}</p>
              </div>
              <div className='h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Notificações
                </p>
                <p className='text-2xl font-bold'>
                  {unreadNotifications.length}
                </p>
              </div>
              <div className='h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Bell className='h-5 w-5 text-orange-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5 text-blue-500' />
                Tarefas Pendentes
              </CardTitle>
              <CardDescription>
                Formulários e ações que requerem sua atenção
              </CardDescription>
            </div>
            <Button variant='outline' size='sm' asChild>
              <Link href={`/tenants/${tenantSlug}/tasks`}>
                Ver Todas
                <ArrowRight className='h-4 w-4 ml-2' />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {pendingTasks.slice(0, 5).map((task) => {
              const IconComponent = task.icon;
              const TypeIcon = getTaskTypeIcon(task.type);
              const isOverdue = task.dueDate < new Date();
              const daysUntilDue = Math.ceil(
                (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Link key={task.id} href={task.href}>
                  <div className='flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer'>
                    <div
                      className={`h-10 w-10 ${task.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className={`h-5 w-5 ${task.color}`} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between mb-1'>
                        <h4 className='font-medium text-sm'>{task.title}</h4>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant={
                              task.priority === 'high'
                                ? 'destructive'
                                : task.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                            className='text-xs'
                          >
                            {task.priority === 'high'
                              ? 'Alta'
                              : task.priority === 'medium'
                              ? 'Média'
                              : 'Baixa'}
                          </Badge>
                          <TypeIcon className='h-4 w-4 text-muted-foreground' />
                        </div>
                      </div>
                      <p className='text-xs text-muted-foreground mb-2'>
                        {task.description}
                      </p>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>
                          {task.formType}
                          {task.assignee && ` • ${task.assignee}`}
                        </span>
                        <span
                          className={
                            isOverdue
                              ? 'text-red-600 font-medium'
                              : daysUntilDue <= 1
                              ? 'text-orange-600 font-medium'
                              : 'text-muted-foreground'
                          }
                        >
                          {isOverdue
                            ? 'Atrasado'
                            : daysUntilDue === 0
                            ? 'Hoje'
                            : daysUntilDue === 1
                            ? 'Amanhã'
                            : `${daysUntilDue} dias`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Bell className='h-5 w-5 text-orange-500' />
                Notificações Recentes
              </CardTitle>
              <CardDescription>
                Atualizações e alertas do sistema
              </CardDescription>
            </div>
            <Button variant='outline' size='sm'>
              Marcar como Lidas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {notifications.slice(0, 4).map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    !notification.read
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-muted/30'
                  } ${
                    notification.href ? 'cursor-pointer hover:bg-muted/50' : ''
                  }`}
                  onClick={() => {
                    if (notification.href) {
                      window.location.href = notification.href;
                    }
                  }}
                >
                  <div className='flex-shrink-0'>
                    <IconComponent className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-1'>
                      <h4 className='font-medium text-sm'>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className='h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1'></div>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground mb-1'>
                      {notification.message}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      {notification.href && (
                        <ExternalLink className='h-3 w-3 text-muted-foreground' />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Progresso Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span>Formulários Completados</span>
                <span>12/15</span>
              </div>
              <Progress value={80} className='h-2' />
              <p className='text-xs text-muted-foreground'>
                3 formulários restantes para completar a meta semanal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2 mb-2'>
              <TrendingUp className='h-4 w-4 text-green-600' />
              <span className='text-sm font-medium'>+15%</span>
              <span className='text-xs text-muted-foreground'>
                vs. mês anterior
              </span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Aumento na submissão de formulários ambientais
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
