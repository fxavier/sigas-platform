// app/api/subprojectos/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

// Schema for validation
const subprojetoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  referenciaDoContracto: z.string().optional().nullable(),
  nomeEmpreiteiro: z.string().optional().nullable(),
  custoEstimado: z.number().optional().nullable(),
  localizacao: z.string().default('A definir'),
  coordenadasGeograficas: z.string().optional().nullable(),
  tipoSubprojecto: z.string().default('A definir'),
  areaAproximada: z.string().default('A definir'),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
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
        const record = await contextualPrisma.subprojecto.findUnique({
          where: { id },
        });

        if (!record) {
          return NextResponse.json(
            { error: 'Subprojeto não encontrado' },
            { status: 404 }
          );
        }

        return NextResponse.json(record);
      } else {
        // Get all records for tenant
        const records = await contextualPrisma.subprojecto.findMany({
          orderBy: {
            nome: 'asc',
          },
        });

        return NextResponse.json(records);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Erro ao buscar subprojetos no banco de dados' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching subprojetos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar subprojetos' },
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
    console.log('Received request body:', JSON.stringify(data));

    // Add default values for required fields
    const dataWithDefaults = {
      ...data,
      localizacao: data.localizacao || 'A definir',
      tipoSubprojecto: data.tipoSubprojecto || 'A definir',
      areaAproximada: data.areaAproximada || 'A definir',
    };

    // Validate the data
    const validationResult = subprojetoSchema.safeParse(dataWithDefaults);

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

    // Check if name already exists for this tenant
    const existingSubprojeto = await db.subprojecto.findFirst({
      where: {
        nome: validatedData.nome,
        tenantId: tenantId,
      },
    });

    if (existingSubprojeto) {
      return NextResponse.json(
        { error: 'Já existe um subprojeto com este nome' },
        { status: 400 }
      );
    }

    // Create the subprojeto
    const newSubprojeto = await db.subprojecto.create({
      data: {
        nome: validatedData.nome,
        localizacao: validatedData.localizacao,
        tipoSubprojecto: validatedData.tipoSubprojecto,
        areaAproximada: validatedData.areaAproximada,
        referenciaDoContracto: validatedData.referenciaDoContracto,
        nomeEmpreiteiro: validatedData.nomeEmpreiteiro,
        custoEstimado: validatedData.custoEstimado,
        coordenadasGeograficas: validatedData.coordenadasGeograficas,
        tenantId: tenantId,
      },
    });

    console.log('Created new subprojeto:', JSON.stringify(newSubprojeto));
    return NextResponse.json(newSubprojeto, { status: 201 });
  } catch (error) {
    console.error('Error creating subprojeto:', error);
    return NextResponse.json(
      {
        error: `Erro ao criar subprojeto: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`,
      },
      { status: 500 }
    );
  }
}
