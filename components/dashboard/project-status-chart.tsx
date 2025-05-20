// components/dashboard/project-status-chart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ProjectStatusChartProps {
  data: Array<{
    name: string;
    count: number;
  }>;
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const pieColors = [
    'hsla(var(--chart-1))',
    'hsla(var(--chart-2))',
    'hsla(var(--chart-3))',
    'hsla(var(--chart-4))',
  ];

  return (
    <Card className='col-span-1 animate-in fade-in duration-500'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Status dos Projetos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </div>
          <Tabs defaultValue='pie' className='w-32'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='pie'>
                <PieChart className='h-4 w-4' />
              </TabsTrigger>
              <TabsTrigger value='bar'>
                <BarChart className='h-4 w-4' />
              </TabsTrigger>
            </TabsList>
            <TabsContent value='pie' className='h-80 mt-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsPieChart>
                  <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='count'
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Projetos']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend verticalAlign='bottom' height={36} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value='bar' className='h-80 mt-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsBarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <XAxis dataKey='name' />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value) => [value, 'Projetos']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar
                    dataKey='count'
                    fill='hsla(var(--chart-2))'
                    radius={[4, 4, 0, 0]}
                    name='Quantidade'
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className='pt-4' />
    </Card>
  );
}
