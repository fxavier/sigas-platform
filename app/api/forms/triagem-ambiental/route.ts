// app/api/forms/triagem-ambiental/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { triagemAmbientalSchema } from '@/lib/validations/triagem-ambiental';

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

    const registros = await contextualPrisma.triagemAmbientalSocial.findMany({
      where: whereClause,
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
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

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const validationResult = triagemAmbientalSchema.safeParse(data);

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

    // Create the triagem record
    const newTriagem = await db.triagemAmbientalSocial.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        responsavelPeloPreenchimentoId:
          validatedData.responsavelPeloPreenchimentoId,
        responsavelPelaVerificacaoId:
          validatedData.responsavelPelaVerificacaoId,
        subprojectoId: validatedData.subprojectoId,
        consultaEngajamento: validatedData.consultaEngajamento,
        accoesRecomendadas: validatedData.accoesRecomendadas,
        resultadoTriagemId: validatedData.resultadoTriagemId,
        // Handle identificacao riscos creation if they exist
        identificacaoRiscos: validatedData.identificacaoRiscos
          ? {
              create: validatedData.identificacaoRiscos.map((risco) => ({
                identificacaoRiscos: {
                  create: {
                    biodiversidadeRecursosNaturaisId:
                      risco.biodiversidadeRecursosNaturaisId,
                    resposta: risco.resposta,
                    comentario: risco.comentario,
                    normaAmbientalSocial: risco.normaAmbientalSocial,
                    tenantId: validatedData.tenantId,
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newTriagem, { status: 201 });
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
    const validationResult = triagemAmbientalSchema.safeParse(data);

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
      await contextualPrisma.triagemAmbientalSocial.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // First delete the existing identificacao riscos
    if (
      validatedData.identificacaoRiscos &&
      validatedData.identificacaoRiscos.length > 0
    ) {
      await db.triagemAmbientalSocialOnIdentificacaoRiscos.deleteMany({
        where: { triagemAmbientalSocialId: id },
      });
    }

    // Update the triagem record
    const updatedTriagem = await db.triagemAmbientalSocial.update({
      where: { id },
      data: {
        responsavelPeloPreenchimentoId:
          validatedData.responsavelPeloPreenchimentoId,
        responsavelPelaVerificacaoId:
          validatedData.responsavelPelaVerificacaoId,
        subprojectoId: validatedData.subprojectoId,
        consultaEngajamento: validatedData.consultaEngajamento,
        accoesRecomendadas: validatedData.accoesRecomendadas,
        resultadoTriagemId: validatedData.resultadoTriagemId,
        // Recreate identificacao riscos if they exist
        identificacaoRiscos:
          validatedData.identificacaoRiscos &&
          validatedData.identificacaoRiscos.length > 0
            ? {
                create: validatedData.identificacaoRiscos.map((risco) => ({
                  identificacaoRiscos: {
                    create: {
                      biodiversidadeRecursosNaturaisId:
                        risco.biodiversidadeRecursosNaturaisId,
                      resposta: risco.resposta,
                      comentario: risco.comentario,
                      normaAmbientalSocial: risco.normaAmbientalSocial,
                      tenantId: validatedData.tenantId,
                    },
                  },
                })),
              }
            : undefined,
      },
      include: {
        responsavelPeloPreenchimento: true,
        responsavelPelaVerificacao: true,
        subprojecto: true,
        resultadoTriagem: true,
        identificacaoRiscos: {
          include: {
            identificacaoRiscos: {
              include: {
                biodiversidadeRecursosNaturais: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedTriagem);
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
      await contextualPrisma.triagemAmbientalSocial.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // First delete related records
    await db.triagemAmbientalSocialOnIdentificacaoRiscos.deleteMany({
      where: { triagemAmbientalSocialId: id },
    });

    // Then delete the main record
    await db.triagemAmbientalSocial.delete({
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
