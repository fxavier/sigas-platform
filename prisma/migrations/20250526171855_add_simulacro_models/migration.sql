-- CreateEnum
CREATE TYPE "tipoEmergenciaSimulada" AS ENUM ('SAUDE_E_SEGURANCA', 'AMBIENTAL');

-- CreateEnum
CREATE TYPE "ObjectoDoSimulacro" AS ENUM ('DISPOSITIVOS_DE_EMERGENCIA', 'REACAO_DOS_COLABORADORES', 'ACTUACAO_DA_EQUIPA_DE_EMERGENCIA');

-- CreateEnum
CREATE TYPE "RespostaSiNaoNA" AS ENUM ('SIM', 'NAO', 'N_A');

-- CreateTable
CREATE TABLE "pergunta_avaliacao_classificacao_emergencia" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "pergunta" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "pergunta_avaliacao_classificacao_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao_classificacao_emergencia" (
    "id" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "resposta" "RespostaSiNaoNA" NOT NULL,
    "comentarios" TEXT,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "relatorioDeSimulacroId" TEXT,

    CONSTRAINT "avaliacao_classificacao_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recomendacoes" (
    "id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "recomendacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_de_simulacro" (
    "id" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoEmergenciaSimulada" "tipoEmergenciaSimulada" NOT NULL,
    "objectoDoSimulacro" "ObjectoDoSimulacro" NOT NULL,
    "descricaoDocenario" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assinaturaCoordenadorEmergencia" TEXT NOT NULL,
    "outraAssinatura" TEXT,

    CONSTRAINT "relatorio_de_simulacro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_de_simulacro_on_avaliacao_classificacao_emergencia" (
    "relatorioDeSimulacroId" TEXT NOT NULL,
    "avaliacaoClassificacaoEmergenciaId" TEXT NOT NULL,

    CONSTRAINT "relatorio_de_simulacro_on_avaliacao_classificacao_emergenc_pkey" PRIMARY KEY ("relatorioDeSimulacroId","avaliacaoClassificacaoEmergenciaId")
);

-- CreateTable
CREATE TABLE "relatorio_de_simulacro_on_recomendacoes" (
    "relatorioDeSimulacroId" TEXT NOT NULL,
    "recomendacoesId" TEXT NOT NULL,

    CONSTRAINT "relatorio_de_simulacro_on_recomendacoes_pkey" PRIMARY KEY ("relatorioDeSimulacroId","recomendacoesId")
);

-- CreateIndex
CREATE INDEX "pergunta_avaliacao_classificacao_emergencia_tenantId_idx" ON "pergunta_avaliacao_classificacao_emergencia"("tenantId");

-- CreateIndex
CREATE INDEX "avaliacao_classificacao_emergencia_tenantId_idx" ON "avaliacao_classificacao_emergencia"("tenantId");

-- CreateIndex
CREATE INDEX "recomendacoes_tenantId_idx" ON "recomendacoes"("tenantId");

-- CreateIndex
CREATE INDEX "relatorio_de_simulacro_tenantId_idx" ON "relatorio_de_simulacro"("tenantId");

-- AddForeignKey
ALTER TABLE "pergunta_avaliacao_classificacao_emergencia" ADD CONSTRAINT "pergunta_avaliacao_classificacao_emergencia_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pergunta_avaliacao_classificacao_emergencia" ADD CONSTRAINT "pergunta_avaliacao_classificacao_emergencia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_classificacao_emergencia" ADD CONSTRAINT "avaliacao_classificacao_emergencia_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta_avaliacao_classificacao_emergencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_classificacao_emergencia" ADD CONSTRAINT "avaliacao_classificacao_emergencia_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_classificacao_emergencia" ADD CONSTRAINT "avaliacao_classificacao_emergencia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_classificacao_emergencia" ADD CONSTRAINT "avaliacao_classificacao_emergencia_relatorioDeSimulacroId_fkey" FOREIGN KEY ("relatorioDeSimulacroId") REFERENCES "relatorio_de_simulacro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recomendacoes" ADD CONSTRAINT "recomendacoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recomendacoes" ADD CONSTRAINT "recomendacoes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro" ADD CONSTRAINT "relatorio_de_simulacro_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro" ADD CONSTRAINT "relatorio_de_simulacro_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro_on_avaliacao_classificacao_emergencia" ADD CONSTRAINT "simulacro_fkey" FOREIGN KEY ("relatorioDeSimulacroId") REFERENCES "relatorio_de_simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro_on_avaliacao_classificacao_emergencia" ADD CONSTRAINT "avaliacao_fkey" FOREIGN KEY ("avaliacaoClassificacaoEmergenciaId") REFERENCES "avaliacao_classificacao_emergencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro_on_recomendacoes" ADD CONSTRAINT "relatorio_de_simulacro_on_recomendacoes_relatorioDeSimulac_fkey" FOREIGN KEY ("relatorioDeSimulacroId") REFERENCES "relatorio_de_simulacro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_de_simulacro_on_recomendacoes" ADD CONSTRAINT "relatorio_de_simulacro_on_recomendacoes_recomendacoesId_fkey" FOREIGN KEY ("recomendacoesId") REFERENCES "recomendacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
