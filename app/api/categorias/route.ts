// app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const categorias = await contextualPrisma.categorias.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (
      !data.nome ||
      typeof data.nome !== 'string' ||
      data.nome.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }

    // Check if categoria already exists for this tenant
    const existingCategoria = await db.categoria.findFirst({
      where: {
        nome: data.nome.trim(),
        tenantId: tenantId,
      },
    });

    if (existingCategoria) {
      return NextResponse.json(
        { error: 'Categoria com este nome já existe' },
        { status: 400 }
      );
    }

    const categoria = await db.categoria.create({
      data: {
        nome: data.nome.trim(),
        tenantId: tenantId,
        projectId: data.projectId || null,
      },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Error creating categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}
