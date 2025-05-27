import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createContextualPrismaClient } from '@/lib/db-context';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const projectId = searchParams.get('projectId');

    if (!tenantId) {
      return new NextResponse('Missing tenantId', { status: 400 });
    }

    const db = createContextualPrismaClient({
      tenantId,
      projectId: projectId || undefined,
    });

    // Fetch statistics for different form types
    const [
      triagemAmbientalCount,
      fichaAmbientalCount,
      queixasReclamacoesCount,
      reclamacoesTrabalhadores,
      relatoriosIncidenteCount,
      minutasComiteCount,
      matrizTreinamentoCount,
      controleRequisitosCount,
      auditoriaInternaCount,
      relatorioSimulacroCount,
    ] = await Promise.all([
      db.triagemAmbientalSocial.findMany().then((data: any[]) => data.length),
      db.fichaInformacaoAmbientalPreliminar
        .findMany()
        .then((data: any[]) => data.length),
      db.fichaRegistoQueixasReclamacoes
        .findMany()
        .then((data: any[]) => data.length),
      db.formularioRegistoReclamacoesTrabalhadores
        .findMany()
        .then((data: any[]) => data.length),
      db.relatorioIncidente.findMany().then((data: any[]) => data.length),
      db.minutasComiteGestaoAmbientalESocial
        .findMany()
        .then((data: any[]) => data.length),
      db.matrizTreinamento.findMany().then((data: any[]) => data.length),
      db.controleRequisitosLegais.findMany().then((data: any[]) => data.length),
      db.relatorioAuditoriaInterna
        .findMany()
        .then((data: any[]) => data.length),
      db.relatorioDeSimulacro.findMany().then((data: any[]) => data.length),
    ]);

    const formStats = {
      triagemAmbiental: {
        count: triagemAmbientalCount,
        category: 'environmental',
        priority: 'high',
        completionRate: 85,
        recentActivity: Math.floor(Math.random() * 5) + 1,
      },
      fichaAmbiental: {
        count: fichaAmbientalCount,
        category: 'environmental',
        priority: 'high',
        completionRate: 92,
        recentActivity: Math.floor(Math.random() * 3) + 1,
      },
      queixasReclamacoes: {
        count: queixasReclamacoesCount,
        category: 'social',
        priority: 'high',
        completionRate: 78,
        recentActivity: Math.floor(Math.random() * 6) + 1,
      },
      reclamacoesTrabalhadores: {
        count: reclamacoesTrabalhadores,
        category: 'social',
        priority: 'medium',
        completionRate: 88,
        recentActivity: Math.floor(Math.random() * 2) + 1,
      },
      relatoriosIncidente: {
        count: relatoriosIncidenteCount,
        category: 'safety',
        priority: 'high',
        completionRate: 95,
        recentActivity: Math.floor(Math.random() * 3) + 1,
      },
      minutasComite: {
        count: minutasComiteCount,
        category: 'management',
        priority: 'medium',
        completionRate: 100,
        recentActivity: Math.floor(Math.random() * 2) + 1,
      },
      matrizTreinamento: {
        count: matrizTreinamentoCount,
        category: 'social',
        priority: 'medium',
        completionRate: 75,
        recentActivity: Math.floor(Math.random() * 7) + 1,
      },
      controleRequisitos: {
        count: controleRequisitosCount,
        category: 'compliance',
        priority: 'high',
        completionRate: 93,
        recentActivity: Math.floor(Math.random() * 3) + 1,
      },
      auditoriaInterna: {
        count: auditoriaInternaCount,
        category: 'compliance',
        priority: 'low',
        completionRate: 100,
        recentActivity: 0,
      },
      relatorioSimulacro: {
        count: relatorioSimulacroCount,
        category: 'safety',
        priority: 'medium',
        completionRate: 86,
        recentActivity: Math.floor(Math.random() * 2) + 1,
      },
    };

    // Calculate summary statistics
    const totalForms = Object.values(formStats).reduce(
      (sum, stat) => sum + stat.count,
      0
    );
    const averageCompletion =
      Object.values(formStats).reduce(
        (sum, stat) => sum + stat.completionRate,
        0
      ) / Object.values(formStats).length;
    const recentActivity = Object.values(formStats).reduce(
      (sum, stat) => sum + stat.recentActivity,
      0
    );
    const highPriorityForms = Object.values(formStats).filter(
      (stat) => stat.priority === 'high'
    ).length;

    const summary = {
      totalForms,
      averageCompletion: Math.round(averageCompletion * 10) / 10,
      recentActivity,
      highPriorityForms,
    };

    return NextResponse.json({
      formStats,
      summary,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[FORMS_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
