// app/api/forms/formulario-registo-reclamacoes-trabalhadores/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { formularioRegistoReclamacoesTrabalhadoresSchema } from '@/lib/validations/formulario-registo-reclamacoes-trabalhadores';

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

    const formulariosRegistoReclamacoes =
      await db.formularioRegistoReclamacoesTrabalhadores.findMany({
        where: {
          tenantId,
          projectId,
        },
        orderBy: {
          dataReclamacao: 'desc',
        },
      });

    return NextResponse.json(formulariosRegistoReclamacoes);
  } catch (error) {
    console.error('[FORMULARIO_REGISTO_RECLAMACOES_TRABALHADORES_GET]', error);
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
    const validatedData =
      formularioRegistoReclamacoesTrabalhadoresSchema.parse(body);

    const {
      tenantId,
      projectId,
      nome,
      empresa,
      dataReclamacao,
      horaReclamacao,
      metodoPreferidoDoContacto,
      detalhesDoContacto,
      linguaPreferida,
      outraLinguaPreferida,
      detalhesDareclamacao,
      numeroIdentificacaoResponsavelRecepcao,
      nomeResponsavelRecepcao,
      funcaoResponsavelRecepcao,
      assinaturaResponsavelRecepcao,
      dataRecepcao,
      detalhesResponsavelRecepcao,
      detalhesAcompanhamento,
      dataEncerramento,
      assinatura,
      confirmarRecepcaoResposta,
      nomeDoConfirmante,
      dataConfirmacao,
      assinaturaConfirmacao,
    } = validatedData;

    // Create the formulario registo reclamacoes trabalhadores
    const formularioRegistoReclamacoes =
      await db.formularioRegistoReclamacoesTrabalhadores.create({
        data: {
          tenantId,
          projectId,
          nome,
          empresa,
          dataReclamacao,
          horaReclamacao,
          metodoPreferidoDoContacto,
          detalhesDoContacto,
          linguaPreferida,
          outraLinguaPreferida,
          detalhesDareclamacao,
          numeroIdentificacaoResponsavelRecepcao,
          nomeResponsavelRecepcao,
          funcaoResponsavelRecepcao,
          assinaturaResponsavelRecepcao,
          dataRecepcao,
          detalhesResponsavelRecepcao,
          detalhesAcompanhamento,
          dataEncerramento,
          assinatura,
          confirmarRecepcaoResposta,
          nomeDoConfirmante,
          dataConfirmacao,
          assinaturaConfirmacao,
        },
      });

    return NextResponse.json(formularioRegistoReclamacoes);
  } catch (error) {
    console.error('[FORMULARIO_REGISTO_RECLAMACOES_TRABALHADORES_POST]', error);
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
    const validatedData =
      formularioRegistoReclamacoesTrabalhadoresSchema.parse(body);

    const {
      nome,
      empresa,
      dataReclamacao,
      horaReclamacao,
      metodoPreferidoDoContacto,
      detalhesDoContacto,
      linguaPreferida,
      outraLinguaPreferida,
      detalhesDareclamacao,
      numeroIdentificacaoResponsavelRecepcao,
      nomeResponsavelRecepcao,
      funcaoResponsavelRecepcao,
      assinaturaResponsavelRecepcao,
      dataRecepcao,
      detalhesResponsavelRecepcao,
      detalhesAcompanhamento,
      dataEncerramento,
      assinatura,
      confirmarRecepcaoResposta,
      nomeDoConfirmante,
      dataConfirmacao,
      assinaturaConfirmacao,
    } = validatedData;

    // Update the formulario registo reclamacoes trabalhadores
    const formularioRegistoReclamacoes =
      await db.formularioRegistoReclamacoesTrabalhadores.update({
        where: {
          id,
        },
        data: {
          nome,
          empresa,
          dataReclamacao,
          horaReclamacao,
          metodoPreferidoDoContacto,
          detalhesDoContacto,
          linguaPreferida,
          outraLinguaPreferida,
          detalhesDareclamacao,
          numeroIdentificacaoResponsavelRecepcao,
          nomeResponsavelRecepcao,
          funcaoResponsavelRecepcao,
          assinaturaResponsavelRecepcao,
          dataRecepcao,
          detalhesResponsavelRecepcao,
          detalhesAcompanhamento,
          dataEncerramento,
          assinatura,
          confirmarRecepcaoResposta,
          nomeDoConfirmante,
          dataConfirmacao,
          assinaturaConfirmacao,
        },
      });

    return NextResponse.json(formularioRegistoReclamacoes);
  } catch (error) {
    console.error('[FORMULARIO_REGISTO_RECLAMACOES_TRABALHADORES_PUT]', error);
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

    await db.formularioRegistoReclamacoesTrabalhadores.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(
      '[FORMULARIO_REGISTO_RECLAMACOES_TRABALHADORES_DELETE]',
      error
    );
    return new NextResponse('Internal Error', { status: 500 });
  }
}
