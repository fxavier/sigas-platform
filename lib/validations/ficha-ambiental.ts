// lib/validations/ficha-ambiental.ts
import { z } from 'zod';

// Enum for activity types
export const TipoAtividadeEnum = z.enum([
  'TURISTICA',
  'INDUSTRIAL',
  'AGRO_PECUARIA',
  'ENERGETICA',
  'SERVICOS',
  'OUTRA',
]);

// Enum for location types
export const MeioInsercaoEnum = z.enum(['RURAL', 'URBANO', 'PERIURBANO']);

// Enum for spatial planning framework
export const EnquadramentoOrcamentoTerritorialEnum = z.enum([
  'ESPACO_HABITACIONAL',
  'INDUSTRIAL',
  'SERVICOS',
  'OUTRO',
]);

// Enum for provinces
export const ProvinciasEnum = z.enum([
  'MAPUTO',
  'MAPUTO_CIDADE',
  'GAZA',
  'INHAMBANE',
  'SOFALA',
  'MANICA',
  'TETE',
  'ZAMBEZIA',
  'NAMPULA',
  'CABO_DELGADO',
  'NIASSA',
]);

// Enum for physical characteristics
export const CaracteristicasFisicasEnum = z.enum([
  'PLANICIE',
  'PLANALTO',
  'VALE',
  'MONTANHA',
]);

// Enum for predominant ecosystems
export const EcossistemasEnum = z.enum([
  'FLUVIAL',
  'LACUSTRE',
  'MARINHO',
  'TERRESTRE',
]);

// Enum for location zone
export const LocationZoneEnum = z.enum(['COSTEIRA', 'INTERIOR', 'ILHA']);

// Enum for vegetation types
export const VegetacaoEnum = z.enum(['FLORESTA', 'SAVANA', 'OUTRO']);

// Enum for land use
export const UsoSoloEnum = z.enum([
  'AGROPECUARIO',
  'HABITACIONAL',
  'INDUSTRIAL',
  'PROTECCAO',
  'OUTRO',
]);

// Schema for the environmental information form
export const fichaInformacaoAmbientalSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),

  // Activity information
  nomeActividade: z.string().min(3, {
    message: 'Nome da actividade deve ter pelo menos 3 caracteres',
  }),
  tipoActividade: TipoAtividadeEnum,
  proponentes: z.string().optional().nullable(),

  // Contact information
  endereco: z.string().min(3, {
    message: 'Endereço é obrigatório',
  }),
  telefone: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  telemovel: z.string().optional().nullable(),
  email: z.string().email({
    message: 'Email inválido',
  }),

  // Location information
  bairroActividade: z.string().min(1, {
    message: 'Bairro é obrigatório',
  }),
  vilaActividade: z.string().min(1, {
    message: 'Vila é obrigatória',
  }),
  cidadeActividade: z.string().min(1, {
    message: 'Cidade é obrigatória',
  }),
  localidadeActividade: z.string().optional().nullable(),
  distritoActividade: z.string().optional().nullable(),
  provinciaActividade: ProvinciasEnum,
  coordenadasGeograficas: z.string().optional().nullable(),

  // Environmental context
  meioInsercao: MeioInsercaoEnum,
  enquadramentoOrcamentoTerritorial: EnquadramentoOrcamentoTerritorialEnum,

  // Activity description
  descricaoActividade: z.string().optional().nullable(),
  actividadesAssociadas: z.string().optional().nullable(),
  descricaoTecnologiaConstrucaoOperacao: z.string().optional().nullable(),
  actividadesComplementaresPrincipais: z.string().optional().nullable(),

  // Resources and materials
  tipoQuantidadeOrigemMaoDeObra: z.string().optional().nullable(),
  tipoQuantidadeOrigemProvenienciaMateriasPrimas: z
    .string()
    .optional()
    .nullable(),
  quimicosUtilizados: z.string().optional().nullable(),
  tipoOrigemConsumoAguaEnergia: z.string().optional().nullable(),
  origemCombustiveisLubrificantes: z.string().optional().nullable(),
  outrosRecursosNecessarios: z.string().optional().nullable(),

  // Land and locations
  posseDeTerra: z.string().optional().nullable(),
  alternativasLocalizacaoActividade: z.string().optional().nullable(),

  // Environmental situation
  descricaoBreveSituacaoAmbientalReferenciaLocalRegional: z
    .string()
    .optional()
    .nullable(),
  caracteristicasFisicasLocalActividade:
    CaracteristicasFisicasEnum.optional().nullable(),
  ecosistemasPredominantes: EcossistemasEnum.optional().nullable(),
  zonaLocalizacao: LocationZoneEnum.optional().nullable(),
  tipoVegetacaoPredominante: VegetacaoEnum.optional().nullable(),
  usoSolo: UsoSoloEnum.optional().nullable(),

  // Infrastructure and complementary information
  infraestruturaExistenteAreaActividade: z.string().optional().nullable(),
  informacaoComplementarAtravesMaps: z.string().optional().nullable(),

  // Investment value
  valorTotalInvestimento: z.number().optional().nullable(),
});

export type FichaInformacaoAmbientalFormValues = z.infer<
  typeof fichaInformacaoAmbientalSchema
>;
