// app/api/forms/relatorio-auditoria-interna/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createContextualPrismaClient } from '@/lib/db-context';
import { relatorioAuditoriaInternaSchema } from '@/lib/validations/relatorio-auditoria-interna';
import { PrismaClient, Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
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
      tenantId,
      projectId: projectId || undefined,
    });

    try {
      const relatorios =
        await contextualPrisma.relatorioAuditoriaInterna.findMany({
          where: {
            tenantId,
            projectId: projectId || undefined,
          },
          orderBy: {
            dataAuditoria: 'desc',
          },
          include: {
            descricaoNaoConformidade: true,
          },
        });

      return NextResponse.json(relatorios);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          error: 'Erro ao buscar dados do banco de dados',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in relatorio auditoria interna route:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
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

    const contextualPrisma = createContextualPrismaClient({
      tenantId,
      projectId,
    });

    const data = await req.json();
    const validationResult = relatorioAuditoriaInternaSchema.safeParse(data);

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

    // Start a transaction to ensure all related records are created together
    const newRecord = await contextualPrisma.$transaction(
      async (
        tx: Omit<
          PrismaClient,
          | '$connect'
          | '$disconnect'
          | '$on'
          | '$transaction'
          | '$use'
          | '$extends'
        >
      ) => {
        // Create the main record
        const record = await tx.relatorioAuditoriaInterna.create({
          data: {
            tenantId: validatedData.tenantId,
            projectId: validatedData.projectId,
            ambitoAuditoria: validatedData.ambitoAuditoria,
            dataAuditoria: validatedData.dataAuditoria,
            dataRelatorio: validatedData.dataRelatorio,
            auditorLider: validatedData.auditorLider,
            auditorObservador: validatedData.auditorObservador,
            resumoAuditoria: validatedData.resumoAuditoria,
          },
        });

        // Create related não conformidades if they exist
        if (
          validatedData.descricaoNaoConformidades &&
          validatedData.descricaoNaoConformidades.length > 0
        ) {
          for (const naoConformidade of validatedData.descricaoNaoConformidades) {
            await tx.descricaoNaoConformidade.create({
              data: {
                tenantId: validatedData.tenantId,
                projectId: validatedData.projectId,
                relatorioAuditoriaInternaId: record.id,
                processo: naoConformidade.processo,
                clausula: naoConformidade.clausula,
                naoConformidade: naoConformidade.naoConformidade,
              },
            });
          }
        }

        return record;
      }
    );

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating relatorio auditoria interna:', error);
    return NextResponse.json(
      { error: 'Erro ao criar relatório de auditoria' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

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
      tenantId,
      projectId: projectId || undefined,
    });

    const data = await req.json();
    const validationResult = relatorioAuditoriaInternaSchema.safeParse(data);

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

    // Check if record exists and belongs to tenant
    const existingRelatorio =
      await contextualPrisma.relatorioAuditoriaInterna.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!existingRelatorio) {
      return NextResponse.json(
        { error: 'Relatório não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Update the record
    const updatedRecord = await contextualPrisma.$transaction(
      async (
        tx: Omit<
          PrismaClient,
          | '$connect'
          | '$disconnect'
          | '$on'
          | '$transaction'
          | '$use'
          | '$extends'
        >
      ) => {
        // Update the main record
        const record = await tx.relatorioAuditoriaInterna.update({
          where: { id },
          data: {
            ambitoAuditoria: validatedData.ambitoAuditoria,
            dataAuditoria: validatedData.dataAuditoria,
            dataRelatorio: validatedData.dataRelatorio,
            auditorLider: validatedData.auditorLider,
            auditorObservador: validatedData.auditorObservador,
            resumoAuditoria: validatedData.resumoAuditoria,
          },
        });

        // Delete existing não conformidades
        await tx.descricaoNaoConformidade.deleteMany({
          where: { relatorioAuditoriaInternaId: id },
        });

        // Create new não conformidades if they exist
        if (
          validatedData.descricaoNaoConformidades &&
          validatedData.descricaoNaoConformidades.length > 0
        ) {
          for (const naoConformidade of validatedData.descricaoNaoConformidades) {
            await tx.descricaoNaoConformidade.create({
              data: {
                tenantId: validatedData.tenantId,
                projectId: validatedData.projectId,
                relatorioAuditoriaInternaId: record.id,
                processo: naoConformidade.processo,
                clausula: naoConformidade.clausula,
                naoConformidade: naoConformidade.naoConformidade,
              },
            });
          }
        }

        return record;
      }
    );

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating relatorio auditoria interna:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar relatório de auditoria' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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
      tenantId,
    });

    // Check if record exists and belongs to tenant
    const existingRelatorio =
      await contextualPrisma.relatorioAuditoriaInterna.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!existingRelatorio) {
      return NextResponse.json(
        { error: 'Relatório não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Delete the record
    await contextualPrisma.relatorioAuditoriaInterna.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting relatorio auditoria interna:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir relatório de auditoria' },
      { status: 500 }
    );
  }
}
