// app/api/biodiversidade-recursos/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { biodiversidadeRecursosSchema } from '@/lib/validations/biodiversidade-recursos';

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
        const record =
          await contextualPrisma.biodeversidadeRecursosNaturais.findUnique({
            where: { id },
          });

        if (!record) {
          return NextResponse.json(
            { error: 'Recurso não encontrado' },
            { status: 404 }
          );
        }

        return NextResponse.json(record);
      } else {
        // Get all records for tenant
        const records =
          await contextualPrisma.biodeversidadeRecursosNaturais.findMany({
            orderBy: {
              reference: 'asc',
            },
          });

        return NextResponse.json(records);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          error: 'Erro ao buscar recursos de biodiversidade no banco de dados',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching biodiversidade recursos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar recursos de biodiversidade' },
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
    const validationResult = biodiversidadeRecursosSchema.safeParse(data);

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

    // Check if reference already exists for this tenant
    const contextualPrisma = createContextualPrismaClient({
      tenantId: tenantId,
    });

    const existingResource =
      await contextualPrisma.biodeversidadeRecursosNaturais.findMany({
        where: {
          reference: validatedData.reference,
        },
      });

    if (existingResource.length > 0) {
      return NextResponse.json(
        { error: 'Já existe um recurso com esta referência' },
        { status: 400 }
      );
    }

    // Create the resource
    const newResource = await db.biodeversidadeRecursosNaturais.create({
      data: {
        reference: validatedData.reference,
        description: validatedData.description,
        tenantId: validatedData.tenantId,
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('Error creating biodiversidade recurso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar recurso de biodiversidade' },
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
    const validationResult = biodiversidadeRecursosSchema.safeParse(data);

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
      tenantId: tenantId,
    });

    // Check if the resource exists and belongs to the tenant
    const existingResource =
      await contextualPrisma.biodeversidadeRecursosNaturais.findUnique({
        where: { id },
      });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Check if reference already exists for another record
    if (existingResource.reference !== validatedData.reference) {
      const duplicateReferences =
        await contextualPrisma.biodeversidadeRecursosNaturais.findMany({
          where: {
            reference: validatedData.reference,
            id: { not: id },
          },
        });

      if (duplicateReferences.length > 0) {
        return NextResponse.json(
          { error: 'Já existe um recurso com esta referência' },
          { status: 400 }
        );
      }
    }

    // Update the resource
    const updatedResource = await db.biodeversidadeRecursosNaturais.update({
      where: { id },
      data: {
        reference: validatedData.reference,
        description: validatedData.description,
      },
    });

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error updating biodiversidade recurso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar recurso de biodiversidade' },
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
      tenantId: tenantId,
    });

    // Check if the resource exists and belongs to the tenant
    const existingResource =
      await contextualPrisma.biodeversidadeRecursosNaturais.findUnique({
        where: { id },
      });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Check if this resource is used in any risk identification
    const relatedRecords =
      await db.identificacaoRiscosImpactosAmbientaisESociaisSubproject.findMany(
        {
          where: {
            biodiversidadeRecursosNaturaisId: id,
          },
          take: 1,
        }
      );

    if (relatedRecords.length > 0) {
      return NextResponse.json(
        {
          error:
            'Este recurso não pode ser excluído porque está sendo usado em uma ou mais avaliações de risco.',
        },
        { status: 400 }
      );
    }

    // Delete the resource
    await db.biodeversidadeRecursosNaturais.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting biodiversidade recurso:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir recurso de biodiversidade' },
      { status: 500 }
    );
  }
}
