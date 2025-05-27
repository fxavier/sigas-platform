// app/api/forms/registo-comunicacoes/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { registoComunicacoesSchema } from '@/lib/validations/registo-comunicacoes';

export async function GET(req: Request) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

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

    const registros =
      await contextualPrisma.registoComunicacoesRelatorioAsPartesInteressadas.findMany(
        {
          where: whereClause,
          orderBy: {
            data: 'desc',
          },
        }
      );

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error fetching registros:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar registros',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

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

    const validationResult = registoComunicacoesSchema.safeParse(data);

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

    // Create the main record
    const record =
      await db.registoComunicacoesRelatorioAsPartesInteressadas.create({
        data: {
          tenantId: validatedData.tenantId,
          projectId: validatedData.projectId,
          data: validatedData.data,
          local: validatedData.local,
          horario: validatedData.horario,
          agenda: validatedData.agenda,
          participantes: validatedData.participantes,
          encontroAtendeuSeuProposito:
            validatedData.encontroAtendeuSeuProposito,
          porqueNaoAtendeu: validatedData.porqueNaoAtendeu || '',
          haNecessidadeRetomarTema: validatedData.haNecessidadeRetomarTema,
          poruqNecessarioRetomarTema:
            validatedData.poruqNecessarioRetomarTema || '',
        },
      });

    return NextResponse.json(record, { status: 201 });
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
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const id = searchParams.get('id');

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

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const data = await req.json();

    const validationResult = registoComunicacoesSchema.safeParse(data);

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
      tenantId,
      projectId,
    });

    // Check if record exists and belongs to the tenant
    const existingRecord =
      await contextualPrisma.registoComunicacoesRelatorioAsPartesInteressadas.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Update the main record
    const updatedRecord =
      await db.registoComunicacoesRelatorioAsPartesInteressadas.update({
        where: { id },
        data: {
          data: validatedData.data,
          local: validatedData.local,
          horario: validatedData.horario,
          agenda: validatedData.agenda,
          participantes: validatedData.participantes,
          encontroAtendeuSeuProposito:
            validatedData.encontroAtendeuSeuProposito,
          porqueNaoAtendeu: validatedData.porqueNaoAtendeu || '',
          haNecessidadeRetomarTema: validatedData.haNecessidadeRetomarTema,
          poruqNecessarioRetomarTema:
            validatedData.poruqNecessarioRetomarTema || '',
        },
      });

    return NextResponse.json(updatedRecord);
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
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');
    const id = searchParams.get('id');

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

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId,
      projectId,
    });

    // Check if record exists and belongs to the tenant
    const existingRecord =
      await contextualPrisma.registoComunicacoesRelatorioAsPartesInteressadas.findUnique(
        {
          where: { id },
        }
      );

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Delete the record
    await db.registoComunicacoesRelatorioAsPartesInteressadas.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Registro deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting registro:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar registro' },
      { status: 500 }
    );
  }
}
