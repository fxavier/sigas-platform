-- CreateTable
CREATE TABLE "registo_comunicacoes_relatorio_as_partes_interessadas" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "participantes" TEXT NOT NULL,
    "encontroAtendeuSeuProposito" "RespostaSimNao" NOT NULL,
    "porqueNaoAtendeu" TEXT NOT NULL,
    "haNecessidadeRetomarTema" "RespostaSimNao" NOT NULL,
    "poruqNecessarioRetomarTema" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "registo_comunicacoes_relatorio_as_partes_interessadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registo_comunicacoes_relatorio_as_partes_interessadas_tenan_idx" ON "registo_comunicacoes_relatorio_as_partes_interessadas"("tenantId");

-- AddForeignKey
ALTER TABLE "registo_comunicacoes_relatorio_as_partes_interessadas" ADD CONSTRAINT "registo_comunicacoes_relatorio_as_partes_interessadas_tena_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registo_comunicacoes_relatorio_as_partes_interessadas" ADD CONSTRAINT "registo_comunicacoes_relatorio_as_partes_interessadas_proj_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
