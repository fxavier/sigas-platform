// app/api/forms/minutas-comite-gestao/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { minutasComiteGestaoCompletoSchema } from '@/lib/validations/minutas-comite-gestao';

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

    const registros =
      await contextualPrisma.minutasComiteGestaoAmbientalESocial.findMany({
        where: whereClause,
        include: {
          resultadoComiteGestaoAmbientalESocial: true,
        },
        orderBy: {
          data: 'desc',
        },
      });

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

    const validationResult = minutasComiteGestaoCompletoSchema.safeParse(data);

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

    // Create both records in a transaction
    const record = await db.$transaction(async (prisma) => {
      // First create the resultado
      const resultado =
        await prisma.resultadoComiteGestaoAmbientalESocial.create({
          data: {
            tenantId,
            projectId,
            pontosDebatidos: validatedData.resultado.pontosDebatidos,
            accoesNecessarias: validatedData.resultado.accoesNecessarias,
            responsavel: validatedData.resultado.responsavel,
            prazo: validatedData.resultado.prazo,
            situacao: validatedData.resultado.situacao,
            revisaoEAprovacao: validatedData.resultado.revisaoEAprovacao,
            dataRevisaoEAprovacao:
              validatedData.resultado.dataRevisaoEAprovacao,
          },
        });

      // Then create the minuta linking to the resultado
      const minuta = await prisma.minutasComiteGestaoAmbientalESocial.create({
        data: {
          tenantId,
          projectId,
          presididoPor: validatedData.minuta.presididoPor,
          convidado: validatedData.minuta.convidado,
          ausenciasJustificadas:
            validatedData.minuta.ausenciasJustificadas || '',
          data: validatedData.minuta.data,
          hora: validatedData.minuta.hora,
          local: validatedData.minuta.local,
          agenda: validatedData.minuta.agenda,
          resultadoComiteGestaoAmbientalESocialId: resultado.id,
        },
        include: {
          resultadoComiteGestaoAmbientalESocial: true,
        },
      });

      return minuta;
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

    const validationResult = minutasComiteGestaoCompletoSchema.safeParse(data);

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
      await contextualPrisma.minutasComiteGestaoAmbientalESocial.findUnique({
        where: { id },
        include: {
          resultadoComiteGestaoAmbientalESocial: true,
        },
      });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Update both records in a transaction
    const updatedRecord = await db.$transaction(async (prisma) => {
      // Update the resultado
      await prisma.resultadoComiteGestaoAmbientalESocial.update({
        where: { id: existingRecord.resultadoComiteGestaoAmbientalESocialId },
        data: {
          pontosDebatidos: validatedData.resultado.pontosDebatidos,
          accoesNecessarias: validatedData.resultado.accoesNecessarias,
          responsavel: validatedData.resultado.responsavel,
          prazo: validatedData.resultado.prazo,
          situacao: validatedData.resultado.situacao,
          revisaoEAprovacao: validatedData.resultado.revisaoEAprovacao,
          dataRevisaoEAprovacao: validatedData.resultado.dataRevisaoEAprovacao,
        },
      });

      // Update the minuta
      const minuta = await prisma.minutasComiteGestaoAmbientalESocial.update({
        where: { id },
        data: {
          presididoPor: validatedData.minuta.presididoPor,
          convidado: validatedData.minuta.convidado,
          ausenciasJustificadas:
            validatedData.minuta.ausenciasJustificadas || '',
          data: validatedData.minuta.data,
          hora: validatedData.minuta.hora,
          local: validatedData.minuta.local,
          agenda: validatedData.minuta.agenda,
        },
        include: {
          resultadoComiteGestaoAmbientalESocial: true,
        },
      });

      return minuta;
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
      await contextualPrisma.minutasComiteGestaoAmbientalESocial.findUnique({
        where: { id },
        include: {
          resultadoComiteGestaoAmbientalESocial: true,
        },
      });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Delete both records in a transaction (minuta first due to foreign key)
    await db.$transaction(async (prisma) => {
      // Delete the minuta first
      await prisma.minutasComiteGestaoAmbientalESocial.delete({
        where: { id },
      });

      // Then delete the resultado
      await prisma.resultadoComiteGestaoAmbientalESocial.delete({
        where: { id: existingRecord.resultadoComiteGestaoAmbientalESocialId },
      });
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
