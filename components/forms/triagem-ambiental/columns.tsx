// components/forms/triagem-ambiental/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash2, FileText } from 'lucide-react';
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
import { TriagemAmbiental } from '@/hooks/use-triagem-ambiental';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<TriagemAmbiental>[] => [
  {
    accessorKey: 'subprojecto.nome',
    header: 'Subprojeto',
    cell: ({ row }) => {
      const subprojeto = row.original.subprojecto;
      return (
        <div
          className='font-medium truncate max-w-[200px]'
          title={subprojeto.nome}
        >
          {subprojeto.nome}
        </div>
      );
    },
  },
  {
    accessorKey: 'responsavelPeloPreenchimento.nome',
    header: 'Responsável pelo Preenchimento',
    cell: ({ row }) => {
      const responsavel = row.original.responsavelPeloPreenchimento;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[180px]'>{responsavel.nome}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-sm font-medium'>{responsavel.nome}</p>
              <p className='text-xs'>{responsavel.funcao}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'resultadoTriagem.categoriaRisco',
    header: 'Categoria de Risco',
    cell: ({ row }) => {
      const value = row.original.resultadoTriagem.categoriaRisco;

      let badgeVariant: 'default' | 'destructive' | 'outline' | 'secondary' =
        'default';

      if (value.includes('Alto') || value.includes('A')) {
        badgeVariant = 'destructive';
      } else if (value.includes('Médio') || value.includes('B')) {
        badgeVariant = 'secondary';
      } else if (value.includes('Baixo') || value.includes('C')) {
        badgeVariant = 'outline';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal whitespace-nowrap'>
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const triagem = row.original;

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
              <DropdownMenuItem onClick={() => onView(triagem.id)}>
                <FileText className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onEdit(triagem.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(triagem.id)}
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
