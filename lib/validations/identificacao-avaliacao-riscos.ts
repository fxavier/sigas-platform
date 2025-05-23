// lib/validations/identificacao-avaliacao-riscos.ts
import { z } from 'zod';

export const identificacaoAvaliacaoRiscosSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  numeroReferencia: z.string().optional().nullable(),
  processo: z.string().optional().nullable(),
  actiactividade: z.string().min(1, { message: 'Atividade é obrigatória' }),
  riscosImpactosId: z
    .string()
    .min(1, { message: 'Risco/Impacto é obrigatório' }),
  realOuPotencial: z.string().optional().nullable(),
  condicao: z.enum(['NORMAL', 'ANORMAL', 'EMERGENCIA']),
  factorAmbientalImpactadoId: z
    .string()
    .min(1, { message: 'Fator Ambiental é obrigatório' }),
  faseProjecto: z.enum([
    'PRE_CONSTRUCAO',
    'CONSTRUCAO',
    'OPERACAO',
    'DESATIVACAO',
    'ENCERRAMENTO',
    'RESTAURACAO',
  ]),
  estatuto: z.enum(['POSITIVO', 'NEGATIVO']),
  extensao: z.enum(['LOCAL', 'REGIONAL', 'NACIONAL', 'GLOBAL']),
  duduacao: z.enum(['CURTO_PRAZO', 'MEDIO_PRAZO', 'LONGO_PRAZO']),
  intensidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']),
  probabilidade: z.enum([
    'IMPROVAVEL',
    'PROVAVEL',
    'ALTAMENTE_PROVAVEL',
    'DEFINITIVA',
  ]),
  significancia: z.string().optional().nullable(),
  duracaoRisco: z.string().optional().nullable(),
  descricaoMedidas: z
    .string()
    .min(1, { message: 'Descrição das medidas é obrigatória' }),
  respresponsavelonsible: z.string().optional().nullable(),
  prazo: z.coerce.date(),
  referenciaDocumentoControl: z.string().optional().nullable(),
  legislacaoMocambicanaAplicavel: z.string().optional().nullable(),
  observacoes: z.string().min(1, { message: 'Observações são obrigatórias' }),
});

export type IdentificacaoAvaliacaoRiscosFormData = z.infer<
  typeof identificacaoAvaliacaoRiscosSchema
>;
