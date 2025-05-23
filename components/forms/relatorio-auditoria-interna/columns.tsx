// components/forms/relatorio-auditoria-interna/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RelatorioAuditoriaInterna } from '@/hooks/use-relatorio-auditoria-interna';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onView,
}: ColumnOptionsProps): ColumnDef<RelatorioAuditoriaInterna>[] {
  return [
    {
      accessorKey: 'dataAuditoria',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data da Auditoria
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('dataAuditoria');
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'dataRelatorio',
      header: 'Data do Relatório',
      cell: ({ row }) => {
        const date = row.getValue('dataRelatorio');
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'ambitoAuditoria',
      header: 'Âmbito da Auditoria',
      cell: ({ row }) => {
        const ambito = row.getValue('ambitoAuditoria') as string;
        return (
          <div className='max-w-xs truncate' title={ambito}>
            {ambito}
          </div>
        );
      },
    },
    {
      accessorKey: 'auditorLider',
      header: 'Auditor Líder',
      cell: ({ row }) => {
        const auditor = row.getValue('auditorLider') as string;
        return (
          <Badge variant='outline' className='font-medium'>
            {auditor}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'auditorObservador',
      header: 'Auditor Observador',
      cell: ({ row }) => {
        const observador = row.getValue('auditorObservador') as string;
        return (
          <Badge variant='secondary' className='font-medium'>
            {observador}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'descricaoNaoConformidade',
      header: 'Não Conformidades',
      cell: ({ row }) => {
        const naoConformidades = row.original.descricaoNaoConformidade;
        if (!naoConformidades || naoConformidades.length === 0) {
          return (
            <Badge variant='default' className='bg-green-100 text-green-800'>
              Nenhuma
            </Badge>
          );
        }
        return (
          <div className='flex items-center gap-2'>
            <Badge variant='destructive' className='text-xs'>
              {naoConformidades.length} NC
            </Badge>
            {naoConformidades.length > 0 && (
              <span className='text-xs text-muted-foreground'>
                {naoConformidades[0].processo}
                {naoConformidades.length > 1 &&
                  ` +${naoConformidades.length - 1}`}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'resumoAuditoria',
      header: 'Resumo',
      cell: ({ row }) => {
        const resumo = row.getValue('resumoAuditoria') as string;
        return (
          <div className='max-w-sm truncate' title={resumo}>
            {resumo}
          </div>
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
