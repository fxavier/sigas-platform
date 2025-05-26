import { z } from 'zod';

export const incidenteSchema = z.object({
  id: z.string().optional(),
  descricao: z
    .string()
    .min(1, { message: 'Descrição é obrigatória' })
    .max(100, { message: 'Descrição deve ter no máximo 100 caracteres' }),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
});

export type IncidenteFormData = z.infer<typeof incidenteSchema>;
