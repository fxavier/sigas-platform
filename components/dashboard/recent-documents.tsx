// components/dashboard/recent-documents.tsx
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Document {
  id: string;
  name: string;
  institution: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <Card className='animate-in fade-in duration-500'>
      <CardHeader>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <CardTitle>Documentos Recentes</CardTitle>
            <CardDescription>
              Últimos documentos adicionados ao sistema
            </CardDescription>
          </div>
          <Link href='/documents'>
            <Button variant='outline'>Ver todos os documentos</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {documents.map((document) => (
            <Card key={document.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                      <FileText className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <Badge variant='outline'>
                      {document.type.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className='font-medium mb-2 line-clamp-2'>
                    {document.name}
                  </h3>
                  <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between'>
                    <span>{formatDate(document.uploadDate, 'dd/MM/yyyy')}</span>
                    <span>{document.size}</span>
                  </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-800 px-6 py-3 text-sm border-t border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>
                      {document.institution.toUpperCase()}
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 px-2 text-blue-600 dark:text-blue-400'
                    >
                      Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
