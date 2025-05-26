// lib/validations/relatorio-simulacro.ts
import { z } from 'zod';

// Schema for avaliacao classificacao emergencia items
export const avaliacaoClassificacaoEmergenciaSchema = z.object({
  perguntaId: z.string().min(1, {
    message: 'Pergunta ID é obrigatório',
  }),
  resposta: z.enum(['SIM', 'NAO', 'N_A']),
  comentarios: z.string().optional().nullable(),
});

// Schema for recomendacoes items
export const recomendacoesSchema = z.object({
  acao: z.string().min(1, { message: 'Ação é obrigatória' }),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }),
  prazo: z.string().min(1, { message: 'Prazo é obrigatório' }),
});

// Main schema for relatorio de simulacro form
export const relatorioSimulacroSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  local: z.string().min(1, { message: 'Local é obrigatório' }),
  tipoEmergenciaSimulada: z.enum(['SAUDE_E_SEGURANCA', 'AMBIENTAL'], {
    required_error: 'Tipo de emergência simulada é obrigatório',
  }),
  objectoDoSimulacro: z.enum(
    [
      'DISPOSITIVOS_DE_EMERGENCIA',
      'REACAO_DOS_COLABORADORES',
      'ACTUACAO_DA_EQUIPA_DE_EMERGENCIA',
    ],
    {
      required_error: 'Objeto do simulacro é obrigatório',
    }
  ),
  descricaoDocenario: z
    .string()
    .min(1, { message: 'Descrição do cenário é obrigatória' }),
  assinaturaCoordenadorEmergencia: z
    .string()
    .min(1, {
      message: 'Assinatura do coordenador de emergência é obrigatória',
    }),
  outraAssinatura: z.string().optional().nullable(),
  avaliacaoClassificacaoEmergencia: z
    .array(avaliacaoClassificacaoEmergenciaSchema)
    .optional(),
  recomendacoes: z.array(recomendacoesSchema).optional(),
});

export type AvaliacaoClassificacaoEmergenciaFormData = z.infer<
  typeof avaliacaoClassificacaoEmergenciaSchema
>;
export type RecomendacoesFormData = z.infer<typeof recomendacoesSchema>;
export type RelatorioSimulacroFormData = z.infer<
  typeof relatorioSimulacroSchema
>;
