import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

// Schema for validation
const resultadoTriagemSchema = z.object({
  categoriaRisco: z
    .string()
    .min(1, { message: 'Categoria de risco é obrigatória' }),
  descricao: z.string().default('Nova categoria de risco'),
  instrumentosASeremDesenvolvidos: z.string().default(''),
  subprojectoId: z.string().min(1, { message: 'Subprojeto é obrigatório' }),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const id = searchParams.get('id');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId,
    });

    try {
      if (id) {
        // Get single record if ID is provided
        const record = await contextualPrisma.resultadoTriagem.findUnique({
          where: { id },
        });

        if (!record) {
          return NextResponse.json(
            { error: 'Resultado de triagem não encontrado' },
            { status: 404 }
          );
        }

        return NextResponse.json(record);
      } else {
        // Get all records for tenant
        const records = await contextualPrisma.resultadoTriagem.findMany({
          orderBy: {
            categoriaRisco: 'asc',
          },
        });

        return NextResponse.json(records);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Erro ao buscar resultados de triagem no banco de dados' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching resultados triagem:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados de triagem' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST request received at /api/resultados-triagem');
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    console.log('Request URL:', req.url);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));

    if (!tenantId) {
      console.error('Missing tenantId in request');
      return NextResponse.json(
        { error: 'tenantId é obrigatório' },
        { status: 400 }
      );
    }

    const data = await req.json();
    console.log('Received request body:', JSON.stringify(data));

    // Add default values for required fields
    const dataWithDefaults = {
      ...data,
      descricao: data.descricao || 'Nova categoria de risco',
      instrumentosASeremDesenvolvidos:
        data.instrumentosASeremDesenvolvidos || '',
      projectId: projectId || null,
    };

    console.log('Data with defaults:', JSON.stringify(dataWithDefaults));

    // Validate the data
    const validationResult = resultadoTriagemSchema.safeParse(dataWithDefaults);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return NextResponse.json(
        {
          error: 'Dados de entrada inválidos',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('Validated data:', JSON.stringify(validatedData));

    // Check if categoriaRisco already exists for this subproject
    const existingResultado = await db.resultadoTriagem.findFirst({
      where: {
        categoriaRisco: validatedData.categoriaRisco,
        subprojectoId: validatedData.subprojectoId,
        tenantId: tenantId,
      },
    });

    if (existingResultado) {
      console.log(
        'Duplicate resultado found:',
        JSON.stringify(existingResultado)
      );
      return NextResponse.json(
        {
          error:
            'Já existe um resultado de triagem com esta categoria para este subprojeto',
        },
        { status: 400 }
      );
    }

    // Create the resultado triagem
    console.log(
      'Creating new resultado triagem with data:',
      JSON.stringify(validatedData)
    );
    const newResultado = await db.resultadoTriagem.create({
      data: {
        categoriaRisco: validatedData.categoriaRisco,
        descricao: validatedData.descricao,
        instrumentosASeremDesenvolvidos:
          validatedData.instrumentosASeremDesenvolvidos,
        subprojectoId: validatedData.subprojectoId,
        tenantId: tenantId,
        projectId: validatedData.projectId,
      },
    });

    console.log('Created new resultado triagem:', JSON.stringify(newResultado));
    return NextResponse.json(newResultado, { status: 201 });
  } catch (error) {
    console.error('Error creating resultado triagem:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: `Erro ao criar resultado de triagem: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`,
      },
      { status: 500 }
    );
  }
}
