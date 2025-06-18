// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3-service';
import {
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
} from '@/lib/aws-config';

export async function POST(request: NextRequest) {
  try {
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

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Check if AWS is configured
    const isAwsConfigured = AWS_S3_BUCKET && AWS_ACCESS_KEY && AWS_SECRET_KEY;

    let fileUrl: string;
    let uploadMethod: string;

    if (isAwsConfigured) {
      try {
        // Try S3 upload first
        fileUrl = await uploadFileToS3(file);
        uploadMethod = 'S3';
        console.log('File uploaded successfully to S3:', fileUrl);
      } catch (s3Error) {
        console.warn(
          'S3 upload failed, falling back to local storage:',
          s3Error
        );
        // Fallback to local storage
        fileUrl = await uploadToLocal(file);
        uploadMethod = 'Local (S3 fallback)';
      }
    } else {
      // Use local storage directly
      console.log('AWS not configured, using local storage');
      fileUrl = await uploadToLocal(file);
      uploadMethod = 'Local';
    }

    console.log(`File uploaded successfully via ${uploadMethod}:`, fileUrl);

    return NextResponse.json({
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadMethod,
    });
  } catch (error) {
    console.error('Upload error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Helper function to upload to local storage
async function uploadToLocal(file: File): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');
  const { v4: uuidv4 } = await import('uuid');

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
  }

  // Get file extension
  const fileName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .substring(0, 50); // Limit length

  const uniqueFileName = `${uuidv4().substring(0, 8)}-${fileName}`;

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads');

  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }

  // Convert file to buffer and write to filesystem
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = join(uploadsDir, uniqueFileName);
  await writeFile(filePath, buffer);

  // Return the public URL
  const fileUrl = `/uploads/${uniqueFileName}`;
  console.log('File uploaded locally:', fileUrl);

  return fileUrl;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
