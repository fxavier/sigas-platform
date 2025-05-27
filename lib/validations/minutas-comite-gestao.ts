// lib/validations/minutas-comite-gestao.ts
import { z } from 'zod';

// Schema for ResultadoComiteGestaoAmbientalESocial (results/outcomes)
export const resultadoComiteSchema = z.object({
  id: z.string().optional(),
  pontosDebatidos: z
    .string()
    .min(1, { message: 'Pontos debatidos são obrigatórios' })
    .max(2000, {
      message: 'Pontos debatidos devem ter no máximo 2000 caracteres',
    }),
  accoesNecessarias: z
    .string()
    .min(1, { message: 'Ações necessárias são obrigatórias' })
    .max(1000, {
      message: 'Ações necessárias devem ter no máximo 1000 caracteres',
    }),
  responsavel: z
    .string()
    .min(1, { message: 'Responsável é obrigatório' })
    .max(200, { message: 'Responsável deve ter no máximo 200 caracteres' }),
  prazo: z
    .string()
    .min(1, { message: 'Prazo é obrigatório' })
    .max(100, { message: 'Prazo deve ter no máximo 100 caracteres' }),
  situacao: z
    .string()
    .min(1, { message: 'Situação é obrigatória' })
    .max(200, { message: 'Situação deve ter no máximo 200 caracteres' }),
  revisaoEAprovacao: z
    .string()
    .min(1, { message: 'Revisão e aprovação são obrigatórias' })
    .max(500, {
      message: 'Revisão e aprovação devem ter no máximo 500 caracteres',
    }),
  dataRevisaoEAprovacao: z.date({
    required_error: 'Data de revisão e aprovação é obrigatória',
    invalid_type_error: 'Data deve ser uma data válida',
  }),
});

// Main schema for MinutasComiteGestaoAmbientalESocial
export const minutasComiteGestaoSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  presididoPor: z
    .string()
    .min(1, { message: 'Presidido por é obrigatório' })
    .max(200, { message: 'Presidido por deve ter no máximo 200 caracteres' }),
  convidado: z
    .string()
    .min(1, { message: 'Convidado é obrigatório' })
    .max(500, { message: 'Convidado deve ter no máximo 500 caracteres' }),
  ausenciasJustificadas: z
    .string()
    .max(500, {
      message: 'Ausências justificadas devem ter no máximo 500 caracteres',
    })
    .optional(),
  data: z.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data deve ser uma data válida',
  }),
  hora: z
    .string()
    .min(1, { message: 'Hora é obrigatória' })
    .max(50, { message: 'Hora deve ter no máximo 50 caracteres' }),
  local: z
    .string()
    .min(1, { message: 'Local é obrigatório' })
    .max(300, { message: 'Local deve ter no máximo 300 caracteres' }),
  agenda: z
    .string()
    .min(1, { message: 'Agenda é obrigatória' })
    .max(2000, { message: 'Agenda deve ter no máximo 2000 caracteres' }),
  resultadoComiteGestaoAmbientalESocialId: z
    .string()
    .min(1, { message: 'Resultado do comitê é obrigatório' }),
  // Include the resultado data for creation
  resultado: resultadoComiteSchema.optional(),
});

export type ResultadoComiteFormData = z.infer<typeof resultadoComiteSchema>;
export type MinutasComiteGestaoFormData = z.infer<
  typeof minutasComiteGestaoSchema
>;

// Combined form data for creation (includes both minuta and resultado)
export const minutasComiteGestaoCompletoSchema = z.object({
  minuta: minutasComiteGestaoSchema.omit({
    resultadoComiteGestaoAmbientalESocialId: true,
    resultado: true,
  }),
  resultado: resultadoComiteSchema.omit({ id: true }),
});

export type MinutasComiteGestaoCompletoFormData = z.infer<
  typeof minutasComiteGestaoCompletoSchema
>;
