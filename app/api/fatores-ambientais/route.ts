// app/api/fatores-ambientais/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

    const fatoresAmbientais =
      await contextualPrisma.factorAmbientalImpactado.findMany({
        orderBy: {
          descricao: 'asc',
        },
      });

    return NextResponse.json(fatoresAmbientais);
  } catch (error) {
    console.error('Error fetching fatores ambientais:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fatores ambientais' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    if (!data.descricao) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    const newFatorAmbiental = await db.factorAmbientalImpactado.create({
      data: {
        descricao: data.descricao,
        tenantId,
      },
    });

    return NextResponse.json(newFatorAmbiental, { status: 201 });
  } catch (error) {
    console.error('Error creating fator ambiental:', error);
    return NextResponse.json(
      { error: 'Erro ao criar fator ambiental' },
      { status: 500 }
    );
  }
}
