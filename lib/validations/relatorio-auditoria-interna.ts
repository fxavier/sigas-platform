// lib/validations/relatorio-auditoria-interna.ts
import { z } from 'zod';

export const descricaoNaoConformidadeSchema = z.object({
  processo: z.string().min(1, { message: 'Processo é obrigatório' }),
  clausula: z.string().min(1, { message: 'Cláusula é obrigatória' }),
  naoConformidade: z
    .string()
    .min(1, { message: 'Descrição da não conformidade é obrigatória' }),
});

export const relatorioAuditoriaInternaSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  ambitoAuditoria: z
    .string()
    .min(1, { message: 'Âmbito da auditoria é obrigatório' }),
  dataAuditoria: z.date({ required_error: 'Data da auditoria é obrigatória' }),
  dataRelatorio: z.date({ required_error: 'Data do relatório é obrigatória' }),
  auditorLider: z.string().min(1, { message: 'Auditor líder é obrigatório' }),
  auditorObservador: z
    .string()
    .min(1, { message: 'Auditor observador é obrigatório' }),
  resumoAuditoria: z
    .string()
    .min(1, { message: 'Resumo da auditoria é obrigatório' }),
  descricaoNaoConformidades: z.array(descricaoNaoConformidadeSchema).optional(),
});

export type RelatorioAuditoriaInternaFormData = z.infer<
  typeof relatorioAuditoriaInternaSchema
>;
export type DescricaoNaoConformidadeFormData = z.infer<
  typeof descricaoNaoConformidadeSchema
>;
