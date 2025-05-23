// app/api/forms/objetivos-metas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { objetivosMetasSchema } from '@/lib/validations/objetivos-metas';

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
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findMany({
        where: whereClause,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          membrosDaEquipa: {
            include: {
              membroEquipa: true,
            },
          },
          tabelasAccoes: {
            include: {
              tabelaAccao: true,
            },
          },
        },
      });

    // Format the data for the frontend
    const formattedRegistros = registros.map((registro: any) => {
      // Extract the membros da equipa from the relationships
      const membrosDaEquipa = registro.membrosDaEquipa.map(
        (relation: any) => relation.membroEquipa
      );

      // Extract the tabelas acoes from the relationships
      const tabelasAccoes = registro.tabelasAccoes.map(
        (relation: any) => relation.tabelaAccao
      );

      // Return a cleaned-up object with proper structure
      return {
        id: registro.id,
        tenantId: registro.tenantId,
        projectId: registro.projectId,
        numeroRefOAndM: registro.numeroRefOAndM,
        aspetoRefNumero: registro.aspetoRefNumero,
        centroCustos: registro.centroCustos,
        objectivo: registro.objectivo,
        publicoAlvo: registro.publicoAlvo,
        orcamentoRecursos: registro.orcamentoRecursos,
        refDocumentoComprovativo: registro.refDocumentoComprovativo,
        dataInicio: registro.dataInicio,
        dataConclusaoPrevista: registro.dataConclusaoPrevista,
        dataConclusaoReal: registro.dataConclusaoReal,
        pgasAprovadoPor: registro.pgasAprovadoPor,
        dataAprovacao: registro.dataAprovacao,
        observacoes: registro.observacoes,
        oAndMAlcancadoFechado: registro.oAndMAlcancadoFechado,
        assinaturaDirectorGeral: registro.assinaturaDirectorGeral,
        data: registro.data,
        createdAt: registro.createdAt,
        updatedAt: registro.updatedAt,
        membrosDaEquipa,
        tabelasAccoes,
      };
    });

    return NextResponse.json(formattedRegistros);
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
    const validationResult = objetivosMetasSchema.safeParse(data);

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
    const newRecord = await db.$transaction(async (tx) => {
      // Create the main record
      const record = await tx.registoObjectivosMetasAmbientaisSociais.create({
        data: {
          tenantId: validatedData.tenantId,
          projectId: validatedData.projectId,
          numeroRefOAndM: validatedData.numeroRefOAndM,
          aspetoRefNumero: validatedData.aspetoRefNumero,
          centroCustos: validatedData.centroCustos,
          objectivo: validatedData.objectivo,
          publicoAlvo: validatedData.publicoAlvo,
          orcamentoRecursos: validatedData.orcamentoRecursos,
          refDocumentoComprovativo:
            validatedData.refDocumentoComprovativo || '',
          dataInicio: validatedData.dataInicio,
          dataConclusaoPrevista: validatedData.dataConclusaoPrevista,
          dataConclusaoReal: validatedData.dataConclusaoReal,
          pgasAprovadoPor: validatedData.pgasAprovadoPor,
          dataAprovacao: validatedData.dataAprovacao,
          observacoes: validatedData.observacoes,
          oAndMAlcancadoFechado: validatedData.oAndMAlcancadoFechado,
          assinaturaDirectorGeral: validatedData.assinaturaDirectorGeral,
          data: validatedData.data,
        },
      });

      // Create relationships for team members if they exist
      if (
        validatedData.membrosDaEquipaIds &&
        validatedData.membrosDaEquipaIds.length > 0
      ) {
        for (const membroId of validatedData.membrosDaEquipaIds) {
          await tx.objectivosMetasOnMembrosEquipa.create({
            data: {
              objetivoMetaId: record.id,
              membroEquipaId: membroId,
            },
          });
        }
      }

      // Create relationships for actions table if they exist
      if (
        validatedData.tabelasAcoesIds &&
        validatedData.tabelasAcoesIds.length > 0
      ) {
        for (const acaoId of validatedData.tabelasAcoesIds) {
          await tx.objectivosMetasOnTabelaAccoes.create({
            data: {
              objetivoMetaId: record.id,
              tabelaAccaoId: acaoId,
            },
          });
        }
      }

      return record;
    });

    return NextResponse.json(newRecord, { status: 201 });
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

    const data = await req.json();
    const validationResult = objetivosMetasSchema.safeParse(data);

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
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Start a transaction to ensure all related records are updated together
    const updatedRecord = await db.$transaction(async (tx) => {
      // Update the main record
      const record = await tx.registoObjectivosMetasAmbientaisSociais.update({
        where: { id },
        data: {
          numeroRefOAndM: validatedData.numeroRefOAndM,
          aspetoRefNumero: validatedData.aspetoRefNumero,
          centroCustos: validatedData.centroCustos,
          objectivo: validatedData.objectivo,
          publicoAlvo: validatedData.publicoAlvo,
          orcamentoRecursos: validatedData.orcamentoRecursos,
          refDocumentoComprovativo:
            validatedData.refDocumentoComprovativo || '',
          dataInicio: validatedData.dataInicio,
          dataConclusaoPrevista: validatedData.dataConclusaoPrevista,
          dataConclusaoReal: validatedData.dataConclusaoReal,
          pgasAprovadoPor: validatedData.pgasAprovadoPor,
          dataAprovacao: validatedData.dataAprovacao,
          observacoes: validatedData.observacoes,
          oAndMAlcancadoFechado: validatedData.oAndMAlcancadoFechado,
          assinaturaDirectorGeral: validatedData.assinaturaDirectorGeral,
          data: validatedData.data,
        },
      });

      // Remove existing relationships before adding new ones
      await tx.objectivosMetasOnMembrosEquipa.deleteMany({
        where: { objetivoMetaId: id },
      });

      await tx.objectivosMetasOnTabelaAccoes.deleteMany({
        where: { objetivoMetaId: id },
      });

      // Create relationships for team members if they exist
      if (
        validatedData.membrosDaEquipaIds &&
        validatedData.membrosDaEquipaIds.length > 0
      ) {
        for (const membroId of validatedData.membrosDaEquipaIds) {
          await tx.objectivosMetasOnMembrosEquipa.create({
            data: {
              objetivoMetaId: record.id,
              membroEquipaId: membroId,
            },
          });
        }
      }

      // Create relationships for actions table if they exist
      if (
        validatedData.tabelasAcoesIds &&
        validatedData.tabelasAcoesIds.length > 0
      ) {
        for (const acaoId of validatedData.tabelasAcoesIds) {
          await tx.objectivosMetasOnTabelaAccoes.create({
            data: {
              objetivoMetaId: record.id,
              tabelaAccaoId: acaoId,
            },
          });
        }
      }

      return record;
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
      await contextualPrisma.registoObjectivosMetasAmbientaisSociais.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Start a transaction to ensure all related records are deleted together
    await db.$transaction(async (tx) => {
      // Delete relationships first
      await tx.objectivosMetasOnMembrosEquipa.deleteMany({
        where: { objetivoMetaId: id },
      });

      await tx.objectivosMetasOnTabelaAccoes.deleteMany({
        where: { objetivoMetaId: id },
      });

      // Delete the main record
      await tx.registoObjectivosMetasAmbientaisSociais.delete({
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
