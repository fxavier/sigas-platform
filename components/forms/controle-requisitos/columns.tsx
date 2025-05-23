'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type ControleRequisitos = {
  id: string;
  numnumero: string;
  tituloDocumento: string;
  descricao: Date;
  revocacoesAlteracoes?: string | null;
  requisitoConformidade?: string | null;
  dataControle: Date;
  observation?: string | null;
  ficheiroDaLei?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  projectId: string;
};

interface CreateColumnsProps {
  onEdit: (item: ControleRequisitos) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<ControleRequisitos>[] => [
  {
    accessorKey: 'numnumero',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-semibold'
        >
          Número
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className='font-medium'>{row.getValue('numnumero')}</div>;
    },
  },
  {
    accessorKey: 'tituloDocumento',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='font-semibold'
        >
          Título do Documento
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className='max-w-[300px] truncate'
          title={row.getValue('tituloDocumento')}
        >
          {row.getValue('tituloDocumento')}
        </div>
      );
    },
  },
  {
    accessorKey: 'descricao',
    header: 'Data de Publicação',
    cell: ({ row }) => {
      const date =
        row.getValue('descricao') instanceof Date
          ? (row.getValue('descricao') as Date)
          : new Date(row.getValue('descricao') as string);

      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    accessorKey: 'dataControle',
    header: 'Data de Controle',
    cell: ({ row }) => {
      const date =
        row.getValue('dataControle') instanceof Date
          ? (row.getValue('dataControle') as Date)
          : new Date(row.getValue('dataControle') as string);

      // Calculate if the control date is past
      const today = new Date();
      const controlDate = new Date(date);
      const isPast = controlDate < today;

      return (
        <div className='flex items-center gap-2'>
          <span>{format(date, 'dd/MM/yyyy', { locale: ptBR })}</span>
          {isPast && (
            <Badge variant='destructive' className='text-xs py-0 px-1.5'>
              Vencido
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'ficheiroDaLei',
    header: 'Arquivo',
    cell: ({ row }) => {
      const fileUrl = row.getValue('ficheiroDaLei') as string | null;

      if (!fileUrl) return <span className='text-gray-400'>N/A</span>;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800'
              >
                <FileText className='h-4 w-4' />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar arquivo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;

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

            {item.ficheiroDaLei && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.ficheiroDaLei) {
                      window.open(item.ficheiroDaLei, '_blank');
                    }
                  }}
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Ver Arquivo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className='text-red-600'
            >
              <Trash className='mr-2 h-4 w-4' />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
