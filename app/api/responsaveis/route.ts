// app/api/responsaveis/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { z } from 'zod';

// Schema for validation
const responsavelSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  funcao: z.string().optional().default('A definir'),
  contacto: z.string().optional().default(''),
  data: z.coerce.date().default(() => new Date()),
  assinatura: z.string().optional().nullable(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const tipo = searchParams.get('tipo'); // 'preenchimento' or 'verificacao'
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
        let record;

        if (tipo === 'preenchimento' || !tipo) {
          record =
            await contextualPrisma.responsavelPeloPreenchimento.findUnique({
              where: { id },
            });
        } else if (tipo === 'verificacao') {
          record = await contextualPrisma.responsavelPelaVerificacao.findUnique(
            {
              where: { id },
            }
          );
        }

        if (!record) {
          return NextResponse.json(
            { error: 'Responsável não encontrado' },
            { status: 404 }
          );
        }

        return NextResponse.json(record);
      } else {
        // Get all records for tenant
        let records;

        if (tipo === 'preenchimento' || !tipo) {
          records =
            await contextualPrisma.responsavelPeloPreenchimento.findMany({
              orderBy: {
                nome: 'asc',
              },
            });
        } else if (tipo === 'verificacao') {
          records = await contextualPrisma.responsavelPelaVerificacao.findMany({
            orderBy: {
              nome: 'asc',
            },
          });
        } else {
          // If no specific type is requested, return preenchimento records as default
          records =
            await contextualPrisma.responsavelPeloPreenchimento.findMany({
              orderBy: {
                nome: 'asc',
              },
            });
        }

        return NextResponse.json(records);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Erro ao buscar responsáveis no banco de dados' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching responsáveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar responsáveis' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const tipo = searchParams.get('tipo'); // 'preenchimento' or 'verificacao'

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
      funcao: data.funcao || 'A definir',
      contacto: data.contacto || '',
      data: data.data || new Date(),
    };

    const validationResult = responsavelSchema.safeParse(dataWithDefaults);

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

    // Determine type of responsável to create, defaults to preenchimento
    const createResponsavel = async () => {
      if (tipo === 'verificacao') {
        return await db.responsavelPelaVerificacao.create({
          data: {
            nome: validatedData.nome,
            funcao: validatedData.funcao,
            contacto: validatedData.contacto,
            data: validatedData.data,
            assinatura: validatedData.assinatura,
            tenantId: tenantId,
          },
        });
      } else {
        return await db.responsavelPeloPreenchimento.create({
          data: {
            nome: validatedData.nome,
            funcao: validatedData.funcao,
            contacto: validatedData.contacto,
            data: validatedData.data,
            assinatura: validatedData.assinatura,
            tenantId: tenantId,
          },
        });
      }
    };

    // Create the responsavel
    const newResponsavel = await createResponsavel();
    console.log('Created new responsavel:', JSON.stringify(newResponsavel));

    return NextResponse.json(newResponsavel, { status: 201 });
  } catch (error) {
    console.error('Error creating responsável:', error);
    return NextResponse.json(
      {
        error: `Erro ao criar responsável: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`,
      },
      { status: 500 }
    );
  }
}
