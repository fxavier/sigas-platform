// components/dashboard/triagem-ambiental-dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';

interface TriagemAmbientalDashboardProps {
  tenantId?: string;
  projectId?: string;
  tenantSlug?: string;
}

interface TriagemAmbiental {
  id: string;
  subprojecto: {
    id: string;
    nome: string;
  };
  resultadoTriagem: {
    id: string;
    categoriaRisco: string;
    descricao: string;
    instrumentosASeremDesenvolvidos: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function TriagemAmbientalDashboard({
  tenantId,
  projectId,
  tenantSlug,
}: TriagemAmbientalDashboardProps) {
  const [triagens, setTriagens] = useState<TriagemAmbiental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentTenantId, currentProjectId } = useTenantProjectContext();

  const effectiveTenantId = tenantId || currentTenantId;
  const effectiveProjectId = projectId || currentProjectId;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!effectiveTenantId || !effectiveProjectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('tenantId', effectiveTenantId);
        queryParams.append('projectId', effectiveProjectId);

        const response = await fetch(
          `/api/forms/triagem-ambiental?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setTriagens(data);
      } catch (err: any) {
        console.error('Error fetching triagem ambiental data:', err);
        setError(err.message || 'Erro ao carregar dados de triagem ambiental');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [effectiveTenantId, effectiveProjectId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-6'>
          <p>Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!effectiveTenantId || !effectiveProjectId) {
    return (
      <Alert>
        <Info className='h-4 w-4' />
        <AlertDescription>
          Selecione um tenant e um projeto para visualizar os dados.
        </AlertDescription>
      </Alert>
    );
  }

  if (triagens.length === 0) {
    return (
      <div className='space-y-4'>
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Não há triagens ambientais cadastradas para este projeto.
          </AlertDescription>
        </Alert>

        {tenantSlug && (
          <Button asChild>
            <Link
              href={`/tenants/${tenantSlug}/esms-elements/triagem-ambiental`}
            >
              <Activity className='h-4 w-4 mr-2' />
              Cadastrar Triagem Ambiental
            </Link>
          </Button>
        )}
      </div>
    );
  }

  // Organize data for charts

  // Count by risk category
  const riskCategoryCounts = triagens.reduce(
    (acc: Record<string, number>, triagem) => {
      const category = triagem.resultadoTriagem.categoriaRisco;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  const riskCategoryData = Object.entries(riskCategoryCounts).map(
    ([name, value]) => {
      let color = '#4f46e5'; // Default color

      if (name.includes('Alto') || name.includes('A')) {
        color = '#ef4444'; // Red
      } else if (name.includes('Médio') || name.includes('B')) {
        color = '#f59e0b'; // Amber
      } else if (name.includes('Baixo') || name.includes('C')) {
        color = '#10b981'; // Green
      }

      return { name, value, color };
    }
  );

  // Count by subproject
  const subprojectCounts = triagens.reduce(
    (acc: Record<string, number>, triagem) => {
      const subproject = triagem.subprojecto.nome;
      acc[subproject] = (acc[subproject] || 0) + 1;
      return acc;
    },
    {}
  );

  const subprojectData = Object.entries(subprojectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 subprojects

  // Group by instruments to be developed
  const instrumentosSet = new Set<string>();
  triagens.forEach((triagem) => {
    if (triagem.resultadoTriagem.instrumentosASeremDesenvolvidos) {
      const instrumentos =
        triagem.resultadoTriagem.instrumentosASeremDesenvolvidos
          .split(',')
          .map((item) => item.trim());

      instrumentos.forEach((instrumento) => {
        if (instrumento) instrumentosSet.add(instrumento);
      });
    }
  });

  const instrumentosList = Array.from(instrumentosSet);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Dashboard de Triagem Ambiental</h2>

        {tenantSlug && (
          <Button asChild variant='outline'>
            <Link
              href={`/tenants/${tenantSlug}/esms-elements/triagem-ambiental`}
            >
              <ExternalLink className='h-4 w-4 mr-2' />
              Gerenciar Triagens
            </Link>
          </Button>
        )}
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {/* Risk Category Chart */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Distribuição por Categoria de Risco</CardTitle>
            <CardDescription>
              Análise das triagens por categoria de risco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={riskCategoryData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {riskCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>
              Informações gerais sobre triagens ambientais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center border-b pb-2'>
                <span className='text-sm font-medium'>Total de Triagens</span>
                <span className='text-lg font-bold'>{triagens.length}</span>
              </div>

              {riskCategoryData.map((category, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center border-b pb-2'
                >
                  <span
                    className={`text-sm font-medium flex items-center ${
                      category.name.includes('Alto') ||
                      category.name.includes('A')
                        ? 'text-red-500'
                        : category.name.includes('Médio') ||
                          category.name.includes('B')
                        ? 'text-amber-500'
                        : 'text-green-500'
                    }`}
                  >
                    <span
                      className='w-3 h-3 rounded-full mr-2'
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.name}
                  </span>
                  <span className='text-lg font-bold'>{category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Subproject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Triagens por Subprojeto</CardTitle>
            <CardDescription>
              Quantidade de triagens por subprojeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subprojectData.length > 0 ? (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={subprojectData} layout='vertical'>
                    <XAxis type='number' />
                    <YAxis
                      dataKey='name'
                      type='category'
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey='count' fill='#4f46e5' name='Triagens' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className='flex items-center justify-center h-[300px]'>
                <p className='text-gray-500'>Sem dados suficientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instrumentos a Desenvolver */}
        <Card>
          <CardHeader>
            <CardTitle>Instrumentos a Desenvolver</CardTitle>
            <CardDescription>
              Instrumentos identificados nas triagens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {instrumentosList.length > 0 ? (
              <div className='space-y-2 max-h-[300px] overflow-y-auto'>
                {instrumentosList.map((instrumento, index) => (
                  <div
                    key={index}
                    className='flex items-center p-2 border rounded-md'
                  >
                    <div className='mr-2 text-blue-600'>
                      <Info className='h-4 w-4' />
                    </div>
                    <span>{instrumento}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-[300px]'>
                <p className='text-gray-500'>Nenhum instrumento especificado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
