// components/forms/relatorio-incidente/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RelatorioIncidente } from '@/hooks/use-relatorio-incidente';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to get badge variant for different statuses
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SAUDE':
      return 'destructive';
    case 'SEGURANCA':
      return 'default';
    case 'AMBIENTE':
      return 'secondary';
    case 'COMUNIDADE':
      return 'outline';
    default:
      return 'outline';
  }
};

const getTipoFuncionarioLabel = (tipo: string) => {
  switch (tipo) {
    case 'CONTRATADO':
      return 'Contratado';
    case 'INCIDENTE_DE_TERCEIROS':
      return 'Terceiros';
    default:
      return tipo;
  }
};

const getFormaAtividadeLabel = (forma: string) => {
  switch (forma) {
    case 'CONTROLADA':
      return 'Controlada';
    case 'NAO_CONTROLADA':
      return 'Não Controlada';
    case 'MONITORADA':
      return 'Monitorada';
    default:
      return forma;
  }
};

const getEfeitoLabel = (efeito: string) => {
  switch (efeito) {
    case 'SAUDE':
      return 'Saúde';
    case 'SEGURANCA':
      return 'Segurança';
    case 'AMBIENTE':
      return 'Ambiente';
    case 'COMUNIDADE':
      return 'Comunidade';
    default:
      return efeito;
  }
};

export function createColumns({
  onEdit,
  onDelete,
  onView,
}: ColumnOptionsProps): ColumnDef<RelatorioIncidente>[] {
  return [
    {
      accessorKey: 'dataIncidente',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data do Incidente
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('dataIncidente');
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'horaIncident',
      header: 'Hora',
      cell: ({ row }) => {
        const hora = row.getValue('horaIncident');
        if (!hora) return '';
        return format(new Date(hora as string), 'HH:mm', { locale: ptBR });
      },
    },
    {
      accessorKey: 'descricaoDoIncidente',
      header: 'Descrição do Incidente',
      cell: ({ row }) => {
        const descricao = row.getValue('descricaoDoIncidente') as string;
        return (
          <div className='max-w-xs truncate' title={descricao}>
            {descricao}
          </div>
        );
      },
    },
    {
      accessorKey: 'tipoFuncionario',
      header: 'Tipo de Funcionário',
      cell: ({ row }) => {
        const tipo = row.getValue('tipoFuncionario') as string;
        return <Badge variant='outline'>{getTipoFuncionarioLabel(tipo)}</Badge>;
      },
    },
    {
      accessorKey: 'formaActividade',
      header: 'Forma de Atividade',
      cell: ({ row }) => {
        const forma = row.getValue('formaActividade') as string;
        return (
          <Badge variant='secondary'>{getFormaAtividadeLabel(forma)}</Badge>
        );
      },
    },
    {
      accessorKey: 'efeitosIncidenteReal',
      header: 'Efeitos',
      cell: ({ row }) => {
        const efeito = row.getValue('efeitosIncidenteReal') as string;
        return (
          <Badge variant={getStatusVariant(efeito)}>
            {getEfeitoLabel(efeito)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'danosMateriais',
      header: 'Danos Materiais',
      cell: ({ row }) => {
        const danos = row.getValue('danosMateriais') as string;
        const valorDanos = row.original.valorDanos;
        return (
          <div className='flex flex-col'>
            <Badge variant={danos === 'SIM' ? 'destructive' : 'default'}>
              {danos === 'SIM' ? 'Sim' : 'Não'}
            </Badge>
            {danos === 'SIM' && valorDanos && (
              <span className='text-xs text-muted-foreground mt-1'>
                {valorDanos.toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'statusInvestigacao',
      header: 'Status da Investigação',
      cell: ({ row }) => {
        const status = row.getValue('statusInvestigacao') as string;
        if (!status) return <span className='text-muted-foreground'>-</span>;
        return <Badge variant='outline'>{status}</Badge>;
      },
    },
    {
      accessorKey: 'equipaInvestigacaoIncidente',
      header: 'Equipa de Investigação',
      cell: ({ row }) => {
        const equipa = row.original.equipaInvestigacaoIncidente;
        if (!equipa || equipa.length === 0) {
          return <span className='text-muted-foreground'>Nenhuma</span>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {equipa.slice(0, 2).map((pessoa) => (
              <Badge key={pessoa.id} variant='secondary' className='text-xs'>
                {pessoa.nome}
              </Badge>
            ))}
            {equipa.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{equipa.length - 2}
              </Badge>
            )}
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
