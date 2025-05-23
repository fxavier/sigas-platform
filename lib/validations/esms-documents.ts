// lib/validations/esms-documents.ts
import { z } from 'zod';

export const estadoDocumentoEnum = z.enum(['REVISAO', 'EM_USO', 'ABSOLETO'], {
  required_error: 'Estado do documento é obrigatório',
});

export const baseDocumentSchema = z.object({
  tenantId: z.string().min(1, { message: 'Tenant ID é obrigatório' }),
  projectId: z.string().min(1, { message: 'Project ID é obrigatório' }),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }),
  nomeDocumento: z
    .string()
    .min(1, { message: 'Nome do documento é obrigatório' }),
  ficheiro: z.string().min(1, { message: 'Ficheiro é obrigatório' }),
  estadoDocumento: estadoDocumentoEnum,
  periodoRetencao: z.date().optional().nullable(),
  dataRevisao: z.date().optional().nullable(),
});

export const politicasSchema = baseDocumentSchema;
export const manuaisSchema = baseDocumentSchema;
export const procedimentosSchema = baseDocumentSchema;
export const formulariosSchema = baseDocumentSchema;
export const modelosSchema = baseDocumentSchema;

export type ESMSDocumentFormData = z.infer<typeof baseDocumentSchema>;
export type PoliticasFormData = z.infer<typeof politicasSchema>;
export type ManuaisFormData = z.infer<typeof manuaisSchema>;
export type ProcedimentosFormData = z.infer<typeof procedimentosSchema>;
export type FormulariosFormData = z.infer<typeof formulariosSchema>;
export type ModelosFormData = z.infer<typeof modelosSchema>;

// Document type for generic handling
export type DocumentType =
  | 'politicas'
  | 'manuais'
  | 'procedimentos'
  | 'formularios'
  | 'modelos';

export const documentTypeLabels: Record<DocumentType, string> = {
  politicas: 'Políticas',
  manuais: 'Manuais',
  procedimentos: 'Procedimentos',
  formularios: 'Formulários',
  modelos: 'Modelos',
};

export const estadoDocumentoLabels = {
  REVISAO: 'Em Revisão',
  EM_USO: 'Em Uso',
  ABSOLETO: 'Obsoleto',
} as const;
