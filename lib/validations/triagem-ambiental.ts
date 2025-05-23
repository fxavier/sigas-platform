// lib/validations/triagem-ambiental.ts
import { z } from 'zod';

// Schema for risk identification items
export const identificacaoRiscoSchema = z.object({
  biodiversidadeRecursosNaturaisId: z.string().min(1, {
    message: 'Biodiversidade Recursos Naturais ID é obrigatório',
  }),
  resposta: z.enum(['SIM', 'NAO']),
  comentario: z.string().optional().nullable(),
  normaAmbientalSocial: z.string().optional().nullable(),
});

// Main schema for environmental screening form
export const triagemAmbientalSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  responsavelPeloPreenchimentoId: z.string().min(1, {
    message: 'Responsável pelo preenchimento é obrigatório',
  }),
  responsavelPelaVerificacaoId: z.string().min(1, {
    message: 'Responsável pela verificação é obrigatório',
  }),
  subprojectoId: z.string().min(1, { message: 'Subprojeto é obrigatório' }),
  consultaEngajamento: z.string().optional().nullable(),
  accoesRecomendadas: z.string().optional().nullable(),
  resultadoTriagemId: z.string().min(1, {
    message: 'Resultado da triagem é obrigatório',
  }),
  identificacaoRiscos: z.array(identificacaoRiscoSchema).optional(),
});

export type IdentificacaoRiscoFormData = z.infer<
  typeof identificacaoRiscoSchema
>;
export type TriagemAmbientalFormData = z.infer<typeof triagemAmbientalSchema>;
