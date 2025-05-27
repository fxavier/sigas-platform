-- CreateTable
CREATE TABLE "resultado_comite_gestao_ambiental_e_social" (
    "id" TEXT NOT NULL,
    "pontosDebatidos" TEXT NOT NULL,
    "accoesNecessarias" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "prazo" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "revisaoEAprovacao" TEXT NOT NULL,
    "dataRevisaoEAprovacao" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "resultado_comite_gestao_ambiental_e_social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minutas_comite_gestao_ambiental_e_social" (
    "id" TEXT NOT NULL,
    "presididoPor" TEXT NOT NULL,
    "convidado" TEXT NOT NULL,
    "ausenciasJustificadas" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "resultadoComiteGestaoAmbientalESocialId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "minutas_comite_gestao_ambiental_e_social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resultado_comite_gestao_ambiental_e_social_tenantId_idx" ON "resultado_comite_gestao_ambiental_e_social"("tenantId");

-- CreateIndex
CREATE INDEX "minutas_comite_gestao_ambiental_e_social_tenantId_idx" ON "minutas_comite_gestao_ambiental_e_social"("tenantId");

-- AddForeignKey
ALTER TABLE "resultado_comite_gestao_ambiental_e_social" ADD CONSTRAINT "resultado_comite_gestao_ambiental_e_social_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_comite_gestao_ambiental_e_social" ADD CONSTRAINT "resultado_comite_gestao_ambiental_e_social_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minutas_comite_gestao_ambiental_e_social" ADD CONSTRAINT "minutas_comite_gestao_ambiental_e_social_resultadoComiteGe_fkey" FOREIGN KEY ("resultadoComiteGestaoAmbientalESocialId") REFERENCES "resultado_comite_gestao_ambiental_e_social"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minutas_comite_gestao_ambiental_e_social" ADD CONSTRAINT "minutas_comite_gestao_ambiental_e_social_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "minutas_comite_gestao_ambiental_e_social" ADD CONSTRAINT "minutas_comite_gestao_ambiental_e_social_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
