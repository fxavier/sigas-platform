/*
  Warnings:

  - You are about to drop the `CategoriaQueixa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FichaRegistoQueixasReclamacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FotosDocumentosComprovativoEncerramento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResolucaoQueixa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubcategoriaQueixa` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MetodoPreferidoDoContacto" AS ENUM ('TELEFONE', 'EMAIL', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "LinguaPreferida" AS ENUM ('PORTUGUES', 'INGLES', 'OUTRO');

-- DropForeignKey
ALTER TABLE "CategoriaQueixa" DROP CONSTRAINT "CategoriaQueixa_projectId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriaQueixa" DROP CONSTRAINT "CategoriaQueixa_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" DROP CONSTRAINT "FichaRegistoQueixasReclamacoes_categoriaQueixaId_fkey";

-- DropForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" DROP CONSTRAINT "FichaRegistoQueixasReclamacoes_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" DROP CONSTRAINT "FichaRegistoQueixasReclamacoes_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" DROP CONSTRAINT "FotosDocumentosComprovativoEncerramento_fichaRegistoQueixa_fkey";

-- DropForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" DROP CONSTRAINT "FotosDocumentosComprovativoEncerramento_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" DROP CONSTRAINT "FotosDocumentosComprovativoEncerramento_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "ResolucaoQueixa" DROP CONSTRAINT "ResolucaoQueixa_fichaRegistoQueixasReclamacoesId_fkey";

-- DropForeignKey
ALTER TABLE "ResolucaoQueixa" DROP CONSTRAINT "ResolucaoQueixa_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ResolucaoQueixa" DROP CONSTRAINT "ResolucaoQueixa_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "SubcategoriaQueixa" DROP CONSTRAINT "SubcategoriaQueixa_categoriaQueixaId_fkey";

-- DropForeignKey
ALTER TABLE "SubcategoriaQueixa" DROP CONSTRAINT "SubcategoriaQueixa_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SubcategoriaQueixa" DROP CONSTRAINT "SubcategoriaQueixa_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" DROP CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_A_fkey";

-- DropForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" DROP CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_B_fkey";

-- DropTable
DROP TABLE "CategoriaQueixa";

-- DropTable
DROP TABLE "FichaRegistoQueixasReclamacoes";

-- DropTable
DROP TABLE "FotosDocumentosComprovativoEncerramento";

-- DropTable
DROP TABLE "ResolucaoQueixa";

-- DropTable
DROP TABLE "SubcategoriaQueixa";

-- CreateTable
CREATE TABLE "categoria_queixa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "categoria_queixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategoria_queixa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaQueixaId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "subcategoria_queixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resolucao_queixa" (
    "id" TEXT NOT NULL,
    "accao_correctiva" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fichaRegistoQueixasReclamacoesId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "resolucao_queixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos_documentos_comprovativo_encerramento" (
    "id" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "fichaRegistoQueixasReclamacoesId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "fotos_documentos_comprovativo_encerramento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ficha_registo_queixas_reclamacoes" (
    "id" TEXT NOT NULL,
    "numeroQueixa" TEXT NOT NULL,
    "nomeCompletoReclamante" TEXT,
    "genero" "Genero" NOT NULL,
    "idade" INTEGER NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "quarteirao" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "localidade" TEXT NOT NULL,
    "postoAdministrativo" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "dataReclamacao" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "breveDescricaoFactos" TEXT NOT NULL,
    "queixaAceita" "RespostaSimNao" NOT NULL,
    "justificativaParaRejeicao" TEXT,
    "reclamanteNotificado" "RespostaSimNao",
    "metodoNotificacao" "MetodoNotificacao",
    "outroMetodoNotificacao" TEXT,
    "dataEncerramento" TIMESTAMP(3),
    "categoriaQueixaId" TEXT,
    "descricao_factos_apos_investigacao" TEXT,
    "reclamanteNotificadoSobreEncerramento" "RespostaSimNao",
    "reclamanteSatisfeito" "RespostaSimNao",
    "recursosGastosReparacaoReclamacao" TEXT,
    "dataEncerramentoReclamacao" TIMESTAMP(3),
    "diasDesdeQueixaAoEncerramento" INTEGER,
    "monitoriaAposEncerramento" "RespostaSimNao",
    "accaoMonitoriaAposEncerramento" TEXT,
    "responsavelMonitoriaAposEncerramento" TEXT,
    "prazoMonitoriaAposEncerramento" TEXT,
    "estadoMonitoriaAposEncerramento" TEXT,
    "accoesPreventivasSugeridas" TEXT,
    "responsavelAccoesPreventivasSugeridas" TEXT,
    "prazoAccoesPreventivasSugeridas" TEXT,
    "estadoAccoesPreventivasSugeridas" TEXT,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ficha_registo_queixas_reclamacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulario_registo_reclamacoes_trabalhadores" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "empresa" TEXT NOT NULL,
    "dataReclamacao" TIMESTAMP(3) NOT NULL,
    "horaReclamacao" TEXT NOT NULL,
    "metodoPreferidoDoContacto" "MetodoPreferidoDoContacto" NOT NULL,
    "detalhesDoContacto" TEXT NOT NULL,
    "linguaPreferida" "LinguaPreferida" NOT NULL,
    "outraLinguaPreferida" TEXT,
    "detalhesDareclamacao" TEXT NOT NULL,
    "numeroIdentificacaoResponsavelRecepcao" TEXT NOT NULL,
    "nomeResponsavelRecepcao" TEXT,
    "funcaoResponsavelRecepcao" TEXT,
    "assinaturaResponsavelRecepcao" TEXT,
    "dataRecepcao" TEXT,
    "detalhesResponsavelRecepcao" TEXT,
    "detalhesAcompanhamento" TEXT,
    "dataEncerramento" TIMESTAMP(3),
    "assinatura" TEXT,
    "confirmarRecepcaoResposta" "RespostaSimNao",
    "nomeDoConfirmante" TEXT,
    "dataConfirmacao" TIMESTAMP(3),
    "assinaturaConfirmacao" TEXT,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "formulario_registo_reclamacoes_trabalhadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "formulario_registo_reclamacoes_trabalhadores_tenantId_idx" ON "formulario_registo_reclamacoes_trabalhadores"("tenantId");

-- AddForeignKey
ALTER TABLE "categoria_queixa" ADD CONSTRAINT "categoria_queixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria_queixa" ADD CONSTRAINT "categoria_queixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategoria_queixa" ADD CONSTRAINT "subcategoria_queixa_categoriaQueixaId_fkey" FOREIGN KEY ("categoriaQueixaId") REFERENCES "categoria_queixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategoria_queixa" ADD CONSTRAINT "subcategoria_queixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategoria_queixa" ADD CONSTRAINT "subcategoria_queixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resolucao_queixa" ADD CONSTRAINT "resolucao_queixa_fichaRegistoQueixasReclamacoesId_fkey" FOREIGN KEY ("fichaRegistoQueixasReclamacoesId") REFERENCES "ficha_registo_queixas_reclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resolucao_queixa" ADD CONSTRAINT "resolucao_queixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resolucao_queixa" ADD CONSTRAINT "resolucao_queixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_documentos_comprovativo_encerramento" ADD CONSTRAINT "fotos_documentos_comprovativo_encerramento_fichaRegistoQue_fkey" FOREIGN KEY ("fichaRegistoQueixasReclamacoesId") REFERENCES "ficha_registo_queixas_reclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_documentos_comprovativo_encerramento" ADD CONSTRAINT "fotos_documentos_comprovativo_encerramento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos_documentos_comprovativo_encerramento" ADD CONSTRAINT "fotos_documentos_comprovativo_encerramento_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_registo_queixas_reclamacoes" ADD CONSTRAINT "ficha_registo_queixas_reclamacoes_categoriaQueixaId_fkey" FOREIGN KEY ("categoriaQueixaId") REFERENCES "categoria_queixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_registo_queixas_reclamacoes" ADD CONSTRAINT "ficha_registo_queixas_reclamacoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_registo_queixas_reclamacoes" ADD CONSTRAINT "ficha_registo_queixas_reclamacoes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulario_registo_reclamacoes_trabalhadores" ADD CONSTRAINT "formulario_registo_reclamacoes_trabalhadores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulario_registo_reclamacoes_trabalhadores" ADD CONSTRAINT "formulario_registo_reclamacoes_trabalhadores_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" ADD CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_A_fkey" FOREIGN KEY ("A") REFERENCES "ficha_registo_queixas_reclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" ADD CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_B_fkey" FOREIGN KEY ("B") REFERENCES "subcategoria_queixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
