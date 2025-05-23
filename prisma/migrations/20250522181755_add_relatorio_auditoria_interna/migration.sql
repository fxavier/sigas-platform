-- CreateTable
CREATE TABLE "relatorio_auditoria_interna" (
    "id" TEXT NOT NULL,
    "ambitoAuditoria" TEXT NOT NULL,
    "dataAuditoria" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRelatorio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auditorLider" TEXT NOT NULL,
    "auditorObservador" TEXT NOT NULL,
    "resumoAuditoria" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "relatorio_auditoria_interna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descricao_nao_conformidade" (
    "id" TEXT NOT NULL,
    "processo" TEXT NOT NULL,
    "clausula" TEXT NOT NULL,
    "naoConformidade" TEXT NOT NULL,
    "relatorioAuditoriaInternaId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "descricao_nao_conformidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "relatorio_auditoria_interna_tenantId_idx" ON "relatorio_auditoria_interna"("tenantId");

-- CreateIndex
CREATE INDEX "descricao_nao_conformidade_relatorioAuditoriaInternaId_idx" ON "descricao_nao_conformidade"("relatorioAuditoriaInternaId");

-- CreateIndex
CREATE INDEX "descricao_nao_conformidade_tenantId_idx" ON "descricao_nao_conformidade"("tenantId");

-- AddForeignKey
ALTER TABLE "relatorio_auditoria_interna" ADD CONSTRAINT "relatorio_auditoria_interna_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_auditoria_interna" ADD CONSTRAINT "relatorio_auditoria_interna_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricao_nao_conformidade" ADD CONSTRAINT "descricao_nao_conformidade_relatorioAuditoriaInternaId_fkey" FOREIGN KEY ("relatorioAuditoriaInternaId") REFERENCES "relatorio_auditoria_interna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricao_nao_conformidade" ADD CONSTRAINT "descricao_nao_conformidade_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descricao_nao_conformidade" ADD CONSTRAINT "descricao_nao_conformidade_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
