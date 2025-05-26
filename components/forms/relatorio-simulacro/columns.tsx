// components/forms/relatorio-simulacro/columns.tsx
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
import { RelatorioSimulacro } from '@/hooks/use-relatorio-simulacro';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<RelatorioSimulacro>[] => [
  {
    accessorKey: 'local',
    header: 'Local',
    cell: ({ row }) => {
      const local = row.original.local;
      return (
        <div className='font-medium truncate max-w-[200px]' title={local}>
          {local}
        </div>
      );
    },
  },
  {
    accessorKey: 'tipoEmergenciaSimulada',
    header: 'Tipo de Emergência',
    cell: ({ row }) => {
      const tipo = row.original.tipoEmergenciaSimulada;
      const label =
        tipo === 'SAUDE_E_SEGURANCA' ? 'Saúde e Segurança' : 'Ambiental';

      let badgeVariant: 'default' | 'destructive' | 'outline' | 'secondary' =
        'default';

      if (tipo === 'SAUDE_E_SEGURANCA') {
        badgeVariant = 'destructive';
      } else if (tipo === 'AMBIENTAL') {
        badgeVariant = 'secondary';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal whitespace-nowrap'>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'objectoDoSimulacro',
    header: 'Objeto do Simulacro',
    cell: ({ row }) => {
      const objeto = row.original.objectoDoSimulacro;
      let label = '';

      switch (objeto) {
        case 'DISPOSITIVOS_DE_EMERGENCIA':
          label = 'Dispositivos de Emergência';
          break;
        case 'REACAO_DOS_COLABORADORES':
          label = 'Reação dos Colaboradores';
          break;
        case 'ACTUACAO_DA_EQUIPA_DE_EMERGENCIA':
          label = 'Atuação da Equipa de Emergência';
          break;
        default:
          label = objeto;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[180px]'>{label}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-sm'>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'assinaturaCoordenadorEmergencia',
    header: 'Coordenador',
    cell: ({ row }) => {
      const coordenador = row.original.assinaturaCoordenadorEmergencia;
      return (
        <div className='truncate max-w-[150px]' title={coordenador}>
          {coordenador}
        </div>
      );
    },
  },
  {
    accessorKey: 'dataCriacao',
    header: 'Data de Criação',
    cell: ({ row }) => {
      const date = row.original.dataCriacao;
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    },
  },
  {
    id: 'avaliacoes',
    header: 'Avaliações',
    cell: ({ row }) => {
      const avaliacoes =
        row.original.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia
          ?.length || 0;
      const recomendacoes =
        row.original.relatorioDeSimulacroOnRecomendacoes?.length || 0;

      return (
        <div className='flex gap-2'>
          <Badge variant='outline' className='text-xs'>
            {avaliacoes} Avaliações
          </Badge>
          <Badge variant='outline' className='text-xs'>
            {recomendacoes} Recomendações
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const relatorio = row.original;

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
              <DropdownMenuItem onClick={() => onView(relatorio.id)}>
                <FileText className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onEdit(relatorio.id)}>
              <Pencil className='mr-2 h-4 w-4' />
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
    },
  },
];
