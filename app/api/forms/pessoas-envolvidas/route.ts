// app/api/pessoas-envolvidas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const pessoaEnvolvidaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  funcao: z.string().min(1, { message: 'Função é obrigatória' }),
});

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

    const pessoas =
      await contextualPrisma.pessoasEnvolvidasNaInvestigacao.findMany({
        where: {
          tenantId,
        },
        orderBy: {
          nome: 'asc',
        },
      });

    return NextResponse.json(pessoas);
  } catch (error) {
    console.error('Error fetching pessoas envolvidas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pessoas envolvidas' },
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
    const validationResult = pessoaEnvolvidaSchema.safeParse(data);

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

    const novaPessoa = await db.pessoasEnvolvidasNaInvestigacao.create({
      data: {
        tenantId,
        nome: validatedData.nome,
        funcao: validatedData.funcao,
      },
    });

    return NextResponse.json(novaPessoa, { status: 201 });
  } catch (error) {
    console.error('Error creating pessoa envolvida:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pessoa envolvida' },
      { status: 500 }
    );
  }
}
