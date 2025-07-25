import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} from '@/lib/aws-config';

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY!,
    secretAccessKey: AWS_SECRET_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Check if AWS credentials are available
    if (!AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
      console.error('Missing AWS environment variables:', {
        bucket: !!AWS_S3_BUCKET,
        accessKey: !!AWS_ACCESS_KEY,
        secretKey: !!AWS_SECRET_KEY,
      });
      return NextResponse.json(
        {
          error:
            'AWS S3 não está configurado. Verifique as variáveis de ambiente.',
          fallback: true,
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileName = file.name;
    const fileExt = fileName.split('.').pop() || '';

    // Generate a unique file name
    const sanitizedName = fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    const key = `uploads/${uuidv4().substring(0, 8)}-${sanitizedName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Return the URL
    const fileUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('S3 upload error:', error);

    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('NoSuchBucket')) {
        return NextResponse.json(
          { error: 'Bucket S3 não encontrado. Verifique a configuração.' },
          { status: 500 }
        );
      }
      if (error.message.includes('InvalidAccessKeyId')) {
        return NextResponse.json(
          { error: 'Credenciais AWS inválidas. Verifique ACCESS_KEY_ID.' },
          { status: 500 }
        );
      }
      if (error.message.includes('SignatureDoesNotMatch')) {
        return NextResponse.json(
          { error: 'Credenciais AWS inválidas. Verifique SECRET_ACCESS_KEY.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: 'Erro ao fazer upload do arquivo',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erro desconhecido ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
