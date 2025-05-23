// app/api/forms/ficha-ambiental/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createContextualPrismaClient } from '@/lib/db-context';
import { fichaInformacaoAmbientalSchema } from '@/lib/validations/ficha-ambiental';

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
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findMany({
        where: whereClause,
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
    const validationResult = fichaInformacaoAmbientalSchema.safeParse(data);

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

    // Create the record
    const newRecord = await db.fichaInformacaoAmbientalPreliminar.create({
      data: {
        tenantId: validatedData.tenantId,
        projectId: validatedData.projectId,

        // Activity information
        nomeActividade: validatedData.nomeActividade,
        tipoActividade: validatedData.tipoActividade,
        proponentes: validatedData.proponentes,

        // Contact information
        endereco: validatedData.endereco,
        telefone: validatedData.telefone,
        fax: validatedData.fax,
        telemovel: validatedData.telemovel,
        email: validatedData.email,

        // Location information
        bairroActividade: validatedData.bairroActividade,
        vilaActividade: validatedData.vilaActividade,
        cidadeActividade: validatedData.cidadeActividade,
        localidadeActividade: validatedData.localidadeActividade,
        distritoActividade: validatedData.distritoActividade,
        provinciaActividade: validatedData.provinciaActividade,
        coordenadasGeograficas: validatedData.coordenadasGeograficas,

        // Environmental context
        meioInsercao: validatedData.meioInsercao,
        enquadramentoOrcamentoTerritorial:
          validatedData.enquadramentoOrcamentoTerritorial,

        // Activity description
        descricaoActividade: validatedData.descricaoActividade,
        actividadesAssociadas: validatedData.actividadesAssociadas,
        descricaoTecnologiaConstrucaoOperacao:
          validatedData.descricaoTecnologiaConstrucaoOperacao,
        actividadesComplementaresPrincipais:
          validatedData.actividadesComplementaresPrincipais,

        // Resources and materials
        tipoQuantidadeOrigemMaoDeObra:
          validatedData.tipoQuantidadeOrigemMaoDeObra,
        tipoQuantidadeOrigemProvenienciaMateriasPrimas:
          validatedData.tipoQuantidadeOrigemProvenienciaMateriasPrimas,
        quimicosUtilizados: validatedData.quimicosUtilizados,
        tipoOrigemConsumoAguaEnergia:
          validatedData.tipoOrigemConsumoAguaEnergia,
        origemCombustiveisLubrificantes:
          validatedData.origemCombustiveisLubrificantes,
        outrosRecursosNecessarios: validatedData.outrosRecursosNecessarios,

        // Land and locations
        posseDeTerra: validatedData.posseDeTerra,
        alternativasLocalizacaoActividade:
          validatedData.alternativasLocalizacaoActividade,

        // Environmental situation
        descricaoBreveSituacaoAmbientalReferenciaLocalRegional:
          validatedData.descricaoBreveSituacaoAmbientalReferenciaLocalRegional,
        caracteristicasFisicasLocalActividade:
          validatedData.caracteristicasFisicasLocalActividade,
        ecosistemasPredominantes: validatedData.ecosistemasPredominantes,
        zonaLocalizacao: validatedData.zonaLocalizacao,
        tipoVegetacaoPredominante: validatedData.tipoVegetacaoPredominante,
        usoSolo: validatedData.usoSolo,

        // Infrastructure and complementary information
        infraestruturaExistenteAreaActividade:
          validatedData.infraestruturaExistenteAreaActividade,
        informacaoComplementarAtravesMaps:
          validatedData.informacaoComplementarAtravesMaps,

        // Investment value
        valorTotalInvestimento: validatedData.valorTotalInvestimento,
      },
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
    const validationResult = fichaInformacaoAmbientalSchema.safeParse(data);

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
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Update the record
    const updatedRecord = await db.fichaInformacaoAmbientalPreliminar.update({
      where: { id },
      data: {
        // Activity information
        nomeActividade: validatedData.nomeActividade,
        tipoActividade: validatedData.tipoActividade,
        proponentes: validatedData.proponentes,

        // Contact information
        endereco: validatedData.endereco,
        telefone: validatedData.telefone,
        fax: validatedData.fax,
        telemovel: validatedData.telemovel,
        email: validatedData.email,

        // Location information
        bairroActividade: validatedData.bairroActividade,
        vilaActividade: validatedData.vilaActividade,
        cidadeActividade: validatedData.cidadeActividade,
        localidadeActividade: validatedData.localidadeActividade,
        distritoActividade: validatedData.distritoActividade,
        provinciaActividade: validatedData.provinciaActividade,
        coordenadasGeograficas: validatedData.coordenadasGeograficas,

        // Environmental context
        meioInsercao: validatedData.meioInsercao,
        enquadramentoOrcamentoTerritorial:
          validatedData.enquadramentoOrcamentoTerritorial,

        // Activity description
        descricaoActividade: validatedData.descricaoActividade,
        actividadesAssociadas: validatedData.actividadesAssociadas,
        descricaoTecnologiaConstrucaoOperacao:
          validatedData.descricaoTecnologiaConstrucaoOperacao,
        actividadesComplementaresPrincipais:
          validatedData.actividadesComplementaresPrincipais,

        // Resources and materials
        tipoQuantidadeOrigemMaoDeObra:
          validatedData.tipoQuantidadeOrigemMaoDeObra,
        tipoQuantidadeOrigemProvenienciaMateriasPrimas:
          validatedData.tipoQuantidadeOrigemProvenienciaMateriasPrimas,
        quimicosUtilizados: validatedData.quimicosUtilizados,
        tipoOrigemConsumoAguaEnergia:
          validatedData.tipoOrigemConsumoAguaEnergia,
        origemCombustiveisLubrificantes:
          validatedData.origemCombustiveisLubrificantes,
        outrosRecursosNecessarios: validatedData.outrosRecursosNecessarios,

        // Land and locations
        posseDeTerra: validatedData.posseDeTerra,
        alternativasLocalizacaoActividade:
          validatedData.alternativasLocalizacaoActividade,

        // Environmental situation
        descricaoBreveSituacaoAmbientalReferenciaLocalRegional:
          validatedData.descricaoBreveSituacaoAmbientalReferenciaLocalRegional,
        caracteristicasFisicasLocalActividade:
          validatedData.caracteristicasFisicasLocalActividade,
        ecosistemasPredominantes: validatedData.ecosistemasPredominantes,
        zonaLocalizacao: validatedData.zonaLocalizacao,
        tipoVegetacaoPredominante: validatedData.tipoVegetacaoPredominante,
        usoSolo: validatedData.usoSolo,

        // Infrastructure and complementary information
        infraestruturaExistenteAreaActividade:
          validatedData.infraestruturaExistenteAreaActividade,
        informacaoComplementarAtravesMaps:
          validatedData.informacaoComplementarAtravesMaps,

        // Investment value
        valorTotalInvestimento: validatedData.valorTotalInvestimento,
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
      await contextualPrisma.fichaInformacaoAmbientalPreliminar.findFirst({
        where: { id },
      });

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro não encontrado ou sem permissão' },
        { status: 404 }
      );
    }

    // Delete the record
    await db.fichaInformacaoAmbientalPreliminar.delete({
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
