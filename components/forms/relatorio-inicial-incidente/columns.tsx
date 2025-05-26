'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { RelatorioInicialIncidente } from '@/hooks/use-relatorio-inicial-incidente';

interface ColumnActionsProps {
  relatorio: RelatorioInicialIncidente;
  onEdit: (relatorio: RelatorioInicialIncidente) => void;
  onDelete: (id: string) => void;
}

function ColumnActions({ relatorio, onEdit, onDelete }: ColumnActionsProps) {
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(relatorio)}>
          <Edit className='mr-2 h-4 w-4' />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(relatorio.id)}
          className='text-red-600'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const createRelatorioInicialIncidenteColumns = (
  onEdit: (relatorio: RelatorioInicialIncidente) => void,
  onDelete: (id: string) => void
): ColumnDef<RelatorioInicialIncidente>[] => [
  {
    accessorKey: 'dataIncidente',
    header: 'Data do Incidente',
    cell: ({ row }) => {
      const date = row.getValue('dataIncidente') as Date;
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    accessorKey: 'tipoIncidente',
    header: 'Tipo de Incidente',
    cell: ({ row }) => {
      const tipo = row.getValue('tipoIncidente') as string;
      const tipoLabels: Record<string, string> = {
        FATALIDADE: 'Fatalidade',
        OCORRENCIA_PERIGOSA: 'Ocorrência Perigosa',
        INCIDENTE_QUASE_ACIDENTE: 'Incidente/Quase Acidente',
        TEMPO_PERDIDO: 'Tempo Perdido',
        INCIDENTE_AMBIENTAL: 'Incidente Ambiental',
        SEGURANCA: 'Segurança',
        RECLAMACAO_EXTERNA: 'Reclamação Externa',
        NOTIFICACAO_DO_REGULADOR_VIOLACAO: 'Notificação do Regulador/Violação',
        DERAMAMENTO_LBERACAO_DESCONTROLADA:
          'Derramamento/Liberação Descontrolada',
        DANOS_PERDAS: 'Danos/Perdas',
        FLORA_FAUNA: 'Flora/Fauna',
        AUDITORIA_NAO_CONFORMIDADE: 'Auditoria/Não Conformidade',
      };

      return <Badge variant='outline'>{tipoLabels[tipo] || tipo}</Badge>;
    },
  },
  {
    accessorKey: 'localIncidente',
    header: 'Local',
    cell: ({ row }) => {
      const local = row.getValue('localIncidente') as string;
      return (
        <div className='max-w-[200px] truncate' title={local}>
          {local}
        </div>
      );
    },
  },
  {
    accessorKey: 'supervisor',
    header: 'Supervisor',
  },
  {
    accessorKey: 'incidenteReportavel',
    header: 'Reportável',
    cell: ({ row }) => {
      const reportavel = row.getValue('incidenteReportavel') as string;
      return (
        <Badge variant={reportavel === 'SIM' ? 'destructive' : 'secondary'}>
          {reportavel === 'SIM' ? 'Sim' : 'Não'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'necessitaDeInvestigacaoAprofundada',
    header: 'Investigação',
    cell: ({ row }) => {
      const investigacao = row.getValue(
        'necessitaDeInvestigacaoAprofundada'
      ) as string;
      return (
        <Badge variant={investigacao === 'SIM' ? 'default' : 'secondary'}>
          {investigacao === 'SIM' ? 'Necessária' : 'Não Necessária'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'nomeProvedor',
    header: 'Provedor',
  },
  {
    accessorKey: 'dataCriacao',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = row.getValue('dataCriacao') as Date;
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ColumnActions
        relatorio={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];

// Export a default columns array for convenience
export const relatorioInicialIncidenteColumns =
  createRelatorioInicialIncidenteColumns(
    () => {},
    () => {}
  );
