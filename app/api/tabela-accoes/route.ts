// app/api/tabela-accoes/route.ts
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

    const tabelaAccoes = await contextualPrisma.tabelaAccoes.findMany({
      where: { tenantId },
      orderBy: { accao: 'asc' },
    });

    return NextResponse.json(tabelaAccoes);
  } catch (error) {
    console.error('Error fetching tabela accoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tabela de ações' },
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

    if (!data.accao || !data.pessoaResponsavel) {
      return NextResponse.json(
        { error: 'Ação e pessoa responsável são obrigatórios' },
        { status: 400 }
      );
    }

    // Set default dates if not provided
    const prazo = data.prazo ? new Date(data.prazo) : new Date();
    const dataConclusao = data.dataConclusao
      ? new Date(data.dataConclusao)
      : new Date();

    const newAcao = await createContextualPrismaClient({
      tenantId,
    }).tabelaAccoes.create({
      data: {
        tenantId,
        accao: data.accao,
        pessoaResponsavel: data.pessoaResponsavel,
        prazo,
        dataConclusao,
      },
    });

    return NextResponse.json(newAcao, { status: 201 });
  } catch (error) {
    console.error('Error creating tabela acao:', error);
    return NextResponse.json({ error: 'Erro ao criar ação' }, { status: 500 });
  }
}
