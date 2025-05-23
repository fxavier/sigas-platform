// components/forms/objetivos-metas/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ObjetivosMetas } from '@/hooks/use-objetivos-metas';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onView,
}: ColumnOptionsProps): ColumnDef<ObjetivosMetas>[] {
  return [
    {
      accessorKey: 'numeroRefOAndM',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nº Referência
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: 'aspetoRefNumero',
      header: 'Aspeto/Ref. Número',
    },
    {
      accessorKey: 'objectivo',
      header: 'Objetivo',
    },
    {
      accessorKey: 'dataInicio',
      header: 'Data Início',
      cell: ({ row }) => {
        const date = row.getValue('dataInicio');
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'dataConclusaoPrevista',
      header: 'Data Conclusão Prevista',
      cell: ({ row }) => {
        const date = row.getValue('dataConclusaoPrevista');
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'oAndMAlcancadoFechado',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('oAndMAlcancadoFechado') as string;
        return (
          <Badge variant={status === 'SIM' ? 'default' : 'outline'}>
            {status === 'SIM' ? 'Alcançado' : 'Em progresso'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className='flex items-center gap-2'>
            {onView && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onView(id)}
                className='h-8 w-8'
                title='Visualizar'
              >
                <Eye className='h-4 w-4' />
              </Button>
            )}
            {onEdit && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onEdit(id)}
                className='h-8 w-8'
                title='Editar'
              >
                <Edit className='h-4 w-4' />
              </Button>
            )}
            {onDelete && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onDelete(id)}
                className='h-8 w-8 text-destructive'
                title='Excluir'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
