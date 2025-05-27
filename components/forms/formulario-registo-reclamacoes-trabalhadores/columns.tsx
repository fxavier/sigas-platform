// components/forms/formulario-registo-reclamacoes-trabalhadores/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FormularioRegistoReclamacoesTrabalhadoresData } from '@/hooks/use-formulario-registo-reclamacoes-trabalhadores';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to get badge variant for different statuses
const getContactMethodLabel = (method: string) => {
  switch (method) {
    case 'TELEFONE':
      return 'Telefone';
    case 'EMAIL':
      return 'Email';
    case 'PRESENCIAL':
      return 'Presencial';
    default:
      return method;
  }
};

const getLanguageLabel = (language: string) => {
  switch (language) {
    case 'PORTUGUES':
      return 'Português';
    case 'INGLES':
      return 'Inglês';
    case 'OUTRO':
      return 'Outro';
    default:
      return language;
  }
};

const getStatusVariant = (hasDate: boolean) => {
  return hasDate ? 'default' : 'destructive';
};

const getConfirmationVariant = (status: string | null) => {
  switch (status) {
    case 'SIM':
      return 'default';
    case 'NAO':
      return 'destructive';
    default:
      return 'outline';
  }
};

export function createColumns({
  onEdit,
  onDelete,
  onView,
}: ColumnOptionsProps): ColumnDef<FormularioRegistoReclamacoesTrabalhadoresData>[] {
  return [
    {
      accessorKey: 'dataReclamacao',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data da Reclamação
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('dataReclamacao');
        const hora = row.original.horaReclamacao;
        if (!date) return '';
        return (
          <div className='space-y-1'>
            <div className='font-medium'>
              {format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR })}
            </div>
            <div className='text-xs text-muted-foreground'>{hora}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'nome',
      header: 'Trabalhador',
      cell: ({ row }) => {
        const nome = row.getValue('nome') as string | null;
        const empresa = row.original.empresa;

        return (
          <div className='space-y-1'>
            <div className='font-medium'>{nome || 'Anônimo'}</div>
            <div className='text-sm text-muted-foreground'>{empresa}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'detalhesDareclamacao',
      header: 'Detalhes da Reclamação',
      cell: ({ row }) => {
        const detalhes = row.getValue('detalhesDareclamacao') as string;
        return (
          <div className='max-w-xs truncate' title={detalhes}>
            {detalhes}
          </div>
        );
      },
    },
    {
      accessorKey: 'metodoPreferidoDoContacto',
      header: 'Método de Contacto',
      cell: ({ row }) => {
        const metodo = row.getValue('metodoPreferidoDoContacto') as string;
        const detalhes = row.original.detalhesDoContacto;

        return (
          <div className='space-y-1'>
            <Badge variant='outline'>{getContactMethodLabel(metodo)}</Badge>
            <div
              className='text-xs text-muted-foreground truncate max-w-32'
              title={detalhes}
            >
              {detalhes}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'linguaPreferida',
      header: 'Língua',
      cell: ({ row }) => {
        const lingua = row.getValue('linguaPreferida') as string;
        const outraLingua = row.original.outraLinguaPreferida;

        return (
          <div className='space-y-1'>
            <Badge variant='secondary'>{getLanguageLabel(lingua)}</Badge>
            {outraLingua && lingua === 'OUTRO' && (
              <div className='text-xs text-muted-foreground'>{outraLingua}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'numeroIdentificacaoResponsavelRecepcao',
      header: 'Responsável Recepção',
      cell: ({ row }) => {
        const numeroId = row.getValue(
          'numeroIdentificacaoResponsavelRecepcao'
        ) as string;
        const nome = row.original.nomeResponsavelRecepcao;
        const funcao = row.original.funcaoResponsavelRecepcao;

        return (
          <div className='space-y-1'>
            <div className='font-medium text-sm'>ID: {numeroId}</div>
            {nome && (
              <div className='text-xs text-muted-foreground'>{nome}</div>
            )}
            {funcao && (
              <div className='text-xs text-muted-foreground'>{funcao}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'dataEncerramento',
      header: 'Status',
      cell: ({ row }) => {
        const dataEncerramento = row.getValue(
          'dataEncerramento'
        ) as Date | null;
        const confirmacao = row.original.confirmarRecepcaoResposta;

        return (
          <div className='space-y-1'>
            <Badge variant={getStatusVariant(!!dataEncerramento)}>
              {dataEncerramento ? 'Encerrada' : 'Em Aberto'}
            </Badge>
            {dataEncerramento && (
              <div className='text-xs text-muted-foreground'>
                {format(new Date(dataEncerramento), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </div>
            )}
            {confirmacao && (
              <Badge
                variant={getConfirmationVariant(confirmacao)}
                className='text-xs'
              >
                Confirmação: {confirmacao === 'SIM' ? 'Sim' : 'Não'}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'detalhesAcompanhamento',
      header: 'Acompanhamento',
      cell: ({ row }) => {
        const detalhes = row.getValue('detalhesAcompanhamento') as
          | string
          | null;

        if (!detalhes) {
          return (
            <Badge variant='outline' className='text-xs'>
              Sem acompanhamento
            </Badge>
          );
        }

        return (
          <div className='max-w-xs truncate text-sm' title={detalhes}>
            {detalhes}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const item = row.original;

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
              {onView && (
                <DropdownMenuItem onClick={() => onView(item.id)}>
                  <Eye className='mr-2 h-4 w-4' />
                  Visualizar
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item.id)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(item.id)}
                  className='text-red-600'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
