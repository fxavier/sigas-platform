// app/api/upload/ficha-registo-queixas/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadFileToS3 } from '@/lib/s3-service';
import { checkAwsConfig } from '@/lib/s3-service';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check AWS configuration
    const isAwsConfigured = checkAwsConfig();
    if (!isAwsConfigured) {
      return NextResponse.json(
        {
          error:
            'AWS S3 não está configurado. Os arquivos serão salvos localmente.',
          fallback: true,
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de arquivo não suportado' },
        { status: 400 }
      );
    }

    // Upload file to S3 using your existing service
    const fileUrl = await uploadFileToS3(file);

    // Return file information (database record will be created when form is submitted)
    return NextResponse.json(
      {
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        message: 'Arquivo enviado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file for ficha registo queixas:', error);

    // Handle specific S3 service errors
    if (error instanceof Error) {
      if (error.message.includes('AWS credentials')) {
        return NextResponse.json(
          {
            error:
              'Configuração AWS não encontrada. Verifique as variáveis de ambiente.',
            fallback: true,
          },
          { status: 500 }
        );
      } else if (error.message.includes('Failed to upload')) {
        return NextResponse.json(
          { error: 'Falha no upload para S3. Tente novamente.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
