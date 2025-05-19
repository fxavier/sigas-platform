-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- CreateEnum
CREATE TYPE "RespostaSimNao" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "TipoFuncionario" AS ENUM ('CONTRATADO', 'INCIDENTE_DE_TERCEIROS');

-- CreateEnum
CREATE TYPE "FormaActividade" AS ENUM ('CONTROLADA', 'NAO_CONTROLADA', 'MONITORADA');

-- CreateEnum
CREATE TYPE "EfeitosIncidente" AS ENUM ('SAUDE', 'SEGURANCA', 'AMBIENTE', 'COMUNIDADE');

-- CreateEnum
CREATE TYPE "TipoIncidente" AS ENUM ('FATALIDADE', 'OCORRENCIA_PERIGOSA', 'INCIDENTE_QUASE_ACIDENTE', 'TEMPO_PERDIDO', 'INCIDENTE_AMBIENTAL', 'SEGURANCA', 'RECLAMACAO_EXTERNA', 'NOTIFICACAO_DO_REGULADOR_VIOLACAO', 'DERAMAMENTO_LBERACAO_DESCONTROLADA', 'DANOS_PERDAS', 'FLORA_FAUNA', 'AUDITORIA_NAO_CONFORMIDADE');

-- CreateEnum
CREATE TYPE "Duracao" AS ENUM ('CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO');

-- CreateEnum
CREATE TYPE "Extensao" AS ENUM ('LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL');

-- CreateEnum
CREATE TYPE "Intensidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "FaseProjecto" AS ENUM ('PRE_CONSTRUCAO', 'CONSTRUCAO', 'OPERACAO', 'DESATIVACAO', 'ENCERRAMENTO', 'RESTAURACAO');

-- CreateEnum
CREATE TYPE "Probabilidade" AS ENUM ('IMPROVAVEL', 'PROVAVEL', 'ALTAMENTE_PROVAVEL', 'DEFINITIVA');

-- CreateEnum
CREATE TYPE "TipoResposta" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "Estatuto" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'REVOKED', 'AMENDED');

-- CreateEnum
CREATE TYPE "Condicao" AS ENUM ('NORMAL', 'ANORMAL', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "Provincias" AS ENUM ('MAPUTO', 'MAPUTO_CIDADE', 'GAZA', 'INHAMBANE', 'SOFALA', 'MANICA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA');

-- CreateEnum
CREATE TYPE "TipoActividade" AS ENUM ('TURISTICA', 'INDUSTRIAL', 'AGRO_PECUARIA', 'ENERGETICA', 'SERVICOS', 'OUTRA');

-- CreateEnum
CREATE TYPE "EstagioDesenvolvimento" AS ENUM ('NOVA', 'REABILITACAO', 'EXPANSAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "MeioInsercao" AS ENUM ('RURAL', 'URBANO', 'PERIURBANO');

-- CreateEnum
CREATE TYPE "EnquadramentoOrcamentoTerritorial" AS ENUM ('ESPACO_HABITACIONAL', 'INDUSTRIAL', 'SERVICOS', 'OUTRO');

-- CreateEnum
CREATE TYPE "CaracteristicasFisicaslocalImplantacaoActividades" AS ENUM ('PLANICIE', 'PLANALTO', 'VALE', 'MONTANHA');

-- CreateEnum
CREATE TYPE "Ecossistemaspredominantes" AS ENUM ('FLUVIAL', 'LACUSTRE', 'MARINHO', 'TERRESTRE');

-- CreateEnum
CREATE TYPE "LocationZone" AS ENUM ('COSTEIRA', 'INTERIOR', 'ILHA');

-- CreateEnum
CREATE TYPE "TypeOfPredominantVegetation" AS ENUM ('FLORESTA', 'SAVANA', 'OUTRO');

-- CreateEnum
CREATE TYPE "LandUse" AS ENUM ('AGROPECUARIO', 'HABITACIONAL', 'INDUSTRIAL', 'PROTECCAO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Eficacia" AS ENUM ('Eficaz', 'Nao_Eficaz');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('REVISAO', 'EM_USO', 'ABSOLETO');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas_envolvidas_investigacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "pessoas_envolvidas_investigacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accoes_correctivas_permanentes" (
    "id" TEXT NOT NULL,
    "accao" TEXT,
    "prazo" TIMESTAMP(3),
    "responsavel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "accoes_correctivas_permanentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotografias_incidente" (
    "id" TEXT NOT NULL,
    "fotografia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "fotografias_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membros_equipa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT '',
    "departamento" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "membros_equipa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabela_accoes" (
    "id" TEXT NOT NULL,
    "accao" TEXT NOT NULL,
    "pessoaResponsavel" TEXT NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "tabela_accoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "id" TEXT NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_incidente" (
    "id" TEXT NOT NULL,
    "dataIncidente" TIMESTAMP(3) NOT NULL,
    "horaIncident" TIME(6) NOT NULL,
    "descricaoDoIncidente" TEXT NOT NULL,
    "detalhesLesao" TEXT NOT NULL,
    "accoesImediatasTomadas" TEXT NOT NULL,
    "tipoFuncionario" "TipoFuncionario" NOT NULL,
    "categoriaPessoaEnvolvida" TEXT NOT NULL,
    "formaActividade" "FormaActividade" NOT NULL,
    "foiRealizadaAvaliacaoRisco" "RespostaSimNao" NOT NULL,
    "existePadraoControleRisco" "RespostaSimNao" NOT NULL,
    "tipoConsequenciaIncidenteReal" TEXT,
    "tipoConsequenciaIncidentePotencial" TEXT,
    "efeitosIncidenteReal" "EfeitosIncidente" NOT NULL,
    "classificacaoGravidadeIncidenteReal" TEXT,
    "efeitosIncidentePotencial" "EfeitosIncidente",
    "classificacaoGravidadeIncidentePotencial" TEXT,
    "esteFoiIncidenteSemBarreira" "RespostaSimNao" NOT NULL,
    "foiIncidenteRepetitivo" "RespostaSimNao" NOT NULL,
    "foiIncidenteResultanteFalhaProcesso" "RespostaSimNao" NOT NULL,
    "danosMateriais" "RespostaSimNao" NOT NULL,
    "valorDanos" DECIMAL(10,2),
    "statusInvestigacao" TEXT,
    "dataInvestigacaoCompleta" TIMESTAMP(3),
    "ausenciaOuFalhaDefesas" "RespostaSimNao",
    "descricaoAusenciaOuFalhaDefesas" TEXT,
    "accoesIndividuaisOuEquipe" TEXT,
    "descricaoAccaoIndividualOuEquipe" TEXT,
    "tarefaOuCondicoesAmbientaisLocalTrabalho" TEXT,
    "descricaoTarefaOuCondicoesAmbientaisLocalTrabalho" TEXT,
    "tarefaOuCondicoesAmbientaisHumano" TEXT,
    "descricaoTarefaOuCondicoesAmbientaisHumano" TEXT,
    "factoresOrganizacionais" TEXT,
    "descricaoFactoresOrganizacionais" TEXT,
    "causasSubjacentesEPrincipaisFactoresContribuintes" TEXT,
    "descricaoIncidenteAposInvestigacao" TEXT,
    "principaisLicoes" TEXT,
    "resgistoRiscoActivosActualizadosAposInvestigacao" "RespostaSimNao",
    "voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao" "RespostaSimNao",
    "comoPartilhou" TEXT,
    "superiorHierarquicoResponsavel" TEXT,
    "telefoneSuperiorHierarquicoResponsavel" TEXT,
    "tituloSuperiorHierarquicoResponsavel" TEXT,
    "emailSuperiorHierarquicoResponsavel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "relatorios_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objetivos_metas_ambientais_sociais" (
    "id" TEXT NOT NULL,
    "numeroRefOAndM" TEXT NOT NULL,
    "aspetoRefNumero" TEXT NOT NULL,
    "centroCustos" TEXT NOT NULL,
    "objectivo" TEXT NOT NULL,
    "publicoAlvo" TEXT NOT NULL,
    "orcamentoRecursos" TEXT NOT NULL,
    "refDocumentoComprovativo" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataConclusaoPrevista" TIMESTAMP(3) NOT NULL,
    "dataConclusaoReal" TIMESTAMP(3) NOT NULL,
    "pgasAprovadoPor" TEXT NOT NULL,
    "dataAprovacao" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT NOT NULL,
    "oAndMAlcancadoFechado" "RespostaSimNao" NOT NULL,
    "assinaturaDirectorGeral" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "objetivos_metas_ambientais_sociais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorios_iniciais_incidente" (
    "id" TEXT NOT NULL,
    "dataIncidente" TIMESTAMP(3) NOT NULL,
    "seccao" VARCHAR(100),
    "localIncidente" TEXT NOT NULL,
    "dataComunicacao" TIMESTAMP(3) NOT NULL,
    "supervisor" VARCHAR(100) NOT NULL,
    "empregado" "RespostaSimNao",
    "nomeFuncionario" VARCHAR(100),
    "subcontratante" "RespostaSimNao",
    "nomeSubcontratado" VARCHAR(100),
    "descricaoCircunstanciaIncidente" TEXT NOT NULL,
    "infoSobreFeriodosETratamentoFeito" TEXT NOT NULL,
    "declaracaoDeTestemunhas" TEXT,
    "conclusaoPreliminar" TEXT,
    "recomendacoes" TEXT NOT NULL,
    "inclusaoEmMateriaSeguranca" VARCHAR(100),
    "prazo" TIMESTAMP(3),
    "necessitaDeInvestigacaoAprofundada" "RespostaSimNao" NOT NULL,
    "incidenteReportavel" "RespostaSimNao" NOT NULL,
    "credoresObrigadosASeremNotificados" "RespostaSimNao" NOT NULL,
    "autorDoRelatorio" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "nomeProvedor" VARCHAR(100) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tipoIncidente" "TipoIncidente" NOT NULL,
    "horaIncidente" TIME(6) NOT NULL,

    CONSTRAINT "relatorios_iniciais_incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_pessoas_envolvidas" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "pessoaEnvolvidaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_pessoas_envolvidas_pkey" PRIMARY KEY ("relatorioIncidenteId","pessoaEnvolvidaId")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_accoes_correctivas" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "accaoCorrectivaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_accoes_correctivas_pkey" PRIMARY KEY ("relatorioIncidenteId","accaoCorrectivaId")
);

-- CreateTable
CREATE TABLE "relatorio_incidente_fotografias" (
    "relatorioIncidenteId" TEXT NOT NULL,
    "fotografiaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_incidente_fotografias_pkey" PRIMARY KEY ("relatorioIncidenteId","fotografiaId")
);

-- CreateTable
CREATE TABLE "objetivos_metas_membros_equipa" (
    "objetivoMetaId" TEXT NOT NULL,
    "membroEquipaId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objetivos_metas_membros_equipa_pkey" PRIMARY KEY ("objetivoMetaId","membroEquipaId")
);

-- CreateTable
CREATE TABLE "objetivos_metas_tabela_accoes" (
    "objetivoMetaId" TEXT NOT NULL,
    "tabelaAccaoId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objetivos_metas_tabela_accoes_pkey" PRIMARY KEY ("objetivoMetaId","tabelaAccaoId")
);

-- CreateTable
CREATE TABLE "relatorio_inicial_incidente_incidentes" (
    "relatorioInicialId" TEXT NOT NULL,
    "incidenteId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_inicial_incidente_incidentes_pkey" PRIMARY KEY ("relatorioInicialId","incidenteId")
);

-- CreateTable
CREATE TABLE "factor_ambiental_impactado" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "factor_ambiental_impactado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riscos_impactos" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "riscos_impactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificacao_avaliacao_riscos_impactos" (
    "id" TEXT NOT NULL,
    "numeroReferencia" TEXT,
    "processo" TEXT,
    "actiactividade" TEXT NOT NULL,
    "riscosImpactosId" TEXT NOT NULL,
    "realOuPotencial" TEXT,
    "condicao" "Condicao" NOT NULL,
    "factorAmbientalImpactadoId" TEXT NOT NULL,
    "faseProjecto" "FaseProjecto" NOT NULL,
    "estatuto" "Estatuto" NOT NULL,
    "extensao" "Extensao" NOT NULL,
    "duduacao" "Duracao" NOT NULL,
    "intensidade" "Intensidade" NOT NULL,
    "probabilidade" "Probabilidade" NOT NULL,
    "significancia" TEXT,
    "duracaoRisco" TEXT,
    "descricaoMedidas" TEXT NOT NULL,
    "respresponsavelonsible" TEXT,
    "prazo" TIMESTAMP(3) NOT NULL,
    "referenciaDocumentoControl" TEXT,
    "legislacaoMocambicanaAplicavel" TEXT,
    "observacoes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "identificacao_avaliacao_riscos_impactos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controle_requisitos_legais" (
    "id" TEXT NOT NULL,
    "numnumero" TEXT NOT NULL,
    "tituloDocumento" TEXT NOT NULL,
    "descricao" TIMESTAMP(3) NOT NULL,
    "revocacoesAlteracoes" TEXT,
    "requisitoConformidade" TEXT,
    "dataControle" TIMESTAMP(3) NOT NULL,
    "observation" TEXT,
    "ficheiroDaLei" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "controle_requisitos_legais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa_do_contacto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "pessoa_do_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_pelo_preenchimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "responsavel_pelo_preenchimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsavel_pela_verificacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "assinatura" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "responsavel_pela_verificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biodiversidade_recursos_naturais" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "biodiversidade_recursos_naturais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subprojecto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "referenciaDoContracto" TEXT,
    "nomeEmpreiteiro" TEXT,
    "custoEstimado" DECIMAL(15,2),
    "localizacao" TEXT NOT NULL,
    "coordenadasGeograficas" TEXT,
    "tipoSubprojecto" TEXT NOT NULL,
    "areaAproximada" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "subprojecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identificacao_riscos_ambientais_sociais_subprojecto" (
    "id" TEXT NOT NULL,
    "biodiversidadeRecursosNaturaisId" TEXT NOT NULL,
    "resposta" "TipoResposta" NOT NULL,
    "comentario" TEXT,
    "normaAmbientalSocial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triagem_ambiental_social" (
    "id" TEXT NOT NULL,
    "responsavelPeloPreenchimentoId" TEXT NOT NULL,
    "responsavelPelaVerificacaoId" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "consultaEngajamento" TEXT,
    "accoesRecomendadas" TEXT,
    "resultadoTriagemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "triagem_ambiental_social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_and_engagement" (
    "id" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "consultation_and_engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resultado_triagem" (
    "id" TEXT NOT NULL,
    "subprojectoId" TEXT NOT NULL,
    "categoriaRisco" VARCHAR(15) NOT NULL,
    "descricao" TEXT NOT NULL,
    "instrumentosASeremDesenvolvidos" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "resultado_triagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ficha_informacao_ambiental_preliminar" (
    "id" TEXT NOT NULL,
    "nomeActividade" TEXT NOT NULL,
    "tipoActividade" "TipoActividade" NOT NULL,
    "proponentes" TEXT,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "fax" TEXT,
    "telemovel" TEXT,
    "email" TEXT NOT NULL,
    "bairroActividade" TEXT NOT NULL,
    "vilaActividade" TEXT NOT NULL,
    "cidadeActividade" TEXT NOT NULL,
    "localidadeActividade" TEXT,
    "distritoActividade" TEXT,
    "provinciaActividade" "Provincias" NOT NULL,
    "coordenadasGeograficas" TEXT,
    "meioInsercao" "MeioInsercao" NOT NULL,
    "enquadramentoOrcamentoTerritorial" "EnquadramentoOrcamentoTerritorial" NOT NULL,
    "descricaoActividade" TEXT,
    "actividadesAssociadas" TEXT,
    "descricaoTecnologiaConstrucaoOperacao" TEXT,
    "actividadesComplementaresPrincipais" TEXT,
    "tipoQuantidadeOrigemMaoDeObra" TEXT,
    "tipoQuantidadeOrigemProvenienciaMateriasPrimas" TEXT,
    "quimicosUtilizados" TEXT,
    "tipoOrigemConsumoAguaEnergia" TEXT,
    "origemCombustiveisLubrificantes" TEXT,
    "outrosRecursosNecessarios" TEXT,
    "posseDeTerra" TEXT,
    "alternativasLocalizacaoActividade" TEXT,
    "descricaoBreveSituacaoAmbientalReferenciaLocalRegional" TEXT,
    "caracteristicasFisicasLocalActividade" "CaracteristicasFisicaslocalImplantacaoActividades",
    "ecosistemasPredominantes" "Ecossistemaspredominantes",
    "zonaLocalizacao" "LocationZone",
    "tipoVegetacaoPredominante" "TypeOfPredominantVegetation",
    "usoSolo" "LandUse",
    "infraestruturaExistenteAreaActividade" TEXT,
    "informacaoComplementarAtravesMaps" TEXT,
    "valorTotalInvestimento" DECIMAL(15,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ficha_informacao_ambiental_preliminar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triagem_ambiental_social_identificacao_riscos" (
    "triagemAmbientalSocialId" TEXT NOT NULL,
    "identificacaoRiscosId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "triagem_ambiental_social_identificacao_riscos_pkey" PRIMARY KEY ("triagemAmbientalSocialId","identificacaoRiscosId")
);

-- CreateTable
CREATE TABLE "areas_treinamento" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "areas_treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caixa_ferramentas" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "caixa_ferramentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcao" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "funcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriz_treinamento" (
    "id" UUID NOT NULL,
    "data" DATE,
    "funcaoId" UUID NOT NULL,
    "areaTreinamentoId" UUID NOT NULL,
    "caixaFerramentasId" UUID NOT NULL,
    "totais_palestras" INTEGER NOT NULL,
    "total_horas" INTEGER NOT NULL,
    "total_caixa_ferramentas" INTEGER NOT NULL,
    "total_pessoas_informadas_caixa_ferramentas" INTEGER NOT NULL,
    "eficacia" "Eficacia" NOT NULL,
    "accoes_treinamento_nao_eficaz" TEXT,
    "aprovado_por" VARCHAR(100) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "matriz_treinamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "politicas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "politicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manuais" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "manuais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedimentos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "procedimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formularios" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRevisao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "nomeDocumento" TEXT NOT NULL,
    "ficheiro" TEXT NOT NULL,
    "estadoDocumento" "EstadoDocumento" NOT NULL,
    "periodoRetencao" TIMESTAMP(3),
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "modelos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "projects_tenantId_idx" ON "projects"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_tenantId_key" ON "projects"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "users"("clerkUserId");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_tenantId_key" ON "users"("email", "tenantId");

-- CreateIndex
CREATE INDEX "user_projects_userId_projectId_idx" ON "user_projects"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "user_projects_userId_projectId_key" ON "user_projects"("userId", "projectId");

-- CreateIndex
CREATE INDEX "transactions_tenantId_projectId_userId_idx" ON "transactions"("tenantId", "projectId", "userId");

-- CreateIndex
CREATE INDEX "pessoas_envolvidas_investigacao_tenantId_idx" ON "pessoas_envolvidas_investigacao"("tenantId");

-- CreateIndex
CREATE INDEX "accoes_correctivas_permanentes_tenantId_idx" ON "accoes_correctivas_permanentes"("tenantId");

-- CreateIndex
CREATE INDEX "fotografias_incidente_tenantId_idx" ON "fotografias_incidente"("tenantId");

-- CreateIndex
CREATE INDEX "membros_equipa_tenantId_idx" ON "membros_equipa"("tenantId");

-- CreateIndex
CREATE INDEX "tabela_accoes_tenantId_idx" ON "tabela_accoes"("tenantId");

-- CreateIndex
CREATE INDEX "incidentes_tenantId_idx" ON "incidentes"("tenantId");

-- CreateIndex
CREATE INDEX "relatorios_incidente_tenantId_projectId_idx" ON "relatorios_incidente"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "objetivos_metas_ambientais_sociais_tenantId_projectId_idx" ON "objetivos_metas_ambientais_sociais"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "relatorios_iniciais_incidente_tenantId_projectId_idx" ON "relatorios_iniciais_incidente"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "factor_ambiental_impactado_tenantId_idx" ON "factor_ambiental_impactado"("tenantId");

-- CreateIndex
CREATE INDEX "riscos_impactos_tenantId_idx" ON "riscos_impactos"("tenantId");

-- CreateIndex
CREATE INDEX "identificacao_avaliacao_riscos_impactos_tenantId_projectId__idx" ON "identificacao_avaliacao_riscos_impactos"("tenantId", "projectId", "riscosImpactosId", "factorAmbientalImpactadoId");

-- CreateIndex
CREATE INDEX "controle_requisitos_legais_tenantId_projectId_idx" ON "controle_requisitos_legais"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "pessoa_do_contacto_tenantId_idx" ON "pessoa_do_contacto"("tenantId");

-- CreateIndex
CREATE INDEX "responsavel_pelo_preenchimento_tenantId_idx" ON "responsavel_pelo_preenchimento"("tenantId");

-- CreateIndex
CREATE INDEX "responsavel_pela_verificacao_tenantId_idx" ON "responsavel_pela_verificacao"("tenantId");

-- CreateIndex
CREATE INDEX "biodiversidade_recursos_naturais_tenantId_idx" ON "biodiversidade_recursos_naturais"("tenantId");

-- CreateIndex
CREATE INDEX "subprojecto_tenantId_idx" ON "subprojecto"("tenantId");

-- CreateIndex
CREATE INDEX "identificacao_riscos_ambientais_sociais_subprojecto_tenantI_idx" ON "identificacao_riscos_ambientais_sociais_subprojecto"("tenantId", "biodiversidadeRecursosNaturaisId");

-- CreateIndex
CREATE INDEX "triagem_ambiental_social_tenantId_projectId_subprojectoId_r_idx" ON "triagem_ambiental_social"("tenantId", "projectId", "subprojectoId", "responsavelPeloPreenchimentoId", "responsavelPelaVerificacaoId", "resultadoTriagemId");

-- CreateIndex
CREATE INDEX "consultation_and_engagement_tenantId_projectId_subprojectoI_idx" ON "consultation_and_engagement"("tenantId", "projectId", "subprojectoId");

-- CreateIndex
CREATE INDEX "resultado_triagem_tenantId_subprojectoId_idx" ON "resultado_triagem"("tenantId", "subprojectoId");

-- CreateIndex
CREATE INDEX "ficha_informacao_ambiental_preliminar_tenantId_projectId_idx" ON "ficha_informacao_ambiental_preliminar"("tenantId", "projectId");

-- CreateIndex
CREATE INDEX "areas_treinamento_tenantId_idx" ON "areas_treinamento"("tenantId");

-- CreateIndex
CREATE INDEX "caixa_ferramentas_tenantId_idx" ON "caixa_ferramentas"("tenantId");

-- CreateIndex
CREATE INDEX "funcao_tenantId_idx" ON "funcao"("tenantId");

-- CreateIndex
CREATE INDEX "matriz_treinamento_tenantId_projectId_funcaoId_areaTreiname_idx" ON "matriz_treinamento"("tenantId", "projectId", "funcaoId", "areaTreinamentoId", "caixaFerramentasId");

-- CreateIndex
CREATE INDEX "politicas_tenantId_idx" ON "politicas"("tenantId");

-- CreateIndex
CREATE INDEX "manuais_tenantId_idx" ON "manuais"("tenantId");

-- CreateIndex
CREATE INDEX "procedimentos_tenantId_idx" ON "procedimentos"("tenantId");

-- CreateIndex
CREATE INDEX "formularios_tenantId_idx" ON "formularios"("tenantId");

-- CreateIndex
CREATE INDEX "modelos_tenantId_idx" ON "modelos"("tenantId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas_envolvidas_investigacao" ADD CONSTRAINT "pessoas_envolvidas_investigacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accoes_correctivas_permanentes" ADD CONSTRAINT "accoes_correctivas_permanentes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotografias_incidente" ADD CONSTRAINT "fotografias_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membros_equipa" ADD CONSTRAINT "membros_equipa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabela_accoes" ADD CONSTRAINT "tabela_accoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_incidente" ADD CONSTRAINT "relatorios_incidente_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_incidente" ADD CONSTRAINT "relatorios_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_ambientais_sociais" ADD CONSTRAINT "objetivos_metas_ambientais_sociais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_ambientais_sociais" ADD CONSTRAINT "objetivos_metas_ambientais_sociais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_iniciais_incidente" ADD CONSTRAINT "relatorios_iniciais_incidente_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios_iniciais_incidente" ADD CONSTRAINT "relatorios_iniciais_incidente_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_pessoas_envolvidas" ADD CONSTRAINT "relatorio_incidente_pessoas_envolvidas_pessoaEnvolvidaId_fkey" FOREIGN KEY ("pessoaEnvolvidaId") REFERENCES "pessoas_envolvidas_investigacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_pessoas_envolvidas" ADD CONSTRAINT "relatorio_incidente_pessoas_envolvidas_relatorioIncidenteI_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_accoes_correctivas" ADD CONSTRAINT "relatorio_incidente_accoes_correctivas_accaoCorrectivaId_fkey" FOREIGN KEY ("accaoCorrectivaId") REFERENCES "accoes_correctivas_permanentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_accoes_correctivas" ADD CONSTRAINT "relatorio_incidente_accoes_correctivas_relatorioIncidenteI_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_fotografias" ADD CONSTRAINT "relatorio_incidente_fotografias_fotografiaId_fkey" FOREIGN KEY ("fotografiaId") REFERENCES "fotografias_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_incidente_fotografias" ADD CONSTRAINT "relatorio_incidente_fotografias_relatorioIncidenteId_fkey" FOREIGN KEY ("relatorioIncidenteId") REFERENCES "relatorios_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_membros_equipa" ADD CONSTRAINT "objetivos_metas_membros_equipa_membroEquipaId_fkey" FOREIGN KEY ("membroEquipaId") REFERENCES "membros_equipa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_membros_equipa" ADD CONSTRAINT "objetivos_metas_membros_equipa_objetivoMetaId_fkey" FOREIGN KEY ("objetivoMetaId") REFERENCES "objetivos_metas_ambientais_sociais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_tabela_accoes" ADD CONSTRAINT "objetivos_metas_tabela_accoes_objetivoMetaId_fkey" FOREIGN KEY ("objetivoMetaId") REFERENCES "objetivos_metas_ambientais_sociais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objetivos_metas_tabela_accoes" ADD CONSTRAINT "objetivos_metas_tabela_accoes_tabelaAccaoId_fkey" FOREIGN KEY ("tabelaAccaoId") REFERENCES "tabela_accoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_inicial_incidente_incidentes" ADD CONSTRAINT "relatorio_inicial_incidente_incidentes_incidenteId_fkey" FOREIGN KEY ("incidenteId") REFERENCES "incidentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorio_inicial_incidente_incidentes" ADD CONSTRAINT "relatorio_inicial_incidente_incidentes_relatorioInicialId_fkey" FOREIGN KEY ("relatorioInicialId") REFERENCES "relatorios_iniciais_incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_ambiental_impactado" ADD CONSTRAINT "factor_ambiental_impactado_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riscos_impactos" ADD CONSTRAINT "riscos_impactos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_factorAmbientalImp_fkey" FOREIGN KEY ("factorAmbientalImpactadoId") REFERENCES "factor_ambiental_impactado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_riscosImpactosId_fkey" FOREIGN KEY ("riscosImpactosId") REFERENCES "riscos_impactos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_avaliacao_riscos_impactos" ADD CONSTRAINT "identificacao_avaliacao_riscos_impactos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_requisitos_legais" ADD CONSTRAINT "controle_requisitos_legais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_requisitos_legais" ADD CONSTRAINT "controle_requisitos_legais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_do_contacto" ADD CONSTRAINT "pessoa_do_contacto_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel_pelo_preenchimento" ADD CONSTRAINT "responsavel_pelo_preenchimento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsavel_pela_verificacao" ADD CONSTRAINT "responsavel_pela_verificacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biodiversidade_recursos_naturais" ADD CONSTRAINT "biodiversidade_recursos_naturais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subprojecto" ADD CONSTRAINT "subprojecto_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_riscos_ambientais_sociais_subprojecto" ADD CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_biodiv_fkey" FOREIGN KEY ("biodiversidadeRecursosNaturaisId") REFERENCES "biodiversidade_recursos_naturais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identificacao_riscos_ambientais_sociais_subprojecto" ADD CONSTRAINT "identificacao_riscos_ambientais_sociais_subprojecto_tenant_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_responsavelPelaVerificacaoId_fkey" FOREIGN KEY ("responsavelPelaVerificacaoId") REFERENCES "responsavel_pela_verificacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_responsavelPeloPreenchimentoId_fkey" FOREIGN KEY ("responsavelPeloPreenchimentoId") REFERENCES "responsavel_pelo_preenchimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_resultadoTriagemId_fkey" FOREIGN KEY ("resultadoTriagemId") REFERENCES "resultado_triagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social" ADD CONSTRAINT "triagem_ambiental_social_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_and_engagement" ADD CONSTRAINT "consultation_and_engagement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_subprojectoId_fkey" FOREIGN KEY ("subprojectoId") REFERENCES "subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_triagem" ADD CONSTRAINT "resultado_triagem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_informacao_ambiental_preliminar" ADD CONSTRAINT "ficha_informacao_ambiental_preliminar_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ficha_informacao_ambiental_preliminar" ADD CONSTRAINT "ficha_informacao_ambiental_preliminar_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social_identificacao_riscos" ADD CONSTRAINT "triagem_ambiental_social_identificacao_riscos_identificaca_fkey" FOREIGN KEY ("identificacaoRiscosId") REFERENCES "identificacao_riscos_ambientais_sociais_subprojecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triagem_ambiental_social_identificacao_riscos" ADD CONSTRAINT "triagem_ambiental_social_identificacao_riscos_triagemAmbie_fkey" FOREIGN KEY ("triagemAmbientalSocialId") REFERENCES "triagem_ambiental_social"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_treinamento" ADD CONSTRAINT "areas_treinamento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixa_ferramentas" ADD CONSTRAINT "caixa_ferramentas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcao" ADD CONSTRAINT "funcao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_areaTreinamentoId_fkey" FOREIGN KEY ("areaTreinamentoId") REFERENCES "areas_treinamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_caixaFerramentasId_fkey" FOREIGN KEY ("caixaFerramentasId") REFERENCES "caixa_ferramentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_funcaoId_fkey" FOREIGN KEY ("funcaoId") REFERENCES "funcao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriz_treinamento" ADD CONSTRAINT "matriz_treinamento_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas" ADD CONSTRAINT "politicas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manuais" ADD CONSTRAINT "manuais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manuais" ADD CONSTRAINT "manuais_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios" ADD CONSTRAINT "formularios_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formularios" ADD CONSTRAINT "formularios_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
