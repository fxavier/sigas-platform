// components/forms/identificacao-avaliacao-riscos/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais } from '@/lib/types/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ActionsProps {
  onEdit: (
    item: IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais
  ) => void;
  onDelete: (id: string) => void;
}

// Helper function to format date
const formatDate = (date: Date | string) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

export const createColumns = ({
  onEdit,
  onDelete,
}: ActionsProps): ColumnDef<IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais>[] => [
  {
    accessorKey: 'numeroReferencia',
    header: 'Número de Referência',
  },
  {
    accessorKey: 'processo',
    header: 'Processo',
  },
  {
    accessorKey: 'actiactividade',
    header: 'Atividade',
  },
  {
    accessorKey: 'riscosImpactos.descricao',
    header: 'Risco/Impacto',
  },
  {
    accessorKey: 'prazo',
    header: 'Prazo',
    cell: ({ row }) => formatDate(row.original.prazo),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => onEdit(item)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => onDelete(item.id)}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      );
    },
  },
];
