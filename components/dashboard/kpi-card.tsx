// components/dashboard/kpi-card.tsx
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  link?: {
    href: string;
    text: string;
  };
  footer?: {
    text: string;
    color: string;
  };
}

export function KPICard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  link,
  footer,
}: KPICardProps) {
  return (
    <Card className='animate-in fade-in duration-500'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <h3 className='text-3xl font-bold mt-1'>{value}</h3>
          </div>
          <div className={`p-3 ${iconBgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <div className='mt-4'>
          {link ? (
            <Link
              href={link.href}
              className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              {link.text}
            </Link>
          ) : footer ? (
            <p className={`text-sm ${footer.color} flex items-center`}>
              {footer.text}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
