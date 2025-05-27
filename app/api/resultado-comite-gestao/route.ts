// app/api/resultado-comite-gestao/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { resultadoComiteSchema } from '@/lib/validations/minutas-comite-gestao';

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

    const resultados =
      await contextualPrisma.resultadoComiteGestaoAmbientalESocial.findMany({
        where: whereClause,
        orderBy: {
          dataRevisaoEAprovacao: 'desc',
        },
      });

    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Error fetching resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();

    const validationResult = resultadoComiteSchema.safeParse(data);

    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.format());
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Create the resultado record
    const record = await db.resultadoComiteGestaoAmbientalESocial.create({
      data: {
        tenantId,
        projectId,
        pontosDebatidos: validatedData.pontosDebatidos,
        accoesNecessarias: validatedData.accoesNecessarias,
        responsavel: validatedData.responsavel,
        prazo: validatedData.prazo,
        situacao: validatedData.situacao,
        revisaoEAprovacao: validatedData.revisaoEAprovacao,
        dataRevisaoEAprovacao: validatedData.dataRevisaoEAprovacao,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating resultado:', error);
    return NextResponse.json(
      { error: 'Erro ao criar resultado' },
      { status: 500 }
    );
  }
}
