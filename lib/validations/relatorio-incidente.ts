import { z } from 'zod';

export const relatorioIncidenteSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  dataIncidente: z.date({ required_error: 'Data do incidente é obrigatória' }),
  horaIncident: z.date({ required_error: 'Hora do incidente é obrigatória' }),
  descricaoDoIncidente: z
    .string()
    .min(1, { message: 'Descrição do incidente é obrigatória' }),
  detalhesLesao: z
    .string()
    .min(1, { message: 'Detalhes da lesão são obrigatórios' }),
  accoesImediatasTomadas: z
    .string()
    .min(1, { message: 'Ações imediatas tomadas são obrigatórias' }),
  tipoFuncionario: z.enum(['CONTRATADO', 'INCIDENTE_DE_TERCEIROS'], {
    required_error: 'Tipo de funcionário é obrigatório',
  }),
  categoriaPessoaEnvolvida: z
    .string()
    .min(1, { message: 'Categoria da pessoa envolvida é obrigatória' }),
  formaActividade: z.enum(['CONTROLADA', 'NAO_CONTROLADA', 'MONITORADA'], {
    required_error: 'Forma de atividade é obrigatória',
  }),
  foiRealizadaAvaliacaoRisco: z.enum(['SIM', 'NAO'], {
    required_error: 'Avaliação de risco é obrigatória',
  }),
  existePadraoControleRisco: z.enum(['SIM', 'NAO'], {
    required_error: 'Padrão de controle de risco é obrigatório',
  }),
  tipoConsequenciaIncidenteReal: z.string().optional().nullable(),
  tipoConsequenciaIncidentePotencial: z.string().optional().nullable(),
  efeitosIncidenteReal: z.enum(
    ['SAUDE', 'SEGURANCA', 'AMBIENTE', 'COMUNIDADE'],
    {
      required_error: 'Efeitos do incidente real são obrigatórios',
    }
  ),
  classificacaoGravidadeIncidenteReal: z.string().optional().nullable(),
  efeitosIncidentePotencial: z
    .enum(['SAUDE', 'SEGURANCA', 'AMBIENTE', 'COMUNIDADE'])
    .optional()
    .nullable(),
  classificacaoGravidadeIncidentePotencial: z.string().optional().nullable(),
  esteFoiIncidenteSemBarreira: z.enum(['SIM', 'NAO'], {
    required_error: 'Incidente sem barreira é obrigatório',
  }),
  foiIncidenteRepetitivo: z.enum(['SIM', 'NAO'], {
    required_error: 'Incidente repetitivo é obrigatório',
  }),
  foiIncidenteResultanteFalhaProcesso: z.enum(['SIM', 'NAO'], {
    required_error: 'Incidente resultante de falha de processo é obrigatório',
  }),
  danosMateriais: z.enum(['SIM', 'NAO'], {
    required_error: 'Danos materiais é obrigatório',
  }),
  valorDanos: z
    .number()
    .min(0, { message: 'Valor deve ser positivo' })
    .optional()
    .nullable(),
  statusInvestigacao: z.string().optional().nullable(),
  dataInvestigacaoCompleta: z.date().optional().nullable(),
  ausenciaOuFalhaDefesas: z.enum(['SIM', 'NAO']).optional().nullable(),
  descricaoAusenciaOuFalhaDefesas: z.string().optional().nullable(),
  accoesIndividuaisOuEquipe: z.string().optional().nullable(),
  descricaoAccaoIndividualOuEquipe: z.string().optional().nullable(),
  tarefaOuCondicoesAmbientaisLocalTrabalho: z.string().optional().nullable(),
  descricaoTarefaOuCondicoesAmbientaisLocalTrabalho: z
    .string()
    .optional()
    .nullable(),
  tarefaOuCondicoesAmbientaisHumano: z.string().optional().nullable(),
  descricaoTarefaOuCondicoesAmbientaisHumano: z.string().optional().nullable(),
  factoresOrganizacionais: z.string().optional().nullable(),
  descricaoFactoresOrganizacionais: z.string().optional().nullable(),
  causasSubjacentesEPrincipaisFactoresContribuintes: z
    .string()
    .optional()
    .nullable(),
  descricaoIncidenteAposInvestigacao: z.string().optional().nullable(),
  principaisLicoes: z.string().optional().nullable(),
  resgistoRiscoActivosActualizadosAposInvestigacao: z
    .enum(['SIM', 'NAO'])
    .optional()
    .nullable(),
  voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao: z
    .enum(['SIM', 'NAO'])
    .optional()
    .nullable(),
  comoPartilhou: z.string().optional().nullable(),
  superiorHierarquicoResponsavel: z.string().optional().nullable(),
  telefoneSuperiorHierarquicoResponsavel: z.string().optional().nullable(),
  tituloSuperiorHierarquicoResponsavel: z.string().optional().nullable(),
  emailSuperiorHierarquicoResponsavel: z
    .string()
    .email({ message: 'Email inválido' })
    .optional()
    .nullable(),

  // Relationship IDs
  pessoasEnvolvidasIds: z.array(z.string()).optional(),
  accoesCorrectivasIds: z.array(z.string()).optional(),
  fotografiasIds: z.array(z.string()).optional(),
});

export type RelatorioIncidenteFormData = z.infer<
  typeof relatorioIncidenteSchema
>;
