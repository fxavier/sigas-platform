// app/api/subcategorias-queixas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const subcategoriaQueixaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome da subcategoria é obrigatório' }),
  categoriaQueixaId: z.string().min(1, { message: 'Categoria é obrigatória' }),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const categoriaId = searchParams.get('categoriaId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const whereClause: any = {
      tenantId,
      projectId,
    };

    // Filter by categoria if provided
    if (categoriaId) {
      whereClause.categoriaQueixaId = categoriaId;
    }

    const subcategorias = await db.subcategoriaQueixa.findMany({
      where: whereClause,
      include: {
        categoriaQueixa: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(subcategorias);
  } catch (error) {
    console.error('Error fetching subcategorias queixas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar subcategorias de queixas' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = subcategoriaQueixaSchema.safeParse(data);

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

    // Check if subcategoria already exists
    const existingSubcategoria = await db.subcategoriaQueixa.findFirst({
      where: {
        nome: validatedData.nome,
        categoriaQueixaId: validatedData.categoriaQueixaId,
        tenantId,
        projectId,
      },
    });

    if (existingSubcategoria) {
      return NextResponse.json(
        { error: 'Subcategoria com este nome já existe nesta categoria' },
        { status: 409 }
      );
    }

    const novaSubcategoria = await db.subcategoriaQueixa.create({
      data: {
        tenantId,
        projectId,
        nome: validatedData.nome,
        categoriaQueixaId: validatedData.categoriaQueixaId,
      },
      include: {
        categoriaQueixa: true,
      },
    });

    return NextResponse.json(novaSubcategoria, { status: 201 });
  } catch (error) {
    console.error('Error creating subcategoria queixa:', error);
    return NextResponse.json(
      { error: 'Erro ao criar subcategoria de queixa' },
      { status: 500 }
    );
  }
}
