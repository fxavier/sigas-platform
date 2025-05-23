import { z } from 'zod';

export const controleRequisitosSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  numnumero: z.string().min(1, { message: 'Número é obrigatório' }),
  tituloDocumento: z
    .string()
    .min(1, { message: 'Título do documento é obrigatório' }),
  descricao: z.coerce.date(),
  revocacoesAlteracoes: z.string().optional().nullable(),
  requisitoConformidade: z.string().optional().nullable(),
  dataControle: z.coerce.date(),
  observation: z.string().optional().nullable(),
  ficheiroDaLei: z.string().optional().nullable(),
});

// Separate schema for updates that makes ID required
export const controleRequisitosUpdateSchema = controleRequisitosSchema.extend({
  id: z.string().min(1, { message: 'ID é obrigatório' }),
});

export type ControleRequisitosFormData = z.infer<
  typeof controleRequisitosSchema
>;
