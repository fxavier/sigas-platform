// components/forms/esms-documents/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ESMSDocumentResponse } from '@/hooks/use-esms-documents';
import { estadoDocumentoLabels } from '@/lib/validations/esms-documents';

interface ColumnOptionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (fileUrl: string, fileName: string) => void;
}

export function createESMSDocumentColumns({
  onEdit,
  onDelete,
  onView,
  onDownload,
}: ColumnOptionsProps): ColumnDef<ESMSDocumentResponse>[] {
  return [
    {
      accessorKey: 'codigo',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Código
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: 'nomeDocumento',
      header: 'Nome do Documento',
      cell: ({ row }) => {
        const name = row.getValue('nomeDocumento') as string;
        return (
          <div className='max-w-[300px] truncate' title={name}>
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: 'estadoDocumento',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue(
          'estadoDocumento'
        ) as keyof typeof estadoDocumentoLabels;
        const label = estadoDocumentoLabels[estado];

        const variantMap = {
          REVISAO: 'outline' as const,
          EM_USO: 'default' as const,
          ABSOLETO: 'destructive' as const,
        };

        return <Badge variant={variantMap[estado] || 'outline'}>{label}</Badge>;
      },
    },
    {
      accessorKey: 'dataCriacao',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data Criação
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue('dataCriacao');
        if (!date) return '';
        try {
          const dateObj = new Date(date as string);
          if (isNaN(dateObj.getTime())) return '-';
          return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      },
    },
    {
      accessorKey: 'dataRevisao',
      header: 'Data Revisão',
      cell: ({ row }) => {
        const date = row.getValue('dataRevisao');
        if (!date) return '-';
        try {
          const dateObj = new Date(date as string);
          if (isNaN(dateObj.getTime())) return '-';
          return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      },
    },
    {
      accessorKey: 'periodoRetencao',
      header: 'Período Retenção',
      cell: ({ row }) => {
        const date = row.getValue('periodoRetencao');
        if (!date) return '-';
        try {
          const dateObj = new Date(date as string);
          if (isNaN(dateObj.getTime())) return '-';
          return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const document = row.original;
        const fileName = document.nomeDocumento || 'documento';

        return (
          <div className='flex items-center gap-2'>
            {onDownload && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onDownload(document.ficheiro, fileName)}
                className='h-8 w-8'
                title='Download'
              >
                <Download className='h-4 w-4' />
              </Button>
            )}
            {onView && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => onView(document.id)}
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
                onClick={() => onEdit(document.id)}
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
                onClick={() => onDelete(document.id)}
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
