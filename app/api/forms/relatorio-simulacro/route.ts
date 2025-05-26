// app/api/forms/relatorio-simulacro/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { relatorioSimulacroSchema } from '@/lib/validations/relatorio-simulacro';

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
    const registros = await db.relatorioDeSimulacro.findMany({
      where: whereClause,
      include: {
        relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia: {
          include: {
            avaliacaoClassificacaoEmergencia: {
              include: {
                pergunta: true,
              },
            },
          },
        },
        relatorioDeSimulacroOnRecomendacoes: {
          include: {
            recomendacoes: true,
          },
        },
        tenant: true,
        project: true,
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error fetching registros:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Erro ao buscar registros', details: errorMessage },
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
    const validationResult = relatorioSimulacroSchema.safeParse(data);

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

    // Create the relatorio simulacro record with transaction
    const newRelatorio = await db.$transaction(async (tx) => {
      // Create main relatorio
      const relatorio = await tx.relatorioDeSimulacro.create({
        data: {
          tenantId: validatedData.tenantId,
          projectId: validatedData.projectId,
          local: validatedData.local,
          tipoEmergenciaSimulada: validatedData.tipoEmergenciaSimulada,
          objectoDoSimulacro: validatedData.objectoDoSimulacro,
          descricaoDocenario: validatedData.descricaoDocenario,
          assinaturaCoordenadorEmergencia:
            validatedData.assinaturaCoordenadorEmergencia,
          outraAssinatura: validatedData.outraAssinatura,
        },
      });

      // Create avaliacao classificacao emergencia if they exist
      if (
        validatedData.avaliacaoClassificacaoEmergencia &&
        validatedData.avaliacaoClassificacaoEmergencia.length > 0
      ) {
        const avaliacaoPromises =
          validatedData.avaliacaoClassificacaoEmergencia.map(
            async (avaliacao) => {
              const avaliacaoRecord =
                await tx.avaliacaoClassificacaoEmergencia.create({
                  data: {
                    perguntaId: avaliacao.perguntaId,
                    resposta: avaliacao.resposta,
                    comentarios: avaliacao.comentarios,
                    tenantId: validatedData.tenantId,
                    projectId: validatedData.projectId,
                  },
                });

              // Create junction record
              await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.create(
                {
                  data: {
                    relatorioDeSimulacroId: relatorio.id,
                    avaliacaoClassificacaoEmergenciaId: avaliacaoRecord.id,
                  },
                }
              );

              return avaliacaoRecord;
            }
          );

        await Promise.all(avaliacaoPromises);
      }

      // Create recomendacoes if they exist
      if (
        validatedData.recomendacoes &&
        validatedData.recomendacoes.length > 0
      ) {
        const recomendacoesPromises = validatedData.recomendacoes.map(
          async (recomendacao) => {
            const recomendacaoRecord = await tx.recomendacoes.create({
              data: {
                acao: recomendacao.acao,
                responsavel: recomendacao.responsavel,
                prazo: recomendacao.prazo,
                tenantId: validatedData.tenantId,
                projectId: validatedData.projectId,
              },
            });

            // Create junction record
            await tx.relatorioDeSimulacroOnRecomendacoes.create({
              data: {
                relatorioDeSimulacroId: relatorio.id,
                recomendacoesId: recomendacaoRecord.id,
              },
            });

            return recomendacaoRecord;
          }
        );

        await Promise.all(recomendacoesPromises);
      }

      return relatorio;
    });

    // Fetch the complete record with includes
    const completeRecord = await db.relatorioDeSimulacro.findUnique({
      where: { id: newRelatorio.id },
      include: {
        relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia: {
          include: {
            avaliacaoClassificacaoEmergencia: {
              include: {
                pergunta: true,
              },
            },
          },
        },
        relatorioDeSimulacroOnRecomendacoes: {
          include: {
            recomendacoes: true,
          },
        },
      },
    });

    return NextResponse.json(completeRecord, { status: 201 });
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
    const validationResult = relatorioSimulacroSchema.safeParse(data);

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

    // Check if record exists
    const existingRecord = await db.relatorioDeSimulacro.findFirst({
      where: { id, tenantId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Update with transaction
    const updatedRelatorio = await db.$transaction(async (tx) => {
      // Delete existing relationships
      await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.deleteMany(
        {
          where: { relatorioDeSimulacroId: id },
        }
      );

      await tx.relatorioDeSimulacroOnRecomendacoes.deleteMany({
        where: { relatorioDeSimulacroId: id },
      });

      // Delete existing avaliacao records that are linked through junction table
      const avaliacaoIds =
        await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.findMany(
          {
            where: { relatorioDeSimulacroId: id },
            select: { avaliacaoClassificacaoEmergenciaId: true },
          }
        );

      if (avaliacaoIds.length > 0) {
        await tx.avaliacaoClassificacaoEmergencia.deleteMany({
          where: {
            id: {
              in: avaliacaoIds.map((a) => a.avaliacaoClassificacaoEmergenciaId),
            },
          },
        });
      }

      // Update main record
      const relatorio = await tx.relatorioDeSimulacro.update({
        where: { id },
        data: {
          local: validatedData.local,
          tipoEmergenciaSimulada: validatedData.tipoEmergenciaSimulada,
          objectoDoSimulacro: validatedData.objectoDoSimulacro,
          descricaoDocenario: validatedData.descricaoDocenario,
          assinaturaCoordenadorEmergencia:
            validatedData.assinaturaCoordenadorEmergencia,
          outraAssinatura: validatedData.outraAssinatura,
        },
      });

      // Recreate avaliacao classificacao emergencia
      if (
        validatedData.avaliacaoClassificacaoEmergencia &&
        validatedData.avaliacaoClassificacaoEmergencia.length > 0
      ) {
        const avaliacaoPromises =
          validatedData.avaliacaoClassificacaoEmergencia.map(
            async (avaliacao) => {
              const avaliacaoRecord =
                await tx.avaliacaoClassificacaoEmergencia.create({
                  data: {
                    perguntaId: avaliacao.perguntaId,
                    resposta: avaliacao.resposta,
                    comentarios: avaliacao.comentarios,
                    tenantId: validatedData.tenantId,
                    projectId: validatedData.projectId,
                  },
                });

              await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.create(
                {
                  data: {
                    relatorioDeSimulacroId: relatorio.id,
                    avaliacaoClassificacaoEmergenciaId: avaliacaoRecord.id,
                  },
                }
              );

              return avaliacaoRecord;
            }
          );

        await Promise.all(avaliacaoPromises);
      }

      // Recreate recomendacoes
      if (
        validatedData.recomendacoes &&
        validatedData.recomendacoes.length > 0
      ) {
        const recomendacoesPromises = validatedData.recomendacoes.map(
          async (recomendacao) => {
            const recomendacaoRecord = await tx.recomendacoes.create({
              data: {
                acao: recomendacao.acao,
                responsavel: recomendacao.responsavel,
                prazo: recomendacao.prazo,
                tenantId: validatedData.tenantId,
                projectId: validatedData.projectId,
              },
            });

            await tx.relatorioDeSimulacroOnRecomendacoes.create({
              data: {
                relatorioDeSimulacroId: relatorio.id,
                recomendacoesId: recomendacaoRecord.id,
              },
            });

            return recomendacaoRecord;
          }
        );

        await Promise.all(recomendacoesPromises);
      }

      return relatorio;
    });

    // Fetch the complete updated record
    const completeRecord = await db.relatorioDeSimulacro.findUnique({
      where: { id: updatedRelatorio.id },
      include: {
        relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia: {
          include: {
            avaliacaoClassificacaoEmergencia: {
              include: {
                pergunta: true,
              },
            },
          },
        },
        relatorioDeSimulacroOnRecomendacoes: {
          include: {
            recomendacoes: true,
          },
        },
      },
    });

    return NextResponse.json(completeRecord);
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

    // Check if record exists
    const existingRecord = await db.relatorioDeSimulacro.findFirst({
      where: { id, tenantId },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Delete with transaction
    await db.$transaction(async (tx) => {
      // Delete junction records first
      await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.deleteMany(
        {
          where: { relatorioDeSimulacroId: id },
        }
      );

      await tx.relatorioDeSimulacroOnRecomendacoes.deleteMany({
        where: { relatorioDeSimulacroId: id },
      });

      // Delete related avaliacao records
      const avaliacaoIds =
        await tx.relatorioDeSimulacroOnAvaliacaoClassificacaoEmergencia.findMany(
          {
            where: { relatorioDeSimulacroId: id },
            select: { avaliacaoClassificacaoEmergenciaId: true },
          }
        );

      if (avaliacaoIds.length > 0) {
        await tx.avaliacaoClassificacaoEmergencia.deleteMany({
          where: {
            id: {
              in: avaliacaoIds.map((a) => a.avaliacaoClassificacaoEmergenciaId),
            },
          },
        });
      }

      // Delete main record
      await tx.relatorioDeSimulacro.delete({
        where: { id },
      });
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
