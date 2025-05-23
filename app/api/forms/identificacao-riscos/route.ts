// app/api/forms/identificacao-riscos/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { identificacaoAvaliacaoRiscosSchema } from '@/lib/validations/identificacao-avaliacao-riscos';

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

    const registros =
      await contextualPrisma.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.findMany(
        {
          include: {
            riscosImpactos: true,
            factorAmbientalImpactado: true,
          },
          where: {
            ...(projectId ? { projectId } : {}),
          },
          orderBy: {
            updatedAt: 'desc',
          },
        }
      );

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error fetching registros:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar registros' },
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
    const validationResult = identificacaoAvaliacaoRiscosSchema.safeParse(data);

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
    const { projectId, riscosImpactosId, factorAmbientalImpactadoId, ...rest } =
      validatedData;

    const newRegistro =
      await db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.create({
        data: {
          ...rest,
          tenantId,
          projectId,
          riscosImpactosId,
          factorAmbientalImpactadoId,
        },
        include: {
          riscosImpactos: true,
          factorAmbientalImpactado: true,
        },
      });

    return NextResponse.json(newRegistro, { status: 201 });
  } catch (error) {
    console.error('Error creating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar registro' },
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
    const validationResult = identificacaoAvaliacaoRiscosSchema.safeParse(data);

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
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    const { projectId, riscosImpactosId, factorAmbientalImpactadoId, ...rest } =
      validatedData;

    const updatedRegistro =
      await db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.update({
        where: { id },
        data: {
          ...rest,
          tenantId,
          projectId,
          riscosImpactosId,
          factorAmbientalImpactadoId,
        },
        include: {
          riscosImpactos: true,
          factorAmbientalImpactado: true,
        },
      });

    return NextResponse.json(updatedRegistro);
  } catch (error) {
    console.error('Error updating registro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar registro' },
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
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId || undefined,
    });

    const existingRegistro =
      await contextualPrisma.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    await db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registro:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir registro' },
      { status: 500 }
    );
  }
}
