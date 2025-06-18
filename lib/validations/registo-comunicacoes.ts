// lib/validations/registo-comunicacoes.ts
import { z } from 'zod';

export const registoComunicacoesSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  data: z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (val instanceof Date) {
        return val;
      }
      if (typeof val === 'string' && val.trim() !== '') {
        return new Date(val);
      }
      throw new Error('Data é obrigatória');
    })
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Data deve ser uma data válida',
    }),
  local: z
    .string()
    .min(1, { message: 'Local é obrigatório' })
    .max(200, { message: 'Local deve ter no máximo 200 caracteres' }),
  horario: z
    .string()
    .min(1, { message: 'Horário é obrigatório' })
    .max(50, { message: 'Horário deve ter no máximo 50 caracteres' }),
  agenda: z
    .string()
    .min(1, { message: 'Agenda é obrigatória' })
    .max(1000, { message: 'Agenda deve ter no máximo 1000 caracteres' }),
  participantes: z
    .string()
    .min(1, { message: 'Participantes são obrigatórios' })
    .max(1000, { message: 'Participantes deve ter no máximo 1000 caracteres' }),
  encontroAtendeuSeuProposito: z.enum(['SIM', 'NAO'], {
    required_error: 'Resposta sobre o propósito do encontro é obrigatória',
  }),
  porqueNaoAtendeu: z
    .string()
    .max(500, { message: 'Justificativa deve ter no máximo 500 caracteres' })
    .optional(),
  haNecessidadeRetomarTema: z.enum(['SIM', 'NAO'], {
    required_error: 'Resposta sobre necessidade de retomar tema é obrigatória',
  }),
  poruqNecessarioRetomarTema: z
    .string()
    .max(500, { message: 'Justificativa deve ter no máximo 500 caracteres' })
    .optional(),
});

export type RegistoComunicacoesFormData = z.infer<
  typeof registoComunicacoesSchema
>;

// Enum for RespostaSimNao
export const RespostaSimNaoEnum = {
  Values: {
    SIM: 'SIM',
    NAO: 'NAO',
  } as const,
};

// Helper function to translate enum values
export const translateRespostaSimNao = (value: string): string => {
  const translations: Record<string, string> = {
    SIM: 'Sim',
    NAO: 'Não',
  };
  return translations[value] || value;
};
