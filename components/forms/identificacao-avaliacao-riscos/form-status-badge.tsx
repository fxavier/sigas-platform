// components/forms/identificacao-avaliacao-riscos/form-status-badge.tsx
'use client';

import { cn } from '@/lib/utils';

type StatusType = 'required' | 'optional' | 'calculated' | 'auto';

interface FormStatusBadgeProps {
  type: StatusType;
  className?: string;
}

export function FormStatusBadge({ type, className }: FormStatusBadgeProps) {
  const getBadgeStyles = () => {
    switch (type) {
      case 'required':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'optional':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'calculated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'auto':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getBadgeText = () => {
    switch (type) {
      case 'required':
        return 'Obrigatório';
      case 'optional':
        return 'Opcional';
      case 'calculated':
        return 'Calculado';
      case 'auto':
        return 'Automático';
      default:
        return '';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        getBadgeStyles(),
        className
      )}
    >
      {getBadgeText()}
    </span>
  );
}
