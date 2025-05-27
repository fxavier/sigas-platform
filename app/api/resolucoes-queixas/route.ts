// app/api/resolucoes-queixas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const resolucaoQueixaSchema = z.object({
  accao_correctiva: z
    .string()
    .min(1, { message: 'Ação corretiva é obrigatória' }),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }),
  prazo: z.string().min(1, { message: 'Prazo é obrigatório' }),
  estado: z.string().min(1, { message: 'Estado é obrigatório' }),
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

    const resolucoes = await contextualPrisma.recomendacoes.findMany({
      where: {
        tenantId,
        projectId,
      },
      orderBy: {
        acao: 'asc',
      },
    });

    // Map to match expected structure
    const mappedResolucoes = resolucoes.map((item) => ({
      id: item.id,
      accao_correctiva: item.acao,
      responsavel: item.responsavel,
      prazo: item.prazo,
      estado: 'Pendente', // Default state
    }));

    return NextResponse.json(mappedResolucoes);
  } catch (error) {
    console.error('Error fetching resolucoes queixas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resoluções de queixas' },
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
    const validationResult = resolucaoQueixaSchema.safeParse(data);

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

    // Create using ResolucaoQueixa model if it exists, otherwise use Recomendacoes
    const novaResolucao = await db.recomendacoes.create({
      data: {
        tenantId,
        projectId,
        acao: validatedData.accao_correctiva,
        responsavel: validatedData.responsavel,
        prazo: validatedData.prazo,
      },
    });

    // Map response to expected structure
    const mappedResolucao = {
      id: novaResolucao.id,
      accao_correctiva: novaResolucao.acao,
      responsavel: novaResolucao.responsavel,
      prazo: novaResolucao.prazo,
      estado: validatedData.estado,
    };

    return NextResponse.json(mappedResolucao, { status: 201 });
  } catch (error) {
    console.error('Error creating resolucao queixa:', error);
    return NextResponse.json(
      { error: 'Erro ao criar resolução de queixa' },
      { status: 500 }
    );
  }
}
