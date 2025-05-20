// components/dashboard/project-progress-chart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePieChart } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ProjectProgressChartProps {
  data: Array<{
    name: string;
    progress: number;
  }>;
}

export function ProjectProgressChart({ data }: ProjectProgressChartProps) {
  return (
    <Card className='col-span-1 animate-in fade-in duration-500'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <CardDescription>
              Visão geral de todos os projetos ativos
            </CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <FilePieChart className='h-4 w-4 mr-1' />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-4'>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='name'
                angle={-45}
                textAnchor='end'
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis unit='%' domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Progresso']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar
                dataKey='progress'
                fill='hsla(var(--chart-1))'
                radius={[4, 4, 0, 0]}
                name='Progresso'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
