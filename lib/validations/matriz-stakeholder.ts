// lib/validations/matriz-stakeholder.ts
import { z } from 'zod';

export const matrizStakeholderSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  stakeholder: z
    .string()
    .min(1, { message: 'Nome do stakeholder é obrigatório' }),
  categoriaId: z.string().min(1, { message: 'Categoria é obrigatória' }),
  alcance: z.enum(['LOCAL', 'REGIONAL', 'NACIONAL', 'INTERNACIONAL'], {
    required_error: 'Alcance é obrigatório',
  }),
  areaActuacaoId: z
    .string()
    .min(1, { message: 'Área de actuação é obrigatória' }),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }),
  historico_relacionamento: z
    .string()
    .min(1, { message: 'Histórico de relacionamento é obrigatório' }),
  percepcaoEmRelacaoAoEmprendedor: z
    .string()
    .min(1, { message: 'Percepção em relação ao empreendedor é obrigatória' }),
  principaisInteressesId: z
    .string()
    .min(1, { message: 'Principais interesses são obrigatórios' }),
  oportunidades_associadas: z
    .string()
    .min(1, { message: 'Oportunidades associadas são obrigatórias' }),
  riscos_associados: z
    .string()
    .min(1, { message: 'Riscos associados são obrigatórios' }),
  percepcaoOuPosicionamento: z.enum(['POSITIVO', 'NEGATIVO', 'NEUTRO'], {
    required_error: 'Percepção ou posicionamento é obrigatório',
  }),
  potenciaImpacto: z.enum(['BAIXO', 'MEDIO', 'ALTO'], {
    required_error: 'Potência de impacto é obrigatória',
  }),
  diagnostico_directriz_posicionamento: z
    .string()
    .min(1, {
      message: 'Diagnóstico/directriz de posicionamento é obrigatório',
    }),
  interlocutor_responsavel_por_relacionamento: z
    .string()
    .min(1, {
      message: 'Interlocutor responsável por relacionamento é obrigatório',
    }),
});

export type MatrizStakeholderFormData = z.infer<typeof matrizStakeholderSchema>;

// Enum translations for display
export const AlcanceEnum = {
  Values: {
    LOCAL: 'LOCAL',
    REGIONAL: 'REGIONAL',
    NACIONAL: 'NACIONAL',
    INTERNACIONAL: 'INTERNACIONAL',
  } as const,
};

export const PercepcaoOuPosicionamentoEnum = {
  Values: {
    POSITIVO: 'POSITIVO',
    NEGATIVO: 'NEGATIVO',
    NEUTRO: 'NEUTRO',
  } as const,
};

export const PotenciaImpactoEnum = {
  Values: {
    BAIXO: 'BAIXO',
    MEDIO: 'MEDIO',
    ALTO: 'ALTO',
  } as const,
};
