// app/api/membros-equipa/route.ts
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

    const membrosEquipa = await contextualPrisma.membrosEquipa.findMany({
      where: { tenantId },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(membrosEquipa);
  } catch (error) {
    console.error('Error fetching membros equipa:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar membros da equipa' },
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

    if (!data.nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const newMembro = await createContextualPrismaClient({
      tenantId,
    }).membrosEquipa.create({
      data: {
        tenantId,
        nome: data.nome,
        cargo: data.cargo || '',
        departamento: data.departamento || '',
      },
    });

    return NextResponse.json(newMembro, { status: 201 });
  } catch (error) {
    console.error('Error creating membro equipa:', error);
    return NextResponse.json(
      { error: 'Erro ao criar membro da equipa' },
      { status: 500 }
    );
  }
}
