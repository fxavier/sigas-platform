import { z } from 'zod';

export const relatorioInicialIncidenteSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  dataIncidente: z.coerce.date({
    required_error: 'Data do incidente é obrigatória',
  }),
  horaIncidente: z.coerce.date({
    required_error: 'Hora do incidente é obrigatória',
  }),
  seccao: z.string().optional().nullable(),
  localIncidente: z
    .string()
    .min(1, { message: 'Local do incidente é obrigatório' }),
  dataComunicacao: z.coerce.date({
    required_error: 'Data de comunicação é obrigatória',
  }),
  supervisor: z.string().min(1, { message: 'Supervisor é obrigatório' }),
  tipoIncidente: z.enum(
    [
      'FATALIDADE',
      'OCORRENCIA_PERIGOSA',
      'INCIDENTE_QUASE_ACIDENTE',
      'TEMPO_PERDIDO',
      'INCIDENTE_AMBIENTAL',
      'SEGURANCA',
      'RECLAMACAO_EXTERNA',
      'NOTIFICACAO_DO_REGULADOR_VIOLACAO',
      'DERAMAMENTO_LBERACAO_DESCONTROLADA',
      'DANOS_PERDAS',
      'FLORA_FAUNA',
      'AUDITORIA_NAO_CONFORMIDADE',
    ],
    {
      required_error: 'Tipo de incidente é obrigatório',
    }
  ),
  empregado: z.enum(['SIM', 'NAO']).optional().nullable(),
  nomeFuncionario: z.string().optional().nullable(),
  subcontratante: z.enum(['SIM', 'NAO']).optional().nullable(),
  nomeSubcontratado: z.string().optional().nullable(),
  descricaoCircunstanciaIncidente: z.string().min(1, {
    message: 'Descrição da circunstância do incidente é obrigatória',
  }),
  infoSobreFeriodosETratamentoFeito: z
    .string()
    .min(1, { message: 'Informação sobre feridos e tratamento é obrigatória' }),
  declaracaoDeTestemunhas: z.string().optional().nullable(),
  conclusaoPreliminar: z.string().optional().nullable(),
  recomendacoes: z
    .string()
    .min(1, { message: 'Recomendações são obrigatórias' }),
  inclusaoEmMateriaSeguranca: z.string().optional().nullable(),
  prazo: z.coerce.date().optional().nullable(),
  necessitaDeInvestigacaoAprofundada: z.enum(['SIM', 'NAO'], {
    required_error: 'Necessita de investigação aprofundada é obrigatório',
  }),
  incidenteReportavel: z.enum(['SIM', 'NAO'], {
    required_error: 'Incidente reportável é obrigatório',
  }),
  credoresObrigadosASeremNotificados: z.enum(['SIM', 'NAO'], {
    required_error: 'Credores obrigados a serem notificados é obrigatório',
  }),
  autorDoRelatorio: z.string().optional().nullable(),
  dataCriacao: z.coerce.date({
    required_error: 'Data de criação é obrigatória',
  }),
  nomeProvedor: z
    .string()
    .min(1, { message: 'Nome do provedor é obrigatório' }),
  data: z.coerce.date({ required_error: 'Data é obrigatória' }),

  // Relationship IDs
  incidentesIds: z.array(z.string()).optional(),
});

export type RelatorioInicialIncidenteFormData = z.infer<
  typeof relatorioInicialIncidenteSchema
>;
