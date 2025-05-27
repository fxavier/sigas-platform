// app/api/forms/ficha-registo-queixas-reclamacoes/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { fichaRegistoQueixasReclamacoesSchema } from '@/lib/validations/ficha-registo-queixas-reclamacoes';

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

    const fichasRegistoQueixas =
      await db.fichaRegistoQueixasReclamacoes.findMany({
        where: {
          tenantId,
          projectId,
        },
        include: {
          categoriaQueixa: true,
          subcategoriaQueixa: true,
          resolucaoQueixa: true,
          fotosDocumentosComprovativoEncerramento: true,
        },
        orderBy: {
          dataReclamacao: 'desc',
        },
      });

    return NextResponse.json(fichasRegistoQueixas);
  } catch (error) {
    console.error('[FICHA_REGISTO_QUEIXAS_GET]', error);
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
    const validatedData = fichaRegistoQueixasReclamacoesSchema.parse(body);

    const {
      tenantId,
      projectId,
      numeroQueixa,
      nomeCompletoReclamante,
      genero,
      idade,
      celular,
      email,
      endereco,
      quarteirao,
      bairro,
      localidade,
      postoAdministrativo,
      distrito,
      local,
      dataReclamacao,
      hora,
      breveDescricaoFactos,
      queixaAceita,
      justificativaParaRejeicao,
      reclamanteNotificado,
      metodoNotificacao,
      outroMetodoNotificacao,
      categoriaQueixaId,
      descricao_factos_apos_investigacao,
      dataEncerramento,
      reclamanteNotificadoSobreEncerramento,
      reclamanteSatisfeito,
      recursosGastosReparacaoReclamacao,
      dataEncerramentoReclamacao,
      diasDesdeQueixaAoEncerramento,
      monitoriaAposEncerramento,
      accaoMonitoriaAposEncerramento,
      responsavelMonitoriaAposEncerramento,
      prazoMonitoriaAposEncerramento,
      estadoMonitoriaAposEncerramento,
      accoesPreventivasSugeridas,
      responsavelAccoesPreventivasSugeridas,
      prazoAccoesPreventivasSugeridas,
      estadoAccoesPreventivasSugeridas,
      subcategoriaQueixaIds = [],
      resolucaoQueixaIds = [],
      fotosDocumentosComprovativoEncerramentoIds = [],
    } = validatedData;

    // Create the ficha registo queixas reclamacoes
    const fichaRegistoQueixas = await db.fichaRegistoQueixasReclamacoes.create({
      data: {
        tenantId,
        projectId,
        numeroQueixa,
        nomeCompletoReclamante,
        genero,
        idade,
        celular,
        email,
        endereco,
        quarteirao,
        bairro,
        localidade,
        postoAdministrativo,
        distrito,
        local,
        dataReclamacao,
        hora,
        breveDescricaoFactos,
        queixaAceita,
        justificativaParaRejeicao,
        reclamanteNotificado,
        metodoNotificacao,
        outroMetodoNotificacao,
        categoriaQueixaId,
        descricao_factos_apos_investigacao,
        dataEncerramento,
        reclamanteNotificadoSobreEncerramento,
        reclamanteSatisfeito,
        recursosGastosReparacaoReclamacao,
        dataEncerramentoReclamacao,
        diasDesdeQueixaAoEncerramento,
        monitoriaAposEncerramento,
        accaoMonitoriaAposEncerramento,
        responsavelMonitoriaAposEncerramento,
        prazoMonitoriaAposEncerramento,
        estadoMonitoriaAposEncerramento,
        accoesPreventivasSugeridas,
        responsavelAccoesPreventivasSugeridas,
        prazoAccoesPreventivasSugeridas,
        estadoAccoesPreventivasSugeridas,
        // Create relationships
        subcategoriaQueixa: {
          connect: subcategoriaQueixaIds.map((id) => ({ id })),
        },
      },
      include: {
        categoriaQueixa: true,
        subcategoriaQueixa: true,
        resolucaoQueixa: true,
        fotosDocumentosComprovativoEncerramento: true,
      },
    });

    return NextResponse.json(fichaRegistoQueixas);
  } catch (error) {
    console.error('[FICHA_REGISTO_QUEIXAS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
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

    const body = await req.json();
    const validatedData = fichaRegistoQueixasReclamacoesSchema.parse(body);

    const {
      tenantId,
      projectId,
      numeroQueixa,
      nomeCompletoReclamante,
      genero,
      idade,
      celular,
      email,
      endereco,
      quarteirao,
      bairro,
      localidade,
      postoAdministrativo,
      distrito,
      local,
      dataReclamacao,
      hora,
      breveDescricaoFactos,
      queixaAceita,
      justificativaParaRejeicao,
      reclamanteNotificado,
      metodoNotificacao,
      outroMetodoNotificacao,
      categoriaQueixaId,
      descricao_factos_apos_investigacao,
      dataEncerramento,
      reclamanteNotificadoSobreEncerramento,
      reclamanteSatisfeito,
      recursosGastosReparacaoReclamacao,
      dataEncerramentoReclamacao,
      diasDesdeQueixaAoEncerramento,
      monitoriaAposEncerramento,
      accaoMonitoriaAposEncerramento,
      responsavelMonitoriaAposEncerramento,
      prazoMonitoriaAposEncerramento,
      estadoMonitoriaAposEncerramento,
      accoesPreventivasSugeridas,
      responsavelAccoesPreventivasSugeridas,
      prazoAccoesPreventivasSugeridas,
      estadoAccoesPreventivasSugeridas,
      subcategoriaQueixaIds = [],
      resolucaoQueixaIds = [],
      fotosDocumentosComprovativoEncerramentoIds = [],
    } = validatedData;

    // Update the ficha registo queixas reclamacoes
    const fichaRegistoQueixas = await db.fichaRegistoQueixasReclamacoes.update({
      where: {
        id,
      },
      data: {
        numeroQueixa,
        nomeCompletoReclamante,
        genero,
        idade,
        celular,
        email,
        endereco,
        quarteirao,
        bairro,
        localidade,
        postoAdministrativo,
        distrito,
        local,
        dataReclamacao,
        hora,
        breveDescricaoFactos,
        queixaAceita,
        justificativaParaRejeicao,
        reclamanteNotificado,
        metodoNotificacao,
        outroMetodoNotificacao,
        categoriaQueixaId,
        descricao_factos_apos_investigacao,
        dataEncerramento,
        reclamanteNotificadoSobreEncerramento,
        reclamanteSatisfeito,
        recursosGastosReparacaoReclamacao,
        dataEncerramentoReclamacao,
        diasDesdeQueixaAoEncerramento,
        monitoriaAposEncerramento,
        accaoMonitoriaAposEncerramento,
        responsavelMonitoriaAposEncerramento,
        prazoMonitoriaAposEncerramento,
        estadoMonitoriaAposEncerramento,
        accoesPreventivasSugeridas,
        responsavelAccoesPreventivasSugeridas,
        prazoAccoesPreventivasSugeridas,
        estadoAccoesPreventivasSugeridas,
        // Update relationships
        subcategoriaQueixa: {
          set: [], // Clear existing
          connect: subcategoriaQueixaIds.map((id) => ({ id })),
        },
      },
      include: {
        categoriaQueixa: true,
        subcategoriaQueixa: true,
        resolucaoQueixa: true,
        fotosDocumentosComprovativoEncerramento: true,
      },
    });

    return NextResponse.json(fichaRegistoQueixas);
  } catch (error) {
    console.error('[FICHA_REGISTO_QUEIXAS_PUT]', error);
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

    await db.fichaRegistoQueixasReclamacoes.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[FICHA_REGISTO_QUEIXAS_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
