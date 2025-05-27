// components/forms/matriz-stakeholder/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
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
import { MatrizStakeholder } from '@/hooks/use-matriz-stakeholder';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to translate alcance
const translateAlcance = (alcance: string) => {
  const translations: Record<string, string> = {
    LOCAL: 'Local',
    REGIONAL: 'Regional',
    NACIONAL: 'Nacional',
    INTERNACIONAL: 'Internacional',
  };
  return translations[alcance] || alcance;
};

// Helper function to translate percepcao/posicionamento
const translatePercepcao = (percepcao: string) => {
  const translations: Record<string, string> = {
    POSITIVO: 'Positivo',
    NEGATIVO: 'Negativo',
    NEUTRO: 'Neutro',
  };
  return translations[percepcao] || percepcao;
};

// Helper function to translate potencia impacto
const translatePotenciaImpacto = (potencia: string) => {
  const translations: Record<string, string> = {
    BAIXO: 'Baixo',
    MEDIO: 'Médio',
    ALTO: 'Alto',
  };
  return translations[potencia] || potencia;
};

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<MatrizStakeholder>[] => [
  {
    accessorKey: 'stakeholder',
    header: 'Stakeholder',
    cell: ({ row }) => {
      const value = row.getValue('stakeholder') as string;
      return (
        <div className='font-medium truncate max-w-[200px]' title={value}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'categoria.nome',
    header: 'Categoria',
    cell: ({ row }) => {
      const categoria = row.original.categoria;
      return (
        <Badge variant='outline' className='font-normal'>
          {categoria.nome}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'alcance',
    header: 'Alcance',
    cell: ({ row }) => {
      const value = row.getValue('alcance') as string;
      let badgeVariant: 'default' | 'secondary' | 'outline' = 'outline';

      if (value === 'INTERNACIONAL') {
        badgeVariant = 'default';
      } else if (value === 'NACIONAL') {
        badgeVariant = 'secondary';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {translateAlcance(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'areaActuacao.nome',
    header: 'Área de Actuação',
    cell: ({ row }) => {
      const area = row.original.areaActuacao;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[150px]'>{area.nome}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{area.nome}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'percepcaoOuPosicionamento',
    header: 'Posicionamento',
    cell: ({ row }) => {
      const value = row.getValue('percepcaoOuPosicionamento') as string;
      let badgeVariant: 'default' | 'destructive' | 'secondary' = 'secondary';

      if (value === 'POSITIVO') {
        badgeVariant = 'default';
      } else if (value === 'NEGATIVO') {
        badgeVariant = 'destructive';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {translatePercepcao(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'potenciaImpacto',
    header: 'Potência de Impacto',
    cell: ({ row }) => {
      const value = row.getValue('potenciaImpacto') as string;
      let badgeVariant: 'default' | 'destructive' | 'outline' = 'outline';

      if (value === 'ALTO') {
        badgeVariant = 'destructive';
      } else if (value === 'MEDIO') {
        badgeVariant = 'default';
      }

      return (
        <Badge variant={badgeVariant} className='font-normal'>
          {translatePotenciaImpacto(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'interlocutor_responsavel_por_relacionamento',
    header: 'Responsável',
    cell: ({ row }) => {
      const value = row.getValue(
        'interlocutor_responsavel_por_relacionamento'
      ) as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='truncate max-w-[120px]'>{value}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      const stakeholder = row.original;

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
              <DropdownMenuItem onClick={() => onView(stakeholder.id)}>
                <Eye className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onEdit(stakeholder.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(stakeholder.id)}
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
