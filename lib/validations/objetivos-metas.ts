import { z } from 'zod';

export const objetivosMetasSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  numeroRefOAndM: z
    .string()
    .min(1, { message: 'Número de referência é obrigatório' }),
  aspetoRefNumero: z
    .string()
    .min(1, { message: 'Aspeto/Ref. número é obrigatório' }),
  centroCustos: z
    .string()
    .min(1, { message: 'Centro de custos é obrigatório' }),
  objectivo: z.string().min(1, { message: 'Objetivo é obrigatório' }),
  publicoAlvo: z.string().min(1, { message: 'Público alvo é obrigatório' }),
  orcamentoRecursos: z
    .string()
    .min(1, { message: 'Orçamento/recursos é obrigatório' }),
  refDocumentoComprovativo: z.string().optional().nullable(),
  dataInicio: z.date({ required_error: 'Data de início é obrigatória' }),
  dataConclusaoPrevista: z.date({
    required_error: 'Data de conclusão prevista é obrigatória',
  }),
  dataConclusaoReal: z.date({
    required_error: 'Data de conclusão real é obrigatória',
  }),
  pgasAprovadoPor: z
    .string()
    .min(1, { message: 'Nome do aprovador é obrigatório' }),
  dataAprovacao: z.date({ required_error: 'Data de aprovação é obrigatória' }),
  observacoes: z.string().min(1, { message: 'Observações são obrigatórias' }),
  oAndMAlcancadoFechado: z.enum(['SIM', 'NAO'], {
    required_error: 'Status é obrigatório',
  }),
  assinaturaDirectorGeral: z
    .string()
    .min(1, { message: 'Assinatura do Diretor Geral é obrigatória' }),
  data: z.date({ required_error: 'Data é obrigatória' }),
  membrosDaEquipaIds: z.array(z.string()).optional(),
  tabelasAcoesIds: z.array(z.string()).optional(),
});

export type ObjetivosMetasFormData = z.infer<typeof objetivosMetasSchema>;
