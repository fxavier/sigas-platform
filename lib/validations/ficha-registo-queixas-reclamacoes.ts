// lib/validations/ficha-registo-queixas-reclamacoes.ts
import { z } from 'zod';

export const fichaRegistoQueixasReclamacoesSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),

  // Basic complaint information
  numeroQueixa: z
    .string()
    .min(1, { message: 'Número da queixa é obrigatório' }),
  nomeCompletoReclamante: z.string().optional().nullable(),
  genero: z.enum(['MASCULINO', 'FEMININO'], {
    required_error: 'Gênero é obrigatório',
  }),
  idade: z
    .number()
    .min(1, { message: 'Idade deve ser maior que 0' })
    .max(120, { message: 'Idade inválida' }),
  celular: z.string().min(1, { message: 'Celular é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),

  // Address information
  endereco: z.string().min(1, { message: 'Endereço é obrigatório' }),
  quarteirao: z.string().min(1, { message: 'Quarteirão é obrigatório' }),
  bairro: z.string().min(1, { message: 'Bairro é obrigatório' }),
  localidade: z.string().min(1, { message: 'Localidade é obrigatória' }),
  postoAdministrativo: z
    .string()
    .min(1, { message: 'Posto Administrativo é obrigatório' }),
  distrito: z.string().min(1, { message: 'Distrito é obrigatório' }),
  local: z.string().min(1, { message: 'Local é obrigatório' }),

  // Complaint details
  dataReclamacao: z.date({
    required_error: 'Data da reclamação é obrigatória',
  }),
  hora: z.string().min(1, { message: 'Hora é obrigatória' }),
  breveDescricaoFactos: z
    .string()
    .min(1, { message: 'Descrição dos factos é obrigatória' }),

  // Complaint acceptance
  queixaAceita: z.enum(['SIM', 'NAO'], {
    required_error: 'Aceitação da queixa é obrigatória',
  }),
  justificativaParaRejeicao: z.string().optional().nullable(),

  // Notification
  reclamanteNotificado: z.enum(['SIM', 'NAO']).optional().nullable(),
  metodoNotificacao: z
    .enum(['CARTA', 'EMAIL', 'WHATSAPP', 'OUTRO'])
    .optional()
    .nullable(),
  outroMetodoNotificacao: z.string().optional().nullable(),

  // Complaint categorization - relationships
  categoriaQueixaId: z.string().optional().nullable(),
  subcategoriaQueixaIds: z.array(z.string()).optional(),

  // Investigation and resolution
  descricao_factos_apos_investigacao: z.string().optional().nullable(),
  dataEncerramento: z.date().optional().nullable(),

  // Resolution actions - relationship
  resolucaoQueixaIds: z.array(z.string()).optional(),

  // Closure notification
  reclamanteNotificadoSobreEncerramento: z
    .enum(['SIM', 'NAO'])
    .optional()
    .nullable(),
  reclamanteSatisfeito: z.enum(['SIM', 'NAO']).optional().nullable(),

  // Documentation - relationship with file metadata
  fotosDocumentosComprovativoEncerramentoIds: z.array(z.string()).optional(),

  // Cost and timeline
  recursosGastosReparacaoReclamacao: z.string().optional().nullable(),
  dataEncerramentoReclamacao: z.date().optional().nullable(),
  diasDesdeQueixaAoEncerramento: z.number().optional().nullable(),

  // Post-closure monitoring
  monitoriaAposEncerramento: z.enum(['SIM', 'NAO']).optional().nullable(),
  accaoMonitoriaAposEncerramento: z.string().optional().nullable(),
  responsavelMonitoriaAposEncerramento: z.string().optional().nullable(),
  prazoMonitoriaAposEncerramento: z.string().optional().nullable(),
  estadoMonitoriaAposEncerramento: z.string().optional().nullable(),

  // Preventive actions
  accoesPreventivasSugeridas: z.string().optional().nullable(),
  responsavelAccoesPreventivasSugeridas: z.string().optional().nullable(),
  prazoAccoesPreventivasSugeridas: z.string().optional().nullable(),
  estadoAccoesPreventivasSugeridas: z.string().optional().nullable(),
});

export type FichaRegistoQueixasReclamacoesFormData = z.infer<
  typeof fichaRegistoQueixasReclamacoesSchema
>;
