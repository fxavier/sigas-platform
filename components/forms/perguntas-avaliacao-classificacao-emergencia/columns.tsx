'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PerguntaAvaliacaoClassificacaoEmergencia } from '@/hooks/use-perguntas-avaliacao-classificacao-emergencia';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function createColumns({
  onEdit,
  onDelete,
}: CreateColumnsProps): ColumnDef<PerguntaAvaliacaoClassificacaoEmergencia>[] {
  return [
    {
      accessorKey: 'codigo',
      header: 'Código',
      cell: ({ row }) => {
        const codigo = row.getValue('codigo') as string;
        return <div className='font-medium text-sm'>{codigo}</div>;
      },
    },
    {
      accessorKey: 'pergunta',
      header: 'Pergunta',
      cell: ({ row }) => {
        const pergunta = row.getValue('pergunta') as string;
        const truncated =
          pergunta.length > 100 ? `${pergunta.substring(0, 100)}...` : pergunta;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='max-w-[300px] text-sm'>{truncated}</div>
              </TooltipTrigger>
              <TooltipContent className='max-w-[400px]'>
                <p className='whitespace-pre-wrap'>{pergunta}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const pergunta = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(pergunta.id)}
              >
                <Info className='mr-2 h-4 w-4' />
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(pergunta.id)}>
                <Pencil className='mr-2 h-4 w-4' />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(pergunta.id)}
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
}
