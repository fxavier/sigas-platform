// components/forms/ficha-ambiental/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FichaAmbiental } from '@/hooks/use-ficha-ambiental';

interface CreateColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to translate activity type
const translateActivityType = (type: string) => {
  const translations: Record<string, string> = {
    TURISTICA: 'Turística',
    INDUSTRIAL: 'Industrial',
    AGRO_PECUARIA: 'Agro-Pecuária',
    ENERGETICA: 'Energética',
    SERVICOS: 'Serviços',
    OUTRA: 'Outra',
  };
  return translations[type] || type;
};

// Helper function to translate province
const translateProvince = (province: string) => {
  const translations: Record<string, string> = {
    MAPUTO: 'Maputo',
    MAPUTO_CIDADE: 'Maputo Cidade',
    GAZA: 'Gaza',
    INHAMBANE: 'Inhambane',
    SOFALA: 'Sofala',
    MANICA: 'Manica',
    TETE: 'Tete',
    ZAMBEZIA: 'Zambézia',
    NAMPULA: 'Nampula',
    CABO_DELGADO: 'Cabo Delgado',
    NIASSA: 'Niassa',
  };
  return translations[province] || province;
};

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: CreateColumnsProps): ColumnDef<FichaAmbiental>[] => [
  {
    accessorKey: 'nomeActividade',
    header: 'Nome da Actividade',
    cell: ({ row }) => {
      const value = row.getValue('nomeActividade') as string;
      return (
        <div className='font-medium truncate max-w-[200px]' title={value}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'tipoActividade',
    header: 'Tipo de Actividade',
    cell: ({ row }) => {
      const value = row.getValue('tipoActividade') as string;
      return (
        <Badge variant='outline' className='font-normal'>
          {translateActivityType(value)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'provinciaActividade',
    header: 'Província',
    cell: ({ row }) => {
      const value = row.getValue('provinciaActividade') as string;
      return translateProvince(value);
    },
  },
  {
    accessorKey: 'cidadeActividade',
    header: 'Cidade',
    cell: ({ row }) => {
      const value = row.getValue('cidadeActividade') as string;
      return value;
    },
  },
  {
    accessorKey: 'valorTotalInvestimento',
    header: 'Valor do Investimento',
    cell: ({ row }) => {
      const value = row.getValue('valorTotalInvestimento') as number | null;
      if (value === null) return 'N/A';

      // Format currency in MZN
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
      }).format(value);
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
      const ficha = row.original;

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
              <DropdownMenuItem onClick={() => onView(ficha.id)}>
                <FileText className='mr-2 h-4 w-4' />
                Visualizar
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onEdit(ficha.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(ficha.id)}
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
