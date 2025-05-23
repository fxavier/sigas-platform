// app/api/forms/tabela-accao/route.ts
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

    // Use the contextual Prisma client to fetch data with tenant isolation
    const contextualPrisma = createContextualPrismaClient({
      tenantId,
    });

    const tabelasAccao = await contextualPrisma.tabelaAccoes.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        prazo: 'asc',
      },
    });

    return NextResponse.json(tabelasAccao);
  } catch (error) {
    console.error('Error fetching tabelas accao:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tabelas de ações' },
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

    // Ensure dates are properly handled
    const processedData = {
      ...data,
      prazo: new Date(data.prazo),
      dataConclusao: new Date(data.dataConclusao),
      tenantId,
    };

    // Create the new tabela accao
    const newTabelaAccao = await db.tabelaAccoes.create({
      data: processedData,
    });

    return NextResponse.json(newTabelaAccao, { status: 201 });
  } catch (error) {
    console.error('Error creating tabela accao:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tabela de ação' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const contextualPrisma = createContextualPrismaClient({
      tenantId,
    });

    // Check if record exists with proper tenant isolation
    const existingTabelaAccao = await contextualPrisma.tabelaAccoes.findFirst({
      where: { id },
    });

    if (!existingTabelaAccao) {
      return NextResponse.json(
        { error: 'Tabela de ação não encontrada ou sem permissão' },
        { status: 404 }
      );
    }

    // Ensure dates are properly handled
    const processedData = {
      ...data,
      prazo: new Date(data.prazo),
      dataConclusao: new Date(data.dataConclusao),
    };

    // Update the record
    const updatedTabelaAccao = await db.tabelaAccoes.update({
      where: { id },
      data: processedData,
    });

    return NextResponse.json(updatedTabelaAccao);
  } catch (error) {
    console.error('Error updating tabela accao:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar tabela de ação' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');

    if (!id) {