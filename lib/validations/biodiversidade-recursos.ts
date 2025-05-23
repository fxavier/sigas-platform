// lib/validations/biodiversidade-recursos.ts
import { z } from 'zod';

export const biodiversidadeRecursosSchema = z.object({
  id: z.string().optional(),
  reference: z.string().min(1, { message: 'Referência é obrigatória' }),
  description: z
    .string()
    .min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' }),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
});

export type BiodiversidadeRecursosFormData = z.infer<
  typeof biodiversidadeRecursosSchema
>;
