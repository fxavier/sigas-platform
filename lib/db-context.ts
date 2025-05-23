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
  };
}
