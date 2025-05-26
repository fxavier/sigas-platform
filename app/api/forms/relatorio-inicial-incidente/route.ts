import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { relatorioInicialIncidenteSchema } from '@/lib/validations/relatorio-inicial-incidente';
import { auth } from '@clerk/nextjs/server';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    const relatorios = await db.relatorioInicialIncidente.findMany({
      where: {
        tenantId,
        projectId,
      },
      include: {
        incidentes: {
          include: {
            incidente: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const transformedRelatorios = relatorios.map((relatorio: any) => ({
      ...relatorio,
      incidentes: relatorio.incidentes.map((inc: any) => inc.incidente),
    }));

    return NextResponse.json(transformedRelatorios);
  } catch (error) {
    console.error('Error fetching relatorio inicial incidente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));

    const validatedData = relatorioInicialIncidenteSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    const { incidentesIds, ...relatorioData } = validatedData;
    console.log(
      'Relatorio data for DB:',
      JSON.stringify(relatorioData, null, 2)
    );

    // Transform horaIncidente to ensure it's properly formatted for the Time field
    const transformedData = {
      ...relatorioData,
      horaIncidente: new Date(relatorioData.horaIncidente),
    };

    // Create the relatorio inicial incidente
    const relatorio = await db.relatorioInicialIncidente.create({
      data: {
        ...transformedData,
        incidentes: incidentesIds?.length
          ? {
              create: incidentesIds.map((incidenteId) => ({
                incidenteId,
              })),
            }
          : undefined,
      },
      include: {
        incidentes: {
          include: {
            incidente: true,
          },
        },
      },
    });

    // Transform the response to match the expected format
    const transformedRelatorio = {
      ...relatorio,
      incidentes: relatorio.incidentes.map((inc) => inc.incidente),
    };

    return NextResponse.json(transformedRelatorio, { status: 201 });
  } catch (error) {
    console.error('Error creating relatorio inicial incidente:', error);

    // If it's a Zod validation error, return the specific validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    // If it's a Prisma error, provide more context
    if (
      error instanceof Error &&
      (error.message.includes('Prisma') ||
        error.message.includes('Foreign key constraint'))
    ) {
      console.error('Prisma error details:', error);
      return NextResponse.json(
        { error: 'Erro de banco de dados', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = relatorioInicialIncidenteSchema.parse(body);

    const { incidentesIds, ...relatorioData } = validatedData;

    // Update the relatorio inicial incidente
    const relatorio = await db.relatorioInicialIncidente.update({
      where: { id },
      data: {
        ...relatorioData,
        incidentes: {
          deleteMany: {},
          create: incidentesIds?.length
            ? incidentesIds.map((incidenteId) => ({
                incidenteId,
              }))
            : [],
        },
      },
      include: {
        incidentes: {
          include: {
            incidente: true,
          },
        },
      },
    });

    // Transform the response to match the expected format
    const transformedRelatorio = {
      ...relatorio,
      incidentes: relatorio.incidentes.map((inc) => inc.incidente),
    };

    return NextResponse.json(transformedRelatorio);
  } catch (error) {
    console.error('Error updating relatorio inicial incidente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    if (!tenantId || !projectId) {
      return NextResponse.json(
        { error: 'tenantId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    await db.relatorioInicialIncidente.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Relatório excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting relatorio inicial incidente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
