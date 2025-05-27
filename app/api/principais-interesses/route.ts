// app/api/principais-interesses/route.ts
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

    const principaisInteresses =
      await contextualPrisma.principaisInteresses.findMany({
        where: {
          tenantId,
        },
        orderBy: {
          nome: 'asc',
        },
      });

    return NextResponse.json(principaisInteresses);
  } catch (error) {
    console.error('Error fetching principais interesses:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar principais interesses' },
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
        { error: 'Nome do interesse é obrigatório' },
        { status: 400 }
      );
    }

    // Check if interesse already exists for this tenant
    const existingInteresse = await db.principaisInteresses.findFirst({
      where: {
        nome: data.nome.trim(),
        tenantId: tenantId,
      },
    });

    if (existingInteresse) {
      return NextResponse.json(
        { error: 'Interesse com este nome já existe' },
        { status: 400 }
      );
    }

    const principaisInteresses = await db.principaisInteresses.create({
      data: {
        nome: data.nome.trim(),
        tenantId: tenantId,
        projectId: data.projectId || null,
      },
    });

    return NextResponse.json(principaisInteresses, { status: 201 });
  } catch (error) {
    console.error('Error creating principais interesses:', error);
    return NextResponse.json(
      { error: 'Erro ao criar principais interesses' },
      { status: 500 }
    );
  }
}
