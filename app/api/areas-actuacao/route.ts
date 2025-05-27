// app/api/areas-actuacao/route.ts
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

    const areasActuacao = await contextualPrisma.areaActuacao.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(areasActuacao);
  } catch (error) {
    console.error('Error fetching areas actuacao:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar áreas de actuação' },
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
        { error: 'Nome da área de actuação é obrigatório' },
        { status: 400 }
      );
    }

    // Check if area already exists for this tenant
    const existingArea = await db.areaActuacao.findFirst({
      where: {
        nome: data.nome.trim(),
        tenantId: tenantId,
      },
    });

    if (existingArea) {
      return NextResponse.json(
        { error: 'Área de actuação com este nome já existe' },
        { status: 400 }
      );
    }

    const areaActuacao = await db.areaActuacao.create({
      data: {
        nome: data.nome.trim(),
        tenantId: tenantId,
        projectId: data.projectId || null,
      },
    });

    return NextResponse.json(areaActuacao, { status: 201 });
  } catch (error) {
    console.error('Error creating area actuacao:', error);
    return NextResponse.json(
      { error: 'Erro ao criar área de actuação' },
      { status: 500 }
    );
  }
}
