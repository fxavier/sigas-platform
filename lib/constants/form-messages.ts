// lib/constants/form-messages.ts
export const FORM_MESSAGES = {
  // Common actions
  SAVE: 'Salvar',
  CANCEL: 'Cancelar',
  SUBMIT: 'Submeter',
  EDIT: 'Editar',
  DELETE: 'Eliminar',
  ADD: 'Adicionar',
  REMOVE: 'Remover',
  CLOSE: 'Fechar',
  CONFIRM: 'Confirmar',

  // Loading states
  LOADING: 'Carregando...',
  SAVING: 'Salvando...',
  PROCESSING: 'Processando...',
  SUBMITTING: 'Submetendo...',

  // Success messages
  SAVED_SUCCESSFULLY: 'Guardado com sucesso!',
  CREATED_SUCCESSFULLY: 'Criado com sucesso!',
  UPDATED_SUCCESSFULLY: 'Atualizado com sucesso!',
  DELETED_SUCCESSFULLY: 'Eliminado com sucesso!',
  SUBMITTED_SUCCESSFULLY: 'Submetido com sucesso!',

  // Error messages
  ERROR_SAVING: 'Erro ao guardar',
  ERROR_LOADING: 'Erro ao carregar',
  ERROR_DELETING: 'Erro ao eliminar',
  ERROR_SUBMITTING: 'Erro ao submeter',
  ERROR_PROCESSING: 'Erro ao processar',
  ERROR_REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios',
  ERROR_INVALID_DATA: 'Dados inválidos',
  ERROR_NETWORK: 'Erro de ligação. Tente novamente.',

  // Validation messages
  FIELD_REQUIRED: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_DATE: 'Data inválida',
  INVALID_NUMBER: 'Número inválido',
  MIN_LENGTH: 'Mínimo de {min} caracteres',
  MAX_LENGTH: 'Máximo de {max} caracteres',

  // Common placeholders
  SELECT_OPTION: 'Selecione uma opção',
  SELECT_DATE: 'Selecione uma data',
  ENTER_VALUE: 'Digite um valor',
  SEARCH: 'Pesquisar',
  NO_RESULTS: 'Nenhum resultado encontrado',

  // Confirmation messages
  CONFIRM_DELETE: 'Tem certeza que deseja eliminar?',
  CONFIRM_CANCEL: 'Tem certeza que deseja cancelar?',
  UNSAVED_CHANGES: 'Tem alterações não guardadas. Deseja continuar?',

  // File upload
  UPLOAD_FILE: 'Carregar ficheiro',
  FILE_SELECTED: 'Ficheiro selecionado',
  FILE_UPLOADING: 'Carregando ficheiro...',
  FILE_UPLOADED: 'Ficheiro carregado com sucesso!',
  FILE_ERROR: 'Erro ao carregar ficheiro',
  FILE_TOO_LARGE: 'Ficheiro muito grande',
  FILE_INVALID_TYPE: 'Tipo de ficheiro inválido',

  // Common form labels
  NAME: 'Nome',
  EMAIL: 'Email',
  DATE: 'Data',
  DESCRIPTION: 'Descrição',
  OBSERVATIONS: 'Observações',
  STATUS: 'Estado',
  PRIORITY: 'Prioridade',
  CATEGORY: 'Categoria',
  TYPE: 'Tipo',
  LOCATION: 'Localização',

  // API error messages
  ERROR_FETCH_OPTIONS: 'Falha ao buscar opções',
  ERROR_ADD_OPTION: 'Falha ao adicionar opção',
  ERROR_UPDATE_OPTION: 'Falha ao atualizar opção',
  ERROR_DELETE_OPTION: 'Falha ao eliminar opção',
  ERROR_SAVE_FORM: 'Falha ao guardar formulário',
  ERROR_LOAD_FORM: 'Falha ao carregar formulário',

  // Debug messages (for console.log)
  DEBUG_ADDING_NEW: 'Adicionando novo {type} com valor "{value}"',
  DEBUG_UPDATING: 'Atualizando {type} com ID {id}',
  DEBUG_DELETING: 'Eliminando {type} com ID {id}',
  DEBUG_LOADING: 'Carregando {type}',
  DEBUG_FORM_SUBMISSION: 'Submetendo formulário: {formName}',
  DEBUG_VALIDATION_ERROR: 'Erro de validação: {error}',
} as const;

export type FormMessageKey = keyof typeof FORM_MESSAGES;

// Helper function to replace placeholders in messages
export function formatMessage(message: string, replacements: Record<string, string>): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => replacements[key] || match);
}