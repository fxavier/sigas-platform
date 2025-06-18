// components/forms/registo-comunicacoes/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RegistoComunicacoes } from '@/hooks/use-registo-comunicacoes';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to translate RespostaSimNao
const translateRespostaSimNao = (resposta: string) => {
  const translations: Record<string, string> = {
    SIM: 'Sim',
    NAO: 'Não',
  };
  return translations[resposta] || resposta;
};

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<RegistoComunicacoes>[] => [
  {
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('data') as Date;
      if (!date) return '-';

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '-';

      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    accessorKey: 'local',
    header: 'Local',
    cell: ({ row }) => {
      const value = row.getValue('local') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='font-medium truncate max-w-[200px]' title={value}>
                {value}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'horario',
    header: 'Horário',
    cell: ({ row }) => {
      const value = row.getValue('horario') as string;
      return <div className='font-mono text-sm'>{value}</div>;
    },
  },
  {
    accessorKey: 'participantes',
    header: 'Participantes',
    cell: ({ row }) => {
      const value = row.getValue('participantes') as string;
      const participantCount = value.split(',').length;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[150px]'>
                {participantCount > 1
                  ? `${participantCount} participantes`
                  : value.substring(0, 50) + (value.length > 50 ? '...' : '')}
              </div>
            </TooltipTrigger>
            <TooltipContent className='max-w-[300px]'>
              <p className='whitespace-pre-wrap'>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'encontroAtendeuSeuProposito',
    header: 'Atendeu Propósito',
    cell: ({ row }) => {
      const value = row.getValue('encontroAtendeuSeuProposito') as string;
      let badgeVariant: 'default' | 'destructive' | 'secondary' = 'secondary';

      if (value === 'SIM') {
        badgeVariant = 'default';
      } else if (value === 'NAO') {
        badgeVariant = 'destructive';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {translateRespostaSimNao(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'haNecessidadeRetomarTema',
    header: 'Retomar Tema',
    cell: ({ row }) => {
      const value = row.getValue('haNecessidadeRetomarTema') as string;
      let badgeVariant: 'default' | 'destructive' | 'outline' = 'outline';

      if (value === 'SIM') {
        badgeVariant = 'destructive';
      } else if (value === 'NAO') {
        badgeVariant = 'default';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {translateRespostaSimNao(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'agenda',
    header: 'Agenda',
    cell: ({ row }) => {
      const value = row.getValue('agenda') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[200px]'>
                {value.substring(0, 80) + (value.length > 80 ? '...' : '')}
              </div>
            </TooltipTrigger>
            <TooltipContent className='max-w-[400px]'>
              <p className='whitespace-pre-wrap'>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return '-';

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '-';

      return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const registro = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            {onView && (
              <DropdownMenuItem onClick={() => onView(registro.id)}>
                <Eye className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onEdit(registro.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(registro.id)}
              className='text-red-600'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
