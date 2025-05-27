import { PrismaClient, Prisma } from '@prisma/client';
import { db } from './db';

interface ContextOptions {
  tenantId?: string;
  projectId?: string;
}

/**
 * Creates a contextual Prisma client that automatically filters by tenant and project
 * This helps ensure data isolation between tenants
 */
export function createContextualPrismaClient({
  tenantId,
  projectId,
}: ContextOptions) {
  return {
    ...db,
    $transaction: db.$transaction,
    tenant: {
      ...db.tenant,
      findMany: async (args: Prisma.TenantFindManyArgs = {}) => {
        const where = args.where || {};
        return db.tenant.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { id: tenantId } : {}),
          },
        });
      },
    },
    project: {
      ...db.project,
      findMany: async (args: Prisma.ProjectFindManyArgs = {}) => {
        const where = args.where || {};
        return db.project.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { id: projectId } : {}),
          },
        });
      },
    },
    identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais: {
      ...db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais,
      findMany: async (
        args: Prisma.IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociaisFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.findMany(
          {
            ...args,
            where: {
              ...where,
              ...(tenantId ? { tenantId } : {}),
              ...(projectId ? { projectId } : {}),
            },
          }
        );
      },
      findUnique: async (
        args: Prisma.IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociaisFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item =
          await db.identificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais.findFirst(
            {
              ...args,
              where: {
                id: args.where.id,
                ...(tenantId ? { tenantId } : {}),
              },
            }
          );

        return item;
      },
    },
    riscosImpactos: {
      ...db.riscosImpactos,
      findMany: async (args: Prisma.RiscosImpactosFindManyArgs = {}) => {
        const where = args.where || {};
        return db.riscosImpactos.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    factorAmbientalImpactado: {
      ...db.factorAmbientalImpactado,
      findMany: async (args: any = {}) => {
        const where = args.where || {};
        return db.factorAmbientalImpactado.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    controleRequisitosLegais: {
      ...db.controleRequisitosLegais,
      findMany: async (
        args: Prisma.ControleRequisitosLegaisFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.controleRequisitosLegais.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.ControleRequisitosLegaisFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.controleRequisitosLegais.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.ControleRequisitosLegaisFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.controleRequisitosLegais.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    triagemAmbientalSocial: {
      ...db.triagemAmbientalSocial,
      findMany: async (
        args: Prisma.TriagemAmbientalSocialFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.triagemAmbientalSocial.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.TriagemAmbientalSocialFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.triagemAmbientalSocial.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    // Add BiodeversidadeRecursosNaturais model
    biodeversidadeRecursosNaturais: {
      ...db.biodeversidadeRecursosNaturais,
      findMany: async (
        args: Prisma.BiodeversidadeRecursosNaturaisFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.biodeversidadeRecursosNaturais.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.BiodeversidadeRecursosNaturaisFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.biodeversidadeRecursosNaturais.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.BiodeversidadeRecursosNaturaisFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.biodeversidadeRecursosNaturais.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add IdentificacaoRiscosImpactosAmbientaisESociaisSubproject model
    identificacaoRiscosImpactosAmbientaisESociaisSubproject: {
      ...db.identificacaoRiscosImpactosAmbientaisESociaisSubproject,
      findMany: async (
        args: Prisma.IdentificacaoRiscosImpactosAmbientaisESociaisSubprojectFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.identificacaoRiscosImpactosAmbientaisESociaisSubproject.findMany(
          {
            ...args,
            where: {
              ...where,
              ...(tenantId ? { tenantId } : {}),
            },
          }
        );
      },
      findFirst: async (
        args: Prisma.IdentificacaoRiscosImpactosAmbientaisESociaisSubprojectFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.identificacaoRiscosImpactosAmbientaisESociaisSubproject.findFirst(
          {
            ...args,
            where: {
              ...where,
              ...(tenantId ? { tenantId } : {}),
            },
          }
        );
      },
      findUnique: async (
        args: Prisma.IdentificacaoRiscosImpactosAmbientaisESociaisSubprojectFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item =
          await db.identificacaoRiscosImpactosAmbientaisESociaisSubproject.findFirst(
            {
              ...args,
              where: {
                id: args.where.id,
                ...(tenantId ? { tenantId } : {}),
              },
            }
          );

        return item;
      },
    },
    // Add Subprojecto model
    subprojecto: {
      ...db.subprojecto,
      findMany: async (args: Prisma.SubprojectoFindManyArgs = {}) => {
        const where = args.where || {};
        return db.subprojecto.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.SubprojectoFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.subprojecto.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.SubprojectoFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.subprojecto.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Add ResponsavelPeloPreenchimento model
    responsavelPeloPreenchimento: {
      ...db.responsavelPeloPreenchimento,
      findMany: async (
        args: Prisma.ResponsavelPeloPreenchimentoFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.responsavelPeloPreenchimento.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.ResponsavelPeloPreenchimentoFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.responsavelPeloPreenchimento.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    // Add ResponsavelPelaVerificacao model
    responsavelPelaVerificacao: {
      ...db.responsavelPelaVerificacao,
      findMany: async (
        args: Prisma.ResponsavelPelaVerificacaoFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.responsavelPelaVerificacao.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.ResponsavelPelaVerificacaoFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.responsavelPelaVerificacao.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    // Add FichaInformacaoAmbientalPreliminar model
    fichaInformacaoAmbientalPreliminar: {
      ...db.fichaInformacaoAmbientalPreliminar,
      findMany: async (
        args: Prisma.FichaInformacaoAmbientalPreliminarFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.fichaInformacaoAmbientalPreliminar.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.FichaInformacaoAmbientalPreliminarFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.fichaInformacaoAmbientalPreliminar.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.FichaInformacaoAmbientalPreliminarFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.fichaInformacaoAmbientalPreliminar.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Add ResultadoTriagem model
    resultadoTriagem: {
      ...db.resultadoTriagem,
      findMany: async (args: Prisma.ResultadoTriagemFindManyArgs = {}) => {
        const where = args.where || {};
        return db.resultadoTriagem.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.ResultadoTriagemFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.resultadoTriagem.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
    },
    // Add membrosEquipa model
    membrosEquipa: {
      ...db.membrosEquipa,
      findMany: async (args: Prisma.MembrosEquipaFindManyArgs = {}) => {
        const where = args.where || {};
        return db.membrosEquipa.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.MembrosEquipaFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.membrosEquipa.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.MembrosEquipaFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.membrosEquipa.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Add tabelaAccoes model
    tabelaAccoes: {
      ...db.tabelaAccoes,
      findMany: async (args: Prisma.TabelaAccoesFindManyArgs = {}) => {
        const where = args.where || {};
        return db.tabelaAccoes.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.TabelaAccoesFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.tabelaAccoes.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.TabelaAccoesFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.tabelaAccoes.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Add registoObjectivosMetasAmbientaisSociais model
    registoObjectivosMetasAmbientaisSociais: {
      ...db.registoObjectivosMetasAmbientaisSociais,
      findMany: async (
        args: Prisma.RegistoObjectivosMetasAmbientaisSociaisFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.registoObjectivosMetasAmbientaisSociais.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.RegistoObjectivosMetasAmbientaisSociaisFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.registoObjectivosMetasAmbientaisSociais.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.RegistoObjectivosMetasAmbientaisSociaisFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.registoObjectivosMetasAmbientaisSociais.findFirst(
          {
            ...args,
            where: {
              id: args.where.id,
              ...(tenantId ? { tenantId } : {}),
            },
          }
        );

        return item;
      },
    },
    // Add pessoasEnvolvidasNaInvestigacao model
    pessoasEnvolvidasNaInvestigacao: {
      ...db.pessoasEnvolvidasNaInvestigacao,
      findMany: async (
        args: Prisma.PessoasEnvolvidasNaInvestigacaoFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.pessoasEnvolvidasNaInvestigacao.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.PessoasEnvolvidasNaInvestigacaoFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.pessoasEnvolvidasNaInvestigacao.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.PessoasEnvolvidasNaInvestigacaoFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.pessoasEnvolvidasNaInvestigacao.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Add accoesCorrectivasPermanentesTomar model
    accoesCorrectivasPermanentesTomar: {
      ...db.accoesCorrectivasPermanentesTomar,
      findMany: async (
        args: Prisma.AccoesCorrectivasPermanentesTomarFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.accoesCorrectivasPermanentesTomar.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.AccoesCorrectivasPermanentesTomarFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.accoesCorrectivasPermanentesTomar.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.AccoesCorrectivasPermanentesTomarFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.accoesCorrectivasPermanentesTomar.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },
    // Adicione estas linhas ao createContextualPrismaClient no db-context.ts:

    // Add RelatorioAuditoriaInterna model
    relatorioAuditoriaInterna: {
      ...db.relatorioAuditoriaInterna,
      findMany: async (
        args: Prisma.RelatorioAuditoriaInternaFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.relatorioAuditoriaInterna.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.RelatorioAuditoriaInternaFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.relatorioAuditoriaInterna.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.RelatorioAuditoriaInternaFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.relatorioAuditoriaInterna.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add DescricaoNaoConformidade model
    descricaoNaoConformidade: {
      ...db.descricaoNaoConformidade,
      findMany: async (
        args: Prisma.DescricaoNaoConformidadeFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.descricaoNaoConformidade.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.DescricaoNaoConformidadeFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.descricaoNaoConformidade.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.DescricaoNaoConformidadeFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.descricaoNaoConformidade.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add fotografiasIncidente model
    fotografiasIncidente: {
      ...db.fotografiasIncidente,
      findMany: async (args: Prisma.FotografiasIncidenteFindManyArgs = {}) => {
        const where = args.where || {};
        return db.fotografiasIncidente.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.FotografiasIncidenteFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.fotografiasIncidente.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.FotografiasIncidenteFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.fotografiasIncidente.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Politicas model
    politicas: {
      ...db.politicas,
      findMany: async (args: Prisma.PoliticasFindManyArgs = {}) => {
        const where = args.where || {};
        return db.politicas.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.PoliticasFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.politicas.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.PoliticasFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.politicas.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Manuais model
    manuais: {
      ...db.manuais,
      findMany: async (args: Prisma.ManuaisFindManyArgs = {}) => {
        const where = args.where || {};
        return db.manuais.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.ManuaisFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.manuais.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.ManuaisFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.manuais.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Procedimentos model
    procedimentos: {
      ...db.procedimentos,
      findMany: async (args: Prisma.ProcedimentosFindManyArgs = {}) => {
        const where = args.where || {};
        return db.procedimentos.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.ProcedimentosFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.procedimentos.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.ProcedimentosFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.procedimentos.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Formularios model
    formularios: {
      ...db.formularios,
      findMany: async (args: Prisma.FormulariosFindManyArgs = {}) => {
        const where = args.where || {};
        return db.formularios.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.FormulariosFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.formularios.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.FormulariosFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.formularios.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Modelos model
    modelos: {
      ...db.modelos,
      findMany: async (args: Prisma.ModelosFindManyArgs = {}) => {
        const where = args.where || {};
        return db.modelos.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.ModelosFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.modelos.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.ModelosFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.modelos.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add MatrizTreinamento model
    matrizTreinamento: {
      ...db.matrizTreinamento,
      findMany: async (args: Prisma.MatrizTreinamentoFindManyArgs = {}) => {
        const where = args.where || {};
        return db.matrizTreinamento.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.MatrizTreinamentoFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.matrizTreinamento.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.MatrizTreinamentoFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.matrizTreinamento.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add AreaTreinamento model
    areaTreinamento: {
      ...db.areaTreinamento,
      findMany: async (args: Prisma.AreaTreinamentoFindManyArgs = {}) => {
        const where = args.where || {};
        return db.areaTreinamento.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.AreaTreinamentoFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.areaTreinamento.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.AreaTreinamentoFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.areaTreinamento.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add CaixaFerramentas model
    caixaFerramentas: {
      ...db.caixaFerramentas,
      findMany: async (args: Prisma.CaixaFerramentasFindManyArgs = {}) => {
        const where = args.where || {};
        return db.caixaFerramentas.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.CaixaFerramentasFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.caixaFerramentas.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.CaixaFerramentasFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.caixaFerramentas.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add RelatorioDeSimulacro model
    relatorioDeSimulacro: {
      ...db.relatorioDeSimulacro,
      findMany: async (args: Prisma.RelatorioDeSimulacroFindManyArgs = {}) => {
        const where = args.where || {};
        return db.relatorioDeSimulacro.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.RelatorioDeSimulacroFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.relatorioDeSimulacro.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.RelatorioDeSimulacroFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.relatorioDeSimulacro.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add AvaliacaoClassificacaoEmergencia model
    avaliacaoClassificacaoEmergencia: {
      ...db.avaliacaoClassificacaoEmergencia,
      findMany: async (
        args: Prisma.AvaliacaoClassificacaoEmergenciaFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.avaliacaoClassificacaoEmergencia.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.AvaliacaoClassificacaoEmergenciaFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.avaliacaoClassificacaoEmergencia.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.AvaliacaoClassificacaoEmergenciaFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.avaliacaoClassificacaoEmergencia.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add Recomendacoes model
    recomendacoes: {
      ...db.recomendacoes,
      findMany: async (args: Prisma.RecomendacoesFindManyArgs = {}) => {
        const where = args.where || {};
        return db.recomendacoes.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.RecomendacoesFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.recomendacoes.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.RecomendacoesFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.recomendacoes.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add PerguntaAvaliacaoClassificacaoEmergencia model
    perguntaAvaliacaoClassificacaoEmergencia: {
      ...db.perguntaAvaliacaoClassificacaoEmergencia,
      findMany: async (
        args: Prisma.PerguntaAvaliacaoClassificacaoEmergenciaFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.perguntaAvaliacaoClassificacaoEmergencia.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.PerguntaAvaliacaoClassificacaoEmergenciaFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.perguntaAvaliacaoClassificacaoEmergencia.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.PerguntaAvaliacaoClassificacaoEmergenciaFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item =
          await db.perguntaAvaliacaoClassificacaoEmergencia.findFirst({
            ...args,
            where: {
              id: args.where.id,
              ...(tenantId ? { tenantId } : {}),
            },
          });

        return item;
      },
    },

    // Add Funcao model
    funcao: {
      ...db.funcao,
      findMany: async (args: Prisma.FuncaoFindManyArgs = {}) => {
        const where = args.where || {};
        return db.funcao.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.FuncaoFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.funcao.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.FuncaoFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.funcao.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // ================================
    // NEW STAKEHOLDER-RELATED MODELS
    // ================================

    // Add Categoria model
    categorias: {
      ...db.categoria,
      findMany: async (args: Prisma.CategoriaFindManyArgs = {}) => {
        const where = args.where || {};
        return db.categoria.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.CategoriaFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.categoria.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.CategoriaFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.categoria.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add AreaActuacao model
    areaActuacao: {
      ...db.areaActuacao,
      findMany: async (args: Prisma.AreaActuacaoFindManyArgs = {}) => {
        const where = args.where || {};
        return db.areaActuacao.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.AreaActuacaoFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.areaActuacao.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.AreaActuacaoFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.areaActuacao.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add PrincipaisInteresses model
    principaisInteresses: {
      ...db.principaisInteresses,
      findMany: async (args: Prisma.PrincipaisInteressesFindManyArgs = {}) => {
        const where = args.where || {};
        return db.principaisInteresses.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.PrincipaisInteressesFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.principaisInteresses.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.PrincipaisInteressesFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.principaisInteresses.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add MatrizStakeholder model
    matrizStakeholder: {
      ...db.matrizStakeholder,
      findMany: async (args: Prisma.MatrizStakeholderFindManyArgs = {}) => {
        const where = args.where || {};
        return db.matrizStakeholder.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.MatrizStakeholderFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.matrizStakeholder.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.MatrizStakeholderFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.matrizStakeholder.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add RegistoComunicacoesRelatorioAsPartesInteressadas model
    registoComunicacoesRelatorioAsPartesInteressadas: {
      ...db.registoComunicacoesRelatorioAsPartesInteressadas,
      findMany: async (
        args: Prisma.RegistoComunicacoesRelatorioAsPartesInteressadasFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.registoComunicacoesRelatorioAsPartesInteressadas.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.RegistoComunicacoesRelatorioAsPartesInteressadasFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.registoComunicacoesRelatorioAsPartesInteressadas.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.RegistoComunicacoesRelatorioAsPartesInteressadasFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item =
          await db.registoComunicacoesRelatorioAsPartesInteressadas.findFirst({
            ...args,
            where: {
              id: args.where.id,
              ...(tenantId ? { tenantId } : {}),
            },
          });

        return item;
      },
    },

    // Add MinutasComiteGestaoAmbientalESocial model
    minutasComiteGestaoAmbientalESocial: {
      ...db.minutasComiteGestaoAmbientalESocial,
      findMany: async (
        args: Prisma.MinutasComiteGestaoAmbientalESocialFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.minutasComiteGestaoAmbientalESocial.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.MinutasComiteGestaoAmbientalESocialFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.minutasComiteGestaoAmbientalESocial.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.MinutasComiteGestaoAmbientalESocialFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.minutasComiteGestaoAmbientalESocial.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add ResultadoComiteGestaoAmbientalESocial model
    resultadoComiteGestaoAmbientalESocial: {
      ...db.resultadoComiteGestaoAmbientalESocial,
      findMany: async (
        args: Prisma.ResultadoComiteGestaoAmbientalESocialFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.resultadoComiteGestaoAmbientalESocial.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.ResultadoComiteGestaoAmbientalESocialFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.resultadoComiteGestaoAmbientalESocial.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.ResultadoComiteGestaoAmbientalESocialFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.resultadoComiteGestaoAmbientalESocial.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // ================================
    // FICHA REGISTO QUEIXAS RECLAMAÇÕES MODELS
    // ================================

    // Add FichaRegistoQueixasReclamacoes model
    fichaRegistoQueixasReclamacoes: {
      ...db.fichaRegistoQueixasReclamacoes,
      findMany: async (
        args: Prisma.FichaRegistoQueixasReclamacoesFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.fichaRegistoQueixasReclamacoes.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.FichaRegistoQueixasReclamacoesFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.fichaRegistoQueixasReclamacoes.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.FichaRegistoQueixasReclamacoesFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.fichaRegistoQueixasReclamacoes.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add CategoriaQueixa model
    categoriaQueixa: {
      ...db.categoriaQueixa,
      findMany: async (args: Prisma.CategoriaQueixaFindManyArgs = {}) => {
        const where = args.where || {};
        return db.categoriaQueixa.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.CategoriaQueixaFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.categoriaQueixa.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.CategoriaQueixaFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.categoriaQueixa.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add SubcategoriaQueixa model
    subcategoriaQueixa: {
      ...db.subcategoriaQueixa,
      findMany: async (args: Prisma.SubcategoriaQueixaFindManyArgs = {}) => {
        const where = args.where || {};
        return db.subcategoriaQueixa.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.SubcategoriaQueixaFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.subcategoriaQueixa.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.SubcategoriaQueixaFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.subcategoriaQueixa.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add ResolucaoQueixa model
    resolucaoQueixa: {
      ...db.resolucaoQueixa,
      findMany: async (args: Prisma.ResolucaoQueixaFindManyArgs = {}) => {
        const where = args.where || {};
        return db.resolucaoQueixa.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (args: Prisma.ResolucaoQueixaFindFirstArgs = {}) => {
        const where = args.where || {};
        return db.resolucaoQueixa.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (args: Prisma.ResolucaoQueixaFindUniqueArgs) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.resolucaoQueixa.findFirst({
          ...args,
          where: {
            id: args.where.id,
            ...(tenantId ? { tenantId } : {}),
          },
        });

        return item;
      },
    },

    // Add FotosDocumentosComprovativoEncerramento model
    fotosDocumentosComprovativoEncerramento: {
      ...db.fotosDocumentosComprovativoEncerramento,
      findMany: async (
        args: Prisma.FotosDocumentosComprovativoEncerramentoFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.fotosDocumentosComprovativoEncerramento.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.FotosDocumentosComprovativoEncerramentoFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.fotosDocumentosComprovativoEncerramento.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.FotosDocumentosComprovativoEncerramentoFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item = await db.fotosDocumentosComprovativoEncerramento.findFirst(
          {
            ...args,
            where: {
              id: args.where.id,
              ...(tenantId ? { tenantId } : {}),
            },
          }
        );

        return item;
      },
    },

    // Add this model to your createContextualPrismaClient function in db-context.ts

    // ================================
    // FORMULÁRIO REGISTO RECLAMAÇÕES TRABALHADORES MODEL
    // ================================

    // Add FormularioRegistoReclamacoesTrabalhadores model
    formularioRegistoReclamacoesTrabalhadores: {
      ...db.formularioRegistoReclamacoesTrabalhadores,
      findMany: async (
        args: Prisma.FormularioRegistoReclamacoesTrabalhadoresFindManyArgs = {}
      ) => {
        const where = args.where || {};
        return db.formularioRegistoReclamacoesTrabalhadores.findMany({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
      },
      findFirst: async (
        args: Prisma.FormularioRegistoReclamacoesTrabalhadoresFindFirstArgs = {}
      ) => {
        const where = args.where || {};
        return db.formularioRegistoReclamacoesTrabalhadores.findFirst({
          ...args,
          where: {
            ...where,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      },
      findUnique: async (
        args: Prisma.FormularioRegistoReclamacoesTrabalhadoresFindUniqueArgs
      ) => {
        if (!args?.where?.id) {
          throw new Error('ID is required for findUnique');
        }

        const item =
          await db.formularioRegistoReclamacoesTrabalhadores.findFirst({
            ...args,
            where: {
              id: args.where.id,
              ...(tenantId ? { tenantId } : {}),
            },
          });

        return item;
      },
    },
  };
}
