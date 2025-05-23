// app/api/forms/relatorio-incidente/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { relatorioIncidenteSchema } from '@/lib/validations/relatorio-incidente';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId || !projectId) {
      return new NextResponse('Missing tenantId or projectId', { status: 400 });
    }

    const relatoriosIncidente = await db.relatorioIncidente.findMany({
      where: {
        tenantId,
        projectId,
      },
      include: {
        equipaInvestigacaoIncidente: {
          include: {
            pessoaEnvolvida: true,
          },
        },
        accoesCorrectivasPermanentesTomar: {
          include: {
            accaoCorrectiva: true,
          },
        },
        fotografias: {
          include: {
            fotografia: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(relatoriosIncidente);
  } catch (error) {
    console.error('[RELATORIO_INCIDENTE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = relatorioIncidenteSchema.parse(body);

    const {
      tenantId,
      projectId,
      dataIncidente,
      horaIncident,
      descricaoDoIncidente,
      detalhesLesao,
      accoesImediatasTomadas,
      tipoFuncionario,
      categoriaPessoaEnvolvida,
      formaActividade,
      foiRealizadaAvaliacaoRisco,
      existePadraoControleRisco,
      efeitosIncidenteReal,
      esteFoiIncidenteSemBarreira,
      foiIncidenteRepetitivo,
      foiIncidenteResultanteFalhaProcesso,
      danosMateriais,
      valorDanos,
      pessoasEnvolvidasIds = [],
      accoesCorrectivasIds = [],
      fotografiasIds = [],
    } = validatedData;

    // Create the relatorio incidente
    const relatorioIncidente = await db.relatorioIncidente.create({
      data: {
        tenantId,
        projectId,
        dataIncidente,
        horaIncident,
        descricaoDoIncidente,
        detalhesLesao,
        accoesImediatasTomadas,
        tipoFuncionario,
        categoriaPessoaEnvolvida,
        formaActividade,
        foiRealizadaAvaliacaoRisco,
        existePadraoControleRisco,
        efeitosIncidenteReal,
        esteFoiIncidenteSemBarreira,
        foiIncidenteRepetitivo,
        foiIncidenteResultanteFalhaProcesso,
        danosMateriais,
        valorDanos,
        // Create relationships
        equipaInvestigacaoIncidente: {
          create: pessoasEnvolvidasIds.map((id) => ({
            pessoaEnvolvida: {
              connect: { id },
            },
          })),
        },
        accoesCorrectivasPermanentesTomar: {
          create: accoesCorrectivasIds.map((id) => ({
            accaoCorrectiva: {
              connect: { id },
            },
          })),
        },
        fotografias: {
          create: fotografiasIds.map((id) => ({
            fotografia: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        equipaInvestigacaoIncidente: {
          include: {
            pessoaEnvolvida: true,
          },
        },
        accoesCorrectivasPermanentesTomar: {
          include: {
            accaoCorrectiva: true,
          },
        },
        fotografias: {
          include: {
            fotografia: true,
          },
        },
      },
    });

    return NextResponse.json(relatorioIncidente);
  } catch (error) {
    console.error('[RELATORIO_INCIDENTE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = relatorioIncidenteSchema.parse(body);

    const {
      id,
      tenantId,
      projectId,
      dataIncidente,
      horaIncident,
      descricaoDoIncidente,
      detalhesLesao,
      accoesImediatasTomadas,
      tipoFuncionario,
      categoriaPessoaEnvolvida,
      formaActividade,
      foiRealizadaAvaliacaoRisco,
      existePadraoControleRisco,
      efeitosIncidenteReal,
      esteFoiIncidenteSemBarreira,
      foiIncidenteRepetitivo,
      foiIncidenteResultanteFalhaProcesso,
      danosMateriais,
      valorDanos,
      pessoasEnvolvidasIds = [],
      accoesCorrectivasIds = [],
      fotografiasIds = [],
    } = validatedData;

    if (!id) {
      return new NextResponse('Missing id', { status: 400 });
    }

    // Update the relatorio incidente
    const relatorioIncidente = await db.relatorioIncidente.update({
      where: {
        id,
      },
      data: {
        tenantId,
        projectId,
        dataIncidente,
        horaIncident,
        descricaoDoIncidente,
        detalhesLesao,
        accoesImediatasTomadas,
        tipoFuncionario,
        categoriaPessoaEnvolvida,
        formaActividade,
        foiRealizadaAvaliacaoRisco,
        existePadraoControleRisco,
        efeitosIncidenteReal,
        esteFoiIncidenteSemBarreira,
        foiIncidenteRepetitivo,
        foiIncidenteResultanteFalhaProcesso,
        danosMateriais,
        valorDanos,
        // Update relationships
        equipaInvestigacaoIncidente: {
          deleteMany: {},
          create: pessoasEnvolvidasIds.map((id) => ({
            pessoaEnvolvida: {
              connect: { id },
            },
          })),
        },
        accoesCorrectivasPermanentesTomar: {
          deleteMany: {},
          create: accoesCorrectivasIds.map((id) => ({
            accaoCorrectiva: {
              connect: { id },
            },
          })),
        },
        fotografias: {
          deleteMany: {},
          create: fotografiasIds.map((id) => ({
            fotografia: {
              connect: { id },
            },
          })),
        },
      },
      include: {
        equipaInvestigacaoIncidente: {
          include: {
            pessoaEnvolvida: true,
          },
        },
        accoesCorrectivasPermanentesTomar: {
          include: {
            accaoCorrectiva: true,
          },
        },
        fotografias: {
          include: {
            fotografia: true,
          },
        },
      },
    });

    return NextResponse.json(relatorioIncidente);
  } catch (error) {
    console.error('[RELATORIO_INCIDENTE_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing id', { status: 400 });
    }

    await db.relatorioIncidente.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[RELATORIO_INCIDENTE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
