import { z } from 'zod';

export const matrizTreinamentoSchema = z
  .object({
    tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
    projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
    data: z.coerce.date().optional().nullable(),
    funcaoId: z.string().min(1, { message: 'Função é obrigatória' }),
    areaTreinamentoId: z
      .string()
      .min(1, { message: 'Área de treinamento é obrigatória' }),
    caixaFerramentasId: z
      .string()
      .min(1, { message: 'Caixa de ferramentas é obrigatória' }),
    totais_palestras: z
      .number()
      .min(0, { message: 'Total de palestras deve ser positivo' }),
    total_horas: z
      .number()
      .min(0, { message: 'Total de horas deve ser positivo' }),
    total_caixa_ferramentas: z
      .number()
      .min(0, { message: 'Total de caixa de ferramentas deve ser positivo' }),
    total_pessoas_informadas_caixa_ferramentas: z
      .number()
      .min(0, { message: 'Total de pessoas informadas deve ser positivo' }),
    eficacia: z.enum(['Eficaz', 'Nao_Eficaz'], {
      required_error: 'Eficácia é obrigatória',
    }),
    accoes_treinamento_nao_eficaz: z.string().optional().nullable(),
    aprovado_por: z.string().min(1, { message: 'Aprovado por é obrigatório' }),
  })
  .refine(
    (data) => {
      // If eficacia is "Nao_Eficaz", then accoes_treinamento_nao_eficaz is required
      if (data.eficacia === 'Nao_Eficaz') {
        return (
          data.accoes_treinamento_nao_eficaz &&
          data.accoes_treinamento_nao_eficaz.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        'Ações de treinamento não eficaz são obrigatórias quando a eficácia é "Não Eficaz"',
      path: ['accoes_treinamento_nao_eficaz'],
    }
  );

export type MatrizTreinamentoFormData = z.infer<typeof matrizTreinamentoSchema>;
