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

    const funcoes = await contextualPrisma.funcao.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(funcoes);
  } catch (error) {
    console.error('Error fetching funcoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funções' },
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

    const funcao = await contextualPrisma.funcao.create({
      data: {
        name,
        tenantId,
      },
    });

    return NextResponse.json(funcao, { status: 201 });
  } catch (error) {
    console.error('Error creating funcao:', error);
    return NextResponse.json(
      { error: 'Erro ao criar função' },
      { status: 500 }
    );
  }
}
