// app/api/categorias-queixas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const categoriaQueixaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome da categoria é obrigatório' }),
});

export async function GET(req: Request) {
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

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const categorias = await contextualPrisma.categorias.findMany({
      where: {
        tenantId,
        projectId,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias queixas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias de queixas' },
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
    const validationResult = categoriaQueixaSchema.safeParse(data);

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

    // Check if categoria already exists
    const existingCategoria = await db.categoriaQueixa.findFirst({
      where: {
        nome: validatedData.nome,
        tenantId,
        projectId,
      },
    });

    if (existingCategoria) {
      return NextResponse.json(
        { error: 'Categoria com este nome já existe' },
        { status: 409 }
      );
    }

    const novaCategoria = await db.categoriaQueixa.create({
      data: {
        tenantId,
        projectId,
        nome: validatedData.nome,
      },
    });

    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error) {
    console.error('Error creating categoria queixa:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria de queixa' },
      { status: 500 }
    );
  }
}
