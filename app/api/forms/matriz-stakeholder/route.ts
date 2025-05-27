// app/api/forms/matriz-stakeholder/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { matrizStakeholderSchema } from '@/lib/validations/matriz-stakeholder';

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

    const registros = await contextualPrisma.matrizStakeholder.findMany({
      where: whereClause,
      include: {
        categoria: true,
        areaActuacao: true,
        principaisInteresses: true,
      },
      orderBy: {
        stakeholder: 'asc',
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

    const validationResult = matrizStakeholderSchema.safeParse(data);

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
    const record = await db.matrizStakeholder.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        stakeholder: validatedData.stakeholder,
        categoriaId: validatedData.categoriaId,
        alcance: validatedData.alcance,
        areaActuacaoId: validatedData.areaActuacaoId,
        descricao: validatedData.descricao,
        historico_relacionamento: validatedData.historico_relacionamento,
        percepcaoEmRelacaoAoEmprendedor:
          validatedData.percepcaoEmRelacaoAoEmprendedor,
        principaisInteressesId: validatedData.principaisInteressesId,
        oportunidades_associadas: validatedData.oportunidades_associadas,
        riscos_associados: validatedData.riscos_associados,
        percepcaoOuPosicionamento: validatedData.percepcaoOuPosicionamento,
        potenciaImpacto: validatedData.potenciaImpacto,
        diagnostico_directriz_posicionamento:
          validatedData.diagnostico_directriz_posicionamento,
        interlocutor_responsavel_por_relacionamento:
          validatedData.interlocutor_responsavel_por_relacionamento,
      },
      include: {
        categoria: true,
        areaActuacao: true,
        principaisInteresses: true,
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

    const validationResult = matrizStakeholderSchema.safeParse(data);

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
    const existingRecord = await contextualPrisma.matrizStakeholder.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Update the main record
    const updatedRecord = await db.matrizStakeholder.update({
      where: { id },
      data: {
        stakeholder: validatedData.stakeholder,
        categoriaId: validatedData.categoriaId,
        alcance: validatedData.alcance,
        areaActuacaoId: validatedData.areaActuacaoId,
        descricao: validatedData.descricao,
        historico_relacionamento: validatedData.historico_relacionamento,
        percepcaoEmRelacaoAoEmprendedor:
          validatedData.percepcaoEmRelacaoAoEmprendedor,
        principaisInteressesId: validatedData.principaisInteressesId,
        oportunidades_associadas: validatedData.oportunidades_associadas,
        riscos_associados: validatedData.riscos_associados,
        percepcaoOuPosicionamento: validatedData.percepcaoOuPosicionamento,
        potenciaImpacto: validatedData.potenciaImpacto,
        diagnostico_directriz_posicionamento:
          validatedData.diagnostico_directriz_posicionamento,
        interlocutor_responsavel_por_relacionamento:
          validatedData.interlocutor_responsavel_por_relacionamento,
      },
      include: {
        categoria: true,
        areaActuacao: true,
        principaisInteresses: true,
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
    const existingRecord = await contextualPrisma.matrizStakeholder.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Delete the record
    await db.matrizStakeholder.delete({
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
