// components/forms/minutas-comite-gestao/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Clock,
  MapPin,
} from 'lucide-react';
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
import { MinutasComiteGestao } from '@/hooks/use-minutas-comite-gestao';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to get situation badge variant
const getSituacaoBadgeVariant = (
  situacao: string
): 'default' | 'destructive' | 'secondary' | 'outline' => {
  const situacaoLower = situacao.toLowerCase();
  if (situacaoLower.includes('concluí') || situacaoLower.includes('finaliz')) {
    return 'default';
  } else if (
    situacaoLower.includes('pendente') ||
    situacaoLower.includes('atras')
  ) {
    return 'destructive';
  } else if (
    situacaoLower.includes('andamento') ||
    situacaoLower.includes('progresso')
  ) {
    return 'secondary';
  }
  return 'outline';
};

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<MinutasComiteGestao>[] => [
  {
    accessorKey: 'data',
    header: 'Data da Reunião',
    cell: ({ row }) => {
      const date = row.getValue('data') as Date;
      return (
        <div className='font-medium'>
          {format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      );
    },
  },
  {
    accessorKey: 'hora',
    header: 'Horário',
    cell: ({ row }) => {
      const value = row.getValue('hora') as string;
      return (
        <div className='flex items-center gap-1 font-mono text-sm'>
          <Clock className='h-3 w-3 text-muted-foreground' />
          {value}
        </div>
      );
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
              <div className='flex items-center gap-1 truncate max-w-[180px]'>
                <MapPin className='h-3 w-3 text-muted-foreground flex-shrink-0' />
                <span title={value}>{value}</span>
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
    accessorKey: 'presididoPor',
    header: 'Presidido Por',
    cell: ({ row }) => {
      const value = row.getValue('presididoPor') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='font-medium truncate max-w-[150px]' title={value}>
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
    accessorKey: 'resultadoComiteGestaoAmbientalESocial.responsavel',
    header: 'Responsável Ações',
    cell: ({ row }) => {
      const responsavel =
        row.original.resultadoComiteGestaoAmbientalESocial?.responsavel;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[120px]' title={responsavel}>
                {responsavel || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{responsavel || 'Não informado'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'resultadoComiteGestaoAmbientalESocial.situacao',
    header: 'Situação',
    cell: ({ row }) => {
      const situacao =
        row.original.resultadoComiteGestaoAmbientalESocial?.situacao;
      if (!situacao) return <Badge variant='outline'>N/A</Badge>;

      const badgeVariant = getSituacaoBadgeVariant(situacao);
      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {situacao}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'resultadoComiteGestaoAmbientalESocial.prazo',
    header: 'Prazo',
    cell: ({ row }) => {
      const prazo = row.original.resultadoComiteGestaoAmbientalESocial?.prazo;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[100px] text-sm' title={prazo}>
                {prazo || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{prazo || 'Não informado'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
                {value.substring(0, 60) + (value.length > 60 ? '...' : '')}
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
    accessorKey: 'resultadoComiteGestaoAmbientalESocial.dataRevisaoEAprovacao',
    header: 'Data Revisão',
    cell: ({ row }) => {
      const date =
        row.original.resultadoComiteGestaoAmbientalESocial
          ?.dataRevisaoEAprovacao;
      if (!date) return <span className='text-muted-foreground'>N/A</span>;

      return (
        <div className='text-sm'>
          {format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className='text-sm text-muted-foreground'>
          {format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </div>
      );
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
