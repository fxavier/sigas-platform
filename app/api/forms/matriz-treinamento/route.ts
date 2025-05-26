import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { matrizTreinamentoSchema } from '@/lib/validations/organizational-capacity-competence';

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

    const registros = await contextualPrisma.matrizTreinamento.findMany({
      where: whereClause,
      include: {
        areaTreinamento: true,
        caixa_ferramentas: true,
        funcao: true,
      },
    });

    // Format the data for the frontend
    const formattedRegistros = registros.map((registro: any) => {
      // Return a cleaned-up object with proper structure
      return {
        id: registro.id,
        tenantId: registro.tenantId,
        projectId: registro.projectId,
        data: registro.data,
        funcaoId: registro.funcaoId,
        areaTreinamentoId: registro.areaTreinamentoId,
        caixaFerramentasId: registro.caixaFerramentasId,
        totais_palestras: registro.totais_palestras,
        total_horas: registro.total_horas,
        total_caixa_ferramentas: registro.total_caixa_ferramentas,
        total_pessoas_informadas_caixa_ferramentas:
          registro.total_pessoas_informadas_caixa_ferramentas,
        eficacia: registro.eficacia,
        accoes_treinamento_nao_eficaz: registro.accoes_treinamento_nao_eficaz,
        aprovado_por: registro.aprovado_por,
        createdAt: registro.createdAt,
        updatedAt: registro.updatedAt,
        areaTreinamento: registro.areaTreinamento,
        caixa_ferramentas: registro.caixa_ferramentas,
        funcao: registro.funcao,
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

    const validationResult = matrizTreinamentoSchema.safeParse(data);

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
    const record = await db.matrizTreinamento.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,
        data: validatedData.data,
        funcaoId: validatedData.funcaoId,
        areaTreinamentoId: validatedData.areaTreinamentoId,
        caixaFerramentasId: validatedData.caixaFerramentasId,
        totais_palestras: validatedData.totais_palestras,
        total_horas: validatedData.total_horas,
        total_caixa_ferramentas: validatedData.total_caixa_ferramentas,
        total_pessoas_informadas_caixa_ferramentas:
          validatedData.total_pessoas_informadas_caixa_ferramentas,
        eficacia: validatedData.eficacia,
        accoes_treinamento_nao_eficaz:
          validatedData.accoes_treinamento_nao_eficaz,
        aprovado_por: validatedData.aprovado_por,
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

    const validationResult = matrizTreinamentoSchema.safeParse(data);

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
    const existingRecord = await contextualPrisma.matrizTreinamento.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Update the main record
    const updatedRecord = await db.matrizTreinamento.update({
      where: { id },
      data: {
        data: validatedData.data,
        funcaoId: validatedData.funcaoId,
        areaTreinamentoId: validatedData.areaTreinamentoId,
        caixaFerramentasId: validatedData.caixaFerramentasId,
        totais_palestras: validatedData.totais_palestras,
        total_horas: validatedData.total_horas,
        total_caixa_ferramentas: validatedData.total_caixa_ferramentas,
        total_pessoas_informadas_caixa_ferramentas:
          validatedData.total_pessoas_informadas_caixa_ferramentas,
        eficacia: validatedData.eficacia,
        accoes_treinamento_nao_eficaz:
          validatedData.accoes_treinamento_nao_eficaz,
        aprovado_por: validatedData.aprovado_por,
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
    const existingRecord = await contextualPrisma.matrizTreinamento.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Registro não encontrado' },
        { status: 404 }
      );
    }

    // Delete the record
    await db.matrizTreinamento.delete({
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
