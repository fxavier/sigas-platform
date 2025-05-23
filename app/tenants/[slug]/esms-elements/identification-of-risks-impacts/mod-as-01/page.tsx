// app/tenants/[slug]/esms-elements/identification-of-risks-impacts/mod-as-01/page.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Info, AlertTriangle, Eye } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useParams } from 'next/navigation';
import { useTenantProjectContext } from '@/lib/context/tenant-project-context';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentPreview } from '@/components/documents/document-preview';

export default function ModAs01Page() {
  const params = useParams();
  const { currentTenantId, currentProjectId } = useTenantProjectContext();
  const [isDownloading, setIsDownloading] = useState(false);

  // URL to the document file
  const documentUrl =
    'https://urban-trade.s3.us-east-1.amazonaws.com/documents/MOD.AS.01_INSTRUC%CC%A7A%CC%83O+DO+PROCESSO+AIA.doc';

  // Function to handle the document download
  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Log the download action
      if (currentTenantId && currentProjectId) {
        try {
          await fetch('/api/documents/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              documentCode: 'MOD.AS.01',
              documentName: 'Instrução do processo de AIA',
              tenantId: currentTenantId,
              projectId: currentProjectId,
            }),
          });
        } catch (logError) {
          console.error('Error logging download:', logError);
          // Continue with download even if logging fails
        }
      }

      // Create an anchor element and trigger a download
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = 'MOD.AS.01_INSTRUCAO_DO_PROCESSO_AIA.doc';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='space-y-4 p-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                MOD.AS.01 - Instrução do processo de AIA
              </CardTitle>
              <CardDescription>
                Documento com instruções para o processo de Avaliação de Impacto
                Ambiental (AIA)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!currentTenantId || !currentProjectId ? (
            <Alert variant='destructive' className='mb-4'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Projeto não selecionado</AlertTitle>
              <AlertDescription>
                É necessário selecionar um projeto para acessar este documento.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className='mb-6 bg-blue-50 border-blue-200'>
                <Info className='h-4 w-4 text-blue-600' />
                <AlertTitle className='text-blue-800'>
                  Informação sobre o documento
                </AlertTitle>
                <AlertDescription className='text-blue-700'>
                  Este documento contém as instruções detalhadas para condução
                  do processo de Avaliação de Impacto Ambiental (AIA), conforme
                  a legislação moçambicana e as melhores práticas
                  internacionais.
                </AlertDescription>
              </Alert>

              <div className='mt-6 space-y-6'>
                <div className='rounded-lg border p-6 bg-gray-50'>
                  <DocumentPreview
                    fileName='MOD.AS.01 - Instrução do processo de AIA'
                    fileType='Microsoft Word (.doc)'
                    fileSize='285 KB'
                  />
                  <div className='flex items-center justify-end mt-4'>
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className='gap-2'
                    >
                      <Download className='h-4 w-4' />
                      {isDownloading ? 'Baixando...' : 'Baixar documento'}
                    </Button>
                  </div>
                </div>

                <div className='rounded-lg border p-6'>
                  <h3 className='font-medium text-lg mb-4'>
                    Conteúdo do documento
                  </h3>
                  <div className='space-y-3'>
                    <p className='text-sm'>Este documento inclui:</p>
                    <ul className='list-disc list-inside space-y-1 text-sm pl-4'>
                      <li>Definição e objetivos do processo de AIA</li>
                      <li>
                        Etapas do processo de AIA conforme legislação aplicável
                      </li>
                      <li>Documentação necessária para o processo</li>
                      <li>
                        Instruções para preenchimento de formulários
                        relacionados
                      </li>
                      <li>Procedimentos de consulta pública</li>
                      <li>Medidas de mitigação e compensação</li>
                      <li>Modelos de relatórios e documentos complementares</li>
                    </ul>
                  </div>
                </div>

                <div className='rounded-lg border p-6 bg-amber-50'>
                  <div className='flex items-start'>
                    <AlertTriangle className='h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0' />
                    <div>
                      <h3 className='font-medium text-amber-800 mb-2'>
                        Importante
                      </h3>
                      <p className='text-sm text-amber-700'>
                        Este documento deve ser utilizado em conjunto com a
                        legislação ambiental vigente. Certifique-se de verificar
                        se há atualizações na legislação que possam afetar o
                        processo descrito neste documento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
