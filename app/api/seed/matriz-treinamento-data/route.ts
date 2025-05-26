import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // Check if data already exists
    const existingAreas = await db.areaTreinamento.findMany({
      where: { tenantId },
    });

    if (existingAreas.length > 0) {
      return NextResponse.json(
        { message: 'Dados já existem para este tenant' },
        { status: 200 }
      );
    }

    // Seed Areas de Treinamento
    const areas = [
      'Segurança e Saúde Ocupacional',
      'Meio Ambiente',
      'Qualidade',
      'Gestão de Projetos',
      'Liderança e Gestão',
      'Técnicas Específicas',
      'Compliance e Regulamentações',
      'Tecnologia da Informação',
    ];

    const createdAreas = await Promise.all(
      areas.map((name) =>
        db.areaTreinamento.create({
          data: {
            name,
            tenantId,
          },
        })
      )
    );

    // Seed Caixa de Ferramentas
    const ferramentas = [
      'Manual de Procedimentos',
      'Checklist de Segurança',
      'Guia de Boas Práticas',
      'Formulários de Controle',
      'Apresentações Técnicas',
      'Vídeos Instrucionais',
      'Simuladores',
      'Documentos de Referência',
    ];

    const createdFerramentas = await Promise.all(
      ferramentas.map((name) =>
        db.caixaFerramentas.create({
          data: {
            name,
            tenantId,
          },
        })
      )
    );

    // Seed Funções
    const funcoes = [
      'Gerente de Projeto',
      'Coordenador de Segurança',
      'Técnico Ambiental',
      'Supervisor de Campo',
      'Operador de Equipamentos',
      'Técnico de Qualidade',
      'Analista de Compliance',
      'Especialista em ESMS',
    ];

    const createdFuncoes = await Promise.all(
      funcoes.map((name) =>
        db.funcao.create({
          data: {
            name,
            tenantId,
          },
        })
      )
    );

    return NextResponse.json({
      message: 'Dados de treinamento criados com sucesso',
      data: {
        areas: createdAreas.length,
        ferramentas: createdFerramentas.length,
        funcoes: createdFuncoes.length,
      },
    });
  } catch (error) {
    console.error('Error seeding matriz treinamento data:', error);
    return NextResponse.json(
      { error: 'Erro ao criar dados de treinamento' },
      { status: 500 }
    );
  }
}
