// app/api/perguntas-avaliacao/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
      projectId: projectId || undefined,
    });

    const whereClause: any = {
      tenantId,
    };

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const perguntas =
      await db.perguntaAvaliacaoClassificacaoEmergencia.findMany({
        where: whereClause,
        orderBy: {
          codigo: 'asc',
        },
      });

    return NextResponse.json(perguntas);
  } catch (error) {
    console.error('Error fetching perguntas avaliacao:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar perguntas de avaliação' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    if (!data.codigo || !data.pergunta) {
      return NextResponse.json(
        { error: 'Código e pergunta são obrigatórios' },
        { status: 400 }
      );
    }

    const newPergunta =
      await db.perguntaAvaliacaoClassificacaoEmergencia.create({
        data: {
          codigo: data.codigo,
          pergunta: data.pergunta,
          tenantId,
          projectId,
        },
      });

    return NextResponse.json(newPergunta, { status: 201 });
  } catch (error) {
    console.error('Error creating pergunta avaliacao:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pergunta de avaliação' },
      { status: 500 }
    );
  }
}
