// app/api/esms-documents/[documentType]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import {
  politicasSchema,
  manuaisSchema,
  procedimentosSchema,
  formulariosSchema,
  modelosSchema,
  DocumentType,
} from '@/lib/validations/esms-documents';
import { deleteFile } from '@/lib/s3-service';

const schemas = {
  politicas: politicasSchema,
  manuais: manuaisSchema,
  procedimentos: procedimentosSchema,
  formularios: formulariosSchema,
  modelos: modelosSchema,
};

const modelNames = {
  politicas: 'politicas',
  manuais: 'manuais',
  procedimentos: 'procedimentos',
  formularios: 'formularios',
  modelos: 'modelos',
} as const;

export async function GET(
  req: Request,
  { params }: { params: { documentType: DocumentType } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const documentType = await Promise.resolve(params.documentType);

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId é obrigatório' },
        { status: 400 }
      );
    }

    if (!modelNames[documentType]) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId,
      projectId,
    });

    const modelName = modelNames[documentType];
    const documents = await (contextualPrisma as any)[modelName].findMany({
      where: {
        tenantId,
        projectId,
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error(
      `Error fetching ${await Promise.resolve(params.documentType)}:`,
      error
    );
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { documentType: DocumentType } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const { documentType } = params;

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId é obrigatório' },
        { status: 400 }
      );
    }

    if (!schemas[documentType]) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = schemas[documentType].safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const modelName = modelNames[documentType];

    const contextualPrisma = createContextualPrismaClient({
      tenantId,
      projectId,
    });

    const newDocument = await (contextualPrisma as any)[modelName].create({
      data: {
        ...validatedData,
        tenantId,
        projectId,
      },
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error(`Error creating ${params.documentType}:`, error);
    return NextResponse.json(
      { error: 'Erro ao criar documento' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { documentType: DocumentType } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const { documentType } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!schemas[documentType]) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = schemas[documentType].safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const modelName = modelNames[documentType];

    const contextualPrisma = createContextualPrismaClient({
      tenantId,
    });

    // Check if document exists and belongs to tenant
    const existingDocument = await (contextualPrisma as any)[
      modelName
    ].findFirst({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // If file is being updated, delete the old one
    if (validatedData.ficheiro !== existingDocument.ficheiro) {
      try {
        await deleteFile(existingDocument.ficheiro);
      } catch (error) {
        console.warn('Failed to delete old file:', error);
        // Continue with update even if file deletion fails
      }
    }

    const updatedDocument = await (contextualPrisma as any)[modelName].update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error(`Error updating ${params.documentType}:`, error);
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { documentType: DocumentType } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const { documentType } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!modelNames[documentType]) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      );
    }

    const modelName = modelNames[documentType];
    const contextualPrisma = createContextualPrismaClient({
      tenantId,
    });

    // Get document to delete associated file
    const existingDocument = await (contextualPrisma as any)[
      modelName
    ].findFirst({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Delete the document from database
    await (db as any)[modelName].delete({
      where: { id },
    });

    // Delete associated file
    try {
      await deleteFile(existingDocument.ficheiro);
    } catch (error) {
      console.warn('Failed to delete file:', error);
      // Document is already deleted, so we continue
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ${params.documentType}:`, error);
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
}
