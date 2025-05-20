// components/dashboard/monthly-progress-chart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MonthlyProgressChartProps {
  data: Array<{
    month: string;
    [key: string]: string | number;
  }>;
}

export function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  const projects = Object.keys(data[0]).filter((key) => key !== 'month');
  const chartColors = [
    'hsla(var(--chart-1))',
    'hsla(var(--chart-2))',
    'hsla(var(--chart-3))',
    'hsla(var(--chart-4))',
    'hsla(var(--chart-5))',
  ];

  return (
    <Card className='animate-in fade-in duration-500'>
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
        <CardDescription>
          Progresso dos projetos nos últimos meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis dataKey='month' />
              <YAxis unit='%' domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Progresso']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend verticalAlign='top' height={36} />
              {projects.map((project, index) => (
                <Line
                  key={project}
                  type='monotone'
                  dataKey={project}
                  stroke={chartColors[index % chartColors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
