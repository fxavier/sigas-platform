'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MatrizTreinamentoResponse } from '@/hooks/use-matriz-treinamento';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Helper function to get badge variant for eficacia
const getEficaciaVariant = (eficacia: string) => {
  switch (eficacia) {
    case 'Eficaz':
      return 'default';
    case 'Nao_Eficaz':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getEficaciaLabel = (eficacia: string) => {
  switch (eficacia) {
    case 'Eficaz':
      return 'Eficaz';
    case 'Nao_Eficaz':
      return 'Não Eficaz';
    default:
      return eficacia;
  }
};

export function createColumns({
  onEdit,
  onDelete,
}: ColumnOptionsProps): ColumnDef<MatrizTreinamentoResponse>[] {
  return [
    {
      accessorKey: 'data',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('data');
        if (!date) return '-';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'funcao',
      header: 'Função',
      cell: ({ row }) => {
        const funcao = row.original.funcao;
        return funcao?.name || '-';
      },
    },
    {
      accessorKey: 'areaTreinamento',
      header: 'Área de Treinamento',
      cell: ({ row }) => {
        const area = row.original.areaTreinamento;
        return (
          <div className='max-w-xs truncate' title={area?.name}>
            {area?.name || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'caixaFerramentas',
      header: 'Caixa de Ferramentas',
      cell: ({ row }) => {
        const caixa = row.original.caixaFerramentas;
        return (
          <div className='max-w-xs truncate' title={caixa?.name}>
            {caixa?.name || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'totais_palestras',
      header: 'Palestras',
      cell: ({ row }) => {
        const palestras = row.getValue('totais_palestras') as number;
        return <Badge variant='secondary'>{palestras}</Badge>;
      },
    },
    {
      accessorKey: 'total_horas',
      header: 'Horas',
      cell: ({ row }) => {
        const horas = row.getValue('total_horas') as number;
        return <Badge variant='secondary'>{horas}h</Badge>;
      },
    },
    {
      accessorKey: 'total_caixa_ferramentas',
      header: 'Total Ferramentas',
      cell: ({ row }) => {
        const total = row.getValue('total_caixa_ferramentas') as number;
        return <Badge variant='outline'>{total}</Badge>;
      },
    },
    {
      accessorKey: 'total_pessoas_informadas_caixa_ferramentas',
      header: 'Pessoas Informadas',
      cell: ({ row }) => {
        const pessoas = row.getValue(
          'total_pessoas_informadas_caixa_ferramentas'
        ) as number;
        return <Badge variant='outline'>{pessoas}</Badge>;
      },
    },
    {
      accessorKey: 'eficacia',
      header: 'Eficácia',
      cell: ({ row }) => {
        const eficacia = row.getValue('eficacia') as string;
        return (
          <Badge variant={getEficaciaVariant(eficacia)}>
            {getEficaciaLabel(eficacia)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'aprovado_por',
      header: 'Aprovado Por',
      cell: ({ row }) => {
        const aprovado = row.getValue('aprovado_por') as string;
        return (
          <div className='max-w-xs truncate' title={aprovado}>
            {aprovado}
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
