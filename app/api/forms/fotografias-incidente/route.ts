// app/api/fotografias-incidente/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

const fotografiaSchema = z.object({
  fotografia: z.string().min(1, { message: 'URL da fotografia é obrigatória' }),
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

    const fotografias = await contextualPrisma.fotografiasIncidente.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(fotografias);
  } catch (error) {
    console.error('Error fetching fotografias incidente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fotografias' },
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
    const validationResult = fotografiaSchema.safeParse(data);

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

    const novaFotografia = await db.fotografiasIncidente.create({
      data: {
        tenantId,
        fotografia: validatedData.fotografia,
      },
    });

    return NextResponse.json(novaFotografia, { status: 201 });
  } catch (error) {
    console.error('Error creating fotografia incidente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar fotografia' },
      { status: 500 }
    );
  }
}
