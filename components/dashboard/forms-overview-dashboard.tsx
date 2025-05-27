'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Shield,
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FormStats {
  name: string;
  count: number;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  category: string;
  completionRate: number;
  recentActivity: number;
  priority: 'high' | 'medium' | 'low';
}

interface FormsOverviewDashboardProps {
  tenantId: string;
  projectId?: string;
}

const FORM_CATEGORIES = {
  environmental: {
    name: 'Ambiental',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Leaf,
  },
  social: {
    name: 'Social',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Users,
  },
  safety: {
    name: 'Segurança',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Shield,
  },
  management: {
    name: 'Gestão',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Building,
  },
  compliance: {
    name: 'Conformidade',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: Gavel,
  },
};

export function FormsOverviewDashboard({
  tenantId,
  projectId,
}: FormsOverviewDashboardProps) {
  const [formStats, setFormStats] = useState<FormStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - In a real implementation, this would fetch from APIs
  const mockFormStats: FormStats[] = [
    {
      name: 'Triagem Ambiental',
      count: 24,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Avaliações de impacto ambiental',
      category: 'environmental',
      completionRate: 85,
      recentActivity: 3,
      priority: 'high',
    },
    {
      name: 'Ficha Ambiental',
      count: 18,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Informações ambientais preliminares',
      category: 'environmental',
      completionRate: 92,
      recentActivity: 2,
      priority: 'high',
    },
    {
      name: 'Queixas e Reclamações',
      count: 12,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Registro de queixas da comunidade',
      category: 'social',
      completionRate: 78,
      recentActivity: 5,
      priority: 'high',
    },
    {
      name: 'Reclamações Trabalhadores',
      count: 8,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Formulários de reclamações internas',
      category: 'social',
      completionRate: 88,
      recentActivity: 1,
      priority: 'medium',
    },
    {
      name: 'Relatórios de Incidente',
      count: 15,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Relatórios de incidentes de segurança',
      category: 'safety',
      completionRate: 95,
      recentActivity: 2,
      priority: 'high',
    },
    {
      name: 'Relatórios Iniciais',
      count: 22,
      icon: ClipboardList,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Relatórios iniciais de incidentes',
      category: 'safety',
      completionRate: 90,
      recentActivity: 4,
      priority: 'high',
    },
    {
      name: 'Minutas Comitê',
      count: 6,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Minutas do comitê de gestão',
      category: 'management',
      completionRate: 100,
      recentActivity: 1,
      priority: 'medium',
    },
    {
      name: 'Matriz Stakeholder',
      count: 10,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Matriz de partes interessadas',
      category: 'management',
      completionRate: 80,
      recentActivity: 2,
      priority: 'medium',
    },
    {
      name: 'Objetivos e Metas',
      count: 14,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Objetivos ambientais e sociais',
      category: 'management',
      completionRate: 87,
      recentActivity: 3,
      priority: 'medium',
    },
    {
      name: 'Matriz Treinamento',
      count: 20,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Matriz de treinamentos',
      category: 'social',
      completionRate: 75,
      recentActivity: 6,
      priority: 'medium',
    },
    {
      name: 'Controle Requisitos',
      count: 16,
      icon: Gavel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Controle de requisitos legais',
      category: 'compliance',
      completionRate: 93,
      recentActivity: 2,
      priority: 'high',
    },
    {
      name: 'Auditoria Interna',
      count: 4,
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Relatórios de auditoria interna',
      category: 'compliance',
      completionRate: 100,
      recentActivity: 0,
      priority: 'low',
    },
    {
      name: 'Relatório Simulacro',
      count: 7,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Relatórios de simulacros',
      category: 'safety',
      completionRate: 86,
      recentActivity: 1,
      priority: 'medium',
    },
    {
      name: 'Fotografias Incidente',
      count: 35,
      icon: Camera,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Fotografias de incidentes',
      category: 'safety',
      completionRate: 82,
      recentActivity: 8,
      priority: 'low',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchFormStats = async () => {
      setIsLoading(true);
      // In a real implementation, you would fetch data from multiple APIs
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormStats(mockFormStats);
      setIsLoading(false);
    };

    fetchFormStats();
  }, [tenantId, projectId]);

  const filteredStats =
    selectedCategory === 'all'
      ? formStats
      : formStats.filter((stat) => stat.category === selectedCategory);

  const totalForms = formStats.reduce((sum, stat) => sum + stat.count, 0);
  const averageCompletion =
    formStats.reduce((sum, stat) => sum + stat.completionRate, 0) /
    formStats.length;
  const recentActivity = formStats.reduce(
    (sum, stat) => sum + stat.recentActivity,
    0
  );
  const highPriorityForms = formStats.filter(
    (stat) => stat.priority === 'high'
  ).length;

  // Chart data
  const categoryData = Object.entries(FORM_CATEGORIES).map(
    ([key, category]) => ({
      name: category.name,
      count: formStats
        .filter((stat) => stat.category === key)
        .reduce((sum, stat) => sum + stat.count, 0),
      color: category.color.replace('text-', ''),
    })
  );

  const completionData = formStats.map((stat) => ({
    name: stat.name.split(' ')[0],
    completion: stat.completionRate,
    count: stat.count,
  }));

  const activityData = [
    { name: 'Jan', submissions: 45 },
    { name: 'Fev', submissions: 52 },
    { name: 'Mar', submissions: 48 },
    { name: 'Abr', submissions: 61 },
    { name: 'Mai', submissions: 55 },
    { name: 'Jun', submissions: 67 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b'];

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardContent className='p-6'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-8 bg-gray-200 rounded w-1/2'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total de Formulários
                </p>
                <p className='text-2xl font-bold'>{totalForms}</p>
              </div>
              <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <FileText className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Taxa de Conclusão
                </p>
                <p className='text-2xl font-bold'>
                  {averageCompletion.toFixed(1)}%
                </p>
              </div>
              <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Atividade Recente
                </p>
                <p className='text-2xl font-bold'>{recentActivity}</p>
              </div>
              <div className='h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Activity className='h-6 w-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Alta Prioridade
                </p>
                <p className='text-2xl font-bold'>{highPriorityForms}</p>
              </div>
              <div className='h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center'>
                <AlertTriangle className='h-6 w-6 text-red-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className='flex flex-wrap gap-2'>
        <Badge
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className='cursor-pointer'
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </Badge>
        {Object.entries(FORM_CATEGORIES).map(([key, category]) => (
          <Badge
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => setSelectedCategory(key)}
          >
            <category.icon className='h-3 w-3 mr-1' />
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Forms by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Formulários por Categoria</CardTitle>
            <CardDescription>
              Distribuição de formulários por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='count'
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conclusão</CardTitle>
            <CardDescription>
              Percentual de conclusão por tipo de formulário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='completion' fill='#10b981' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Submissões</CardTitle>
          <CardDescription>
            Número de formulários submetidos por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='submissions'
                stroke='#3b82f6'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {filteredStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div
                    className={`h-10 w-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge
                    variant={
                      stat.priority === 'high'
                        ? 'destructive'
                        : stat.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {stat.priority === 'high'
                      ? 'Alta'
                      : stat.priority === 'medium'
                      ? 'Média'
                      : 'Baixa'}
                  </Badge>
                </div>
                <h3 className='font-semibold text-sm mb-1'>{stat.name}</h3>
                <p className='text-xs text-muted-foreground mb-3'>
                  {stat.description}
                </p>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Total: {stat.count}</span>
                    <span>Recente: {stat.recentActivity}</span>
                  </div>
                  <div className='space-y-1'>
                    <div className='flex justify-between text-xs'>
                      <span>Conclusão</span>
                      <span>{stat.completionRate}%</span>
                    </div>
                    <Progress value={stat.completionRate} className='h-2' />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
