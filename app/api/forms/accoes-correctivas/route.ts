// app/api/accoes-correctivas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const accaoCorrectivaSchema = z.object({
  accao: z.string().min(1, { message: 'Ação é obrigatória' }),
  prazo: z.date({ required_error: 'Prazo é obrigatório' }),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }),
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

    const accoes =
      await contextualPrisma.accoesCorrectivasPermanentesTomar.findMany({
        where: {
          tenantId,
        },
        orderBy: {
          prazo: 'asc',
        },
      });

    return NextResponse.json(accoes);
  } catch (error) {
    console.error('Error fetching accoes correctivas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ações correctivas' },
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
    const validationResult = accaoCorrectivaSchema.safeParse(data);

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

    const novaAccao = await db.accoesCorrectivasPermanentesTomar.create({
      data: {
        tenantId,
        accao: validatedData.accao,
        prazo: validatedData.prazo,
        responsavel: validatedData.responsavel,
      },
    });

    return NextResponse.json(novaAccao, { status: 201 });
  } catch (error) {
    console.error('Error creating accao correctiva:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ação correctiva' },
      { status: 500 }
    );
  }
}
