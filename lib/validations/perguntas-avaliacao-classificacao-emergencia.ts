import { z } from 'zod';

export const perguntaAvaliacaoClassificacaoEmergenciaSchema = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }),
  pergunta: z
    .string()
    .min(3, { message: 'Pergunta deve ter pelo menos 3 caracteres' }),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
});

export type PerguntaAvaliacaoClassificacaoEmergenciaFormData = z.infer<
  typeof perguntaAvaliacaoClassificacaoEmergenciaSchema
>;
