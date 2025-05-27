// components/forms/ficha-registo-queixas-reclamacoes/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FichaRegistoQueixasReclamacoes } from '@/hooks/use-ficha-registo-queixas-reclamacoes';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

// Helper function to get badge variant for different statuses
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SIM':
      return 'default';
    case 'NAO':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getGeneroLabel = (genero: string) => {
  switch (genero) {
    case 'MASCULINO':
      return 'Masculino';
    case 'FEMININO':
      return 'Feminino';
    default:
      return genero;
  }
};

const getMetodoNotificacaoLabel = (metodo: string | null) => {
  if (!metodo) return '-';
  switch (metodo) {
    case 'CARTA':
      return 'Carta';
    case 'EMAIL':
      return 'Email';
    case 'WHATSAPP':
      return 'WhatsApp';
    case 'OUTRO':
      return 'Outro';
    default:
      return metodo;
  }
};

export function createColumns({
  onEdit,
  onDelete,
  onView,
}: ColumnOptionsProps): ColumnDef<FichaRegistoQueixasReclamacoes>[] {
  return [
    {
      accessorKey: 'numeroQueixa',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Número da Queixa
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const numero = row.getValue('numeroQueixa') as string;
        return <div className='font-medium'>{numero}</div>;
      },
    },
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
        if (!date) return '';
        return format(new Date(date as string), 'dd/MM/yyyy', { locale: ptBR });
      },
    },
    {
      accessorKey: 'nomeCompletoReclamante',
      header: 'Reclamante',
      cell: ({ row }) => {
        const nome = row.getValue('nomeCompletoReclamante') as string | null;
        const genero = row.original.genero;
        const idade = row.original.idade;

        return (
          <div className='space-y-1'>
            <div className='font-medium'>{nome || 'Nome não informado'}</div>
            <div className='flex gap-2 text-sm text-muted-foreground'>
              <Badge variant='outline' className='text-xs'>
                {getGeneroLabel(genero)}
              </Badge>
              <Badge variant='outline' className='text-xs'>
                {idade} anos
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'breveDescricaoFactos',
      header: 'Descrição dos Factos',
      cell: ({ row }) => {
        const descricao = row.getValue('breveDescricaoFactos') as string;
        return (
          <div className='max-w-xs truncate' title={descricao}>
            {descricao}
          </div>
        );
      },
    },
    {
      accessorKey: 'categoriaQueixa',
      header: 'Categoria',
      cell: ({ row }) => {
        const categoria = row.original.categoriaQueixa;
        const subcategorias = row.original.subcategoriaQueixa;

        return (
          <div className='space-y-1'>
            {categoria && (
              <Badge variant='default' className='text-xs'>
                {categoria.nome}
              </Badge>
            )}
            {subcategorias && subcategorias.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {subcategorias.slice(0, 2).map((sub) => (
                  <Badge key={sub.id} variant='secondary' className='text-xs'>
                    {sub.nome}
                  </Badge>
                ))}
                {subcategorias.length > 2 && (
                  <Badge variant='outline' className='text-xs'>
                    +{subcategorias.length - 2}
                  </Badge>
                )}
              </div>
            )}
            {!categoria && (!subcategorias || subcategorias.length === 0) && (
              <span className='text-muted-foreground text-sm'>
                Não categorizada
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'queixaAceita',
      header: 'Status',
      cell: ({ row }) => {
        const aceita = row.getValue('queixaAceita') as string;
        return (
          <Badge variant={getStatusVariant(aceita)}>
            {aceita === 'SIM' ? 'Aceita' : 'Rejeitada'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'reclamanteNotificado',
      header: 'Notificação',
      cell: ({ row }) => {
        const notificado = row.original.reclamanteNotificado;
        const metodo = row.original.metodoNotificacao;

        if (!notificado) {
          return <span className='text-muted-foreground'>-</span>;
        }

        return (
          <div className='space-y-1'>
            <Badge variant={getStatusVariant(notificado)}>
              {notificado === 'SIM' ? 'Notificado' : 'Não Notificado'}
            </Badge>
            {notificado === 'SIM' && metodo && (
              <div className='text-xs text-muted-foreground'>
                via {getMetodoNotificacaoLabel(metodo)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'dataEncerramento',
      header: 'Encerramento',
      cell: ({ row }) => {
        const dataEncerramento = row.original.dataEncerramento;
        const reclamanteSatisfeito = row.original.reclamanteSatisfeito;

        return (
          <div className='space-y-1'>
            {dataEncerramento ? (
              <>
                <div className='text-sm'>
                  {format(new Date(dataEncerramento), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </div>
                {reclamanteSatisfeito && (
                  <Badge
                    variant={
                      reclamanteSatisfeito === 'SIM' ? 'default' : 'destructive'
                    }
                    className='text-xs'
                  >
                    {reclamanteSatisfeito === 'SIM'
                      ? 'Satisfeito'
                      : 'Insatisfeito'}
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant='outline' className='text-xs'>
                Em Aberto
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'resolucaoQueixa',
      header: 'Resoluções',
      cell: ({ row }) => {
        const resolucoes = row.original.resolucaoQueixa;

        if (!resolucoes || resolucoes.length === 0) {
          return <span className='text-muted-foreground text-sm'>Nenhuma</span>;
        }

        return (
          <div className='flex flex-wrap gap-1'>
            {resolucoes.slice(0, 2).map((resolucao) => (
              <Badge key={resolucao.id} variant='secondary' className='text-xs'>
                {resolucao.estado}
              </Badge>
            ))}
            {resolucoes.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{resolucoes.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'diasDesdeQueixaAoEncerramento',
      header: 'Tempo de Resolução',
      cell: ({ row }) => {
        const dias = row.original.diasDesdeQueixaAoEncerramento;

        if (!dias && dias !== 0) {
          return <span className='text-muted-foreground text-sm'>-</span>;
        }

        return (
          <Badge
            variant={
              dias <= 30 ? 'default' : dias <= 60 ? 'secondary' : 'destructive'
            }
            className='text-xs'
          >
            {dias} dias
          </Badge>
        );
      },
    },
    {
      accessorKey: 'monitoriaAposEncerramento',
      header: 'Monitoria',
      cell: ({ row }) => {
        const monitoria = row.original.monitoriaAposEncerramento;
        const estadoMonitoria = row.original.estadoMonitoriaAposEncerramento;

        if (!monitoria) {
          return <span className='text-muted-foreground text-sm'>-</span>;
        }

        return (
          <div className='space-y-1'>
            <Badge variant={getStatusVariant(monitoria)} className='text-xs'>
              {monitoria === 'SIM' ? 'Sim' : 'Não'}
            </Badge>
            {monitoria === 'SIM' && estadoMonitoria && (
              <div className='text-xs text-muted-foreground'>
                {estadoMonitoria}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'fotosDocumentosComprovativoEncerramento',
      header: 'Documentos',
      cell: ({ row }) => {
        const documentos = row.original.fotosDocumentosComprovativoEncerramento;

        if (!documentos || documentos.length === 0) {
          return <span className='text-muted-foreground text-sm'>Nenhum</span>;
        }

        return (
          <Badge variant='outline' className='text-xs'>
            {documentos.length} arquivo{documentos.length > 1 ? 's' : ''}
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
