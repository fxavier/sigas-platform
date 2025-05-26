import { NextResponse } from 'next/server';
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

    const caixas = await contextualPrisma.caixaFerramentas.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(caixas);
  } catch (error) {
    console.error('Error fetching caixa ferramentas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar caixa de ferramentas' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, tenantId } = body;

    if (!name || !tenantId) {
      return NextResponse.json(
        { error: 'Nome e tenantId são obrigatórios' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const caixa = await contextualPrisma.caixaFerramentas.create({
      data: {
        name,
        tenantId,
      },
    });

    return NextResponse.json(caixa, { status: 201 });
  } catch (error) {
    console.error('Error creating caixa ferramentas:', error);
    return NextResponse.json(
      { error: 'Erro ao criar caixa de ferramentas' },
      { status: 500 }
    );
  }
}
