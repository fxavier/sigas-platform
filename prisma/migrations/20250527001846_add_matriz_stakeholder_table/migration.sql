-- CreateEnum
CREATE TYPE "Alcance" AS ENUM ('LOCAL', 'REGIONAL', 'NACIONAL', 'INTERNACIONAL');

-- CreateEnum
CREATE TYPE "PercepcaoOuPosicionamento" AS ENUM ('POSITIVO', 'NEGATIVO', 'NEUTRO');

-- CreateEnum
CREATE TYPE "PotenciaImpacto" AS ENUM ('BAIXO', 'MEDIO', 'ALTO');

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_actuacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "area_actuacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principais_interesses" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "principais_interesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatrizStakeholder" (
    "id" TEXT NOT NULL,
    "stakeholder" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "alcance" "Alcance" NOT NULL,
    "areaActuacaoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "historico_relacionamento" TEXT NOT NULL,
    "percepcaoEmRelacaoAoEmprendedor" TEXT NOT NULL,
    "principaisInteressesId" TEXT NOT NULL,
    "oportunidades_associadas" TEXT NOT NULL,
    "riscos_associados" TEXT NOT NULL,
    "percepcaoOuPosicionamento" "PercepcaoOuPosicionamento" NOT NULL,
    "potenciaImpacto" "PotenciaImpacto" NOT NULL,
    "diagnostico_directriz_posicionamento" TEXT NOT NULL,
    "interlocutor_responsavel_por_relacionamento" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "MatrizStakeholder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categorias_tenantId_idx" ON "categorias"("tenantId");

-- CreateIndex
CREATE INDEX "area_actuacao_tenantId_idx" ON "area_actuacao"("tenantId");

-- CreateIndex
CREATE INDEX "principais_interesses_tenantId_idx" ON "principais_interesses"("tenantId");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_actuacao" ADD CONSTRAINT "area_actuacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_actuacao" ADD CONSTRAINT "area_actuacao_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principais_interesses" ADD CONSTRAINT "principais_interesses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principais_interesses" ADD CONSTRAINT "principais_interesses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrizStakeholder" ADD CONSTRAINT "MatrizStakeholder_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrizStakeholder" ADD CONSTRAINT "MatrizStakeholder_areaActuacaoId_fkey" FOREIGN KEY ("areaActuacaoId") REFERENCES "area_actuacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrizStakeholder" ADD CONSTRAINT "MatrizStakeholder_principaisInteressesId_fkey" FOREIGN KEY ("principaisInteressesId") REFERENCES "principais_interesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrizStakeholder" ADD CONSTRAINT "MatrizStakeholder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatrizStakeholder" ADD CONSTRAINT "MatrizStakeholder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
