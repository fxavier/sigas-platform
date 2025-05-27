// lib/validations/formulario-registo-reclamacoes-trabalhadores.ts
import { z } from 'zod';

export const formularioRegistoReclamacoesTrabalhadoresSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),

  // Worker complaint information
  nome: z.string().optional().nullable(),
  empresa: z.string().min(1, { message: 'Empresa é obrigatória' }),
  dataReclamacao: z.date({
    required_error: 'Data da reclamação é obrigatória',
  }),
  horaReclamacao: z
    .string()
    .min(1, { message: 'Hora da reclamação é obrigatória' }),

  // Contact preferences
  metodoPreferidoDoContacto: z.enum(['TELEFONE', 'EMAIL', 'PRESENCIAL'], {
    required_error: 'Método preferido de contacto é obrigatório',
  }),
  detalhesDoContacto: z
    .string()
    .min(1, { message: 'Detalhes do contacto são obrigatórios' }),

  // Language preferences
  linguaPreferida: z.enum(['PORTUGUES', 'INGLES', 'OUTRO'], {
    required_error: 'Língua preferida é obrigatória',
  }),
  outraLinguaPreferida: z.string().optional().nullable(),

  // Complaint details
  detalhesDareclamacao: z
    .string()
    .min(1, { message: 'Detalhes da reclamação são obrigatórios' }),

  // Reception responsible details
  numeroIdentificacaoResponsavelRecepcao: z
    .string()
    .min(1, {
      message: 'Número de identificação do responsável é obrigatório',
    }),
  nomeResponsavelRecepcao: z.string().optional().nullable(),
  funcaoResponsavelRecepcao: z.string().optional().nullable(),
  assinaturaResponsavelRecepcao: z.string().optional().nullable(),
  dataRecepcao: z.string().optional().nullable(),
  detalhesResponsavelRecepcao: z.string().optional().nullable(),

  // Follow-up details
  detalhesAcompanhamento: z.string().optional().nullable(),
  dataEncerramento: z.date().optional().nullable(),
  assinatura: z.string().optional().nullable(),

  // Confirmation details
  confirmarRecepcaoResposta: z.enum(['SIM', 'NAO']).optional().nullable(),
  nomeDoConfirmante: z.string().optional().nullable(),
  dataConfirmacao: z.date().optional().nullable(),
  assinaturaConfirmacao: z.string().optional().nullable(),
});

export type FormularioRegistoReclamacoesTrabalhadoresFormData = z.infer<
  typeof formularioRegistoReclamacoesTrabalhadoresSchema
>;
