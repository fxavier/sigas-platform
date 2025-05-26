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

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

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

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId,
      projectId: projectId,
    });

    // Check if the pergunta exists and belongs to the tenant/project
    const existingPergunta =
      await contextualPrisma.perguntaAvaliacaoClassificacaoEmergencia.findUnique(
        {
          where: { id },
        }
      );

    if (!existingPergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    // Update the pergunta
    const updatedPergunta =
      await db.perguntaAvaliacaoClassificacaoEmergencia.update({
        where: { id },
        data: {
          codigo: data.codigo,
          pergunta: data.pergunta,
          tenantId,
          projectId,
        },
      });

    return NextResponse.json(updatedPergunta);
  } catch (error) {
    console.error('Error updating pergunta avaliacao:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pergunta de avaliação' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId,
      projectId: projectId,
    });

    // Check if the pergunta exists and belongs to the tenant/project
    const existingPergunta =
      await contextualPrisma.perguntaAvaliacaoClassificacaoEmergencia.findUnique(
        {
          where: { id },
        }
      );

    if (!existingPergunta) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    // Check if this pergunta is used in any avaliacao classificacao emergencia
    const relatedRecords = await db.avaliacaoClassificacaoEmergencia.findMany({
      where: {
        perguntaId: id,
      },
      take: 1,
    });

    if (relatedRecords.length > 0) {
      return NextResponse.json(
        {
          error:
            'Esta pergunta não pode ser excluída porque está sendo usada em uma ou mais avaliações de emergência.',
        },
        { status: 400 }
      );
    }

    // Delete the pergunta
    await db.perguntaAvaliacaoClassificacaoEmergencia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pergunta avaliacao:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir pergunta de avaliação' },
      { status: 500 }
    );
  }
}
