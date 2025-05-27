-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "MetodoNotificacao" AS ENUM ('CARTA', 'EMAIL', 'WHATSAPP', 'OUTRO');

-- CreateTable
CREATE TABLE "CategoriaQueixa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "CategoriaQueixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubcategoriaQueixa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaQueixaId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "SubcategoriaQueixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResolucaoQueixa" (
    "id" TEXT NOT NULL,
    "accao_correctiva" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fichaRegistoQueixasReclamacoesId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ResolucaoQueixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotosDocumentosComprovativoEncerramento" (
    "id" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "fichaRegistoQueixasReclamacoesId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "FotosDocumentosComprovativoEncerramento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaRegistoQueixasReclamacoes" (
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

    CONSTRAINT "FichaRegistoQueixasReclamacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_B_index" ON "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa"("B");

-- AddForeignKey
ALTER TABLE "CategoriaQueixa" ADD CONSTRAINT "CategoriaQueixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaQueixa" ADD CONSTRAINT "CategoriaQueixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcategoriaQueixa" ADD CONSTRAINT "SubcategoriaQueixa_categoriaQueixaId_fkey" FOREIGN KEY ("categoriaQueixaId") REFERENCES "CategoriaQueixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcategoriaQueixa" ADD CONSTRAINT "SubcategoriaQueixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcategoriaQueixa" ADD CONSTRAINT "SubcategoriaQueixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolucaoQueixa" ADD CONSTRAINT "ResolucaoQueixa_fichaRegistoQueixasReclamacoesId_fkey" FOREIGN KEY ("fichaRegistoQueixasReclamacoesId") REFERENCES "FichaRegistoQueixasReclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolucaoQueixa" ADD CONSTRAINT "ResolucaoQueixa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolucaoQueixa" ADD CONSTRAINT "ResolucaoQueixa_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" ADD CONSTRAINT "FotosDocumentosComprovativoEncerramento_fichaRegistoQueixa_fkey" FOREIGN KEY ("fichaRegistoQueixasReclamacoesId") REFERENCES "FichaRegistoQueixasReclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" ADD CONSTRAINT "FotosDocumentosComprovativoEncerramento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotosDocumentosComprovativoEncerramento" ADD CONSTRAINT "FotosDocumentosComprovativoEncerramento_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" ADD CONSTRAINT "FichaRegistoQueixasReclamacoes_categoriaQueixaId_fkey" FOREIGN KEY ("categoriaQueixaId") REFERENCES "CategoriaQueixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" ADD CONSTRAINT "FichaRegistoQueixasReclamacoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaRegistoQueixasReclamacoes" ADD CONSTRAINT "FichaRegistoQueixasReclamacoes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" ADD CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_A_fkey" FOREIGN KEY ("A") REFERENCES "FichaRegistoQueixasReclamacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa" ADD CONSTRAINT "_FichaRegistoQueixasReclamacoesToSubcategoriaQueixa_B_fkey" FOREIGN KEY ("B") REFERENCES "SubcategoriaQueixa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
