// lib/types/forms.ts
export interface IdentificacaoAvaliacaoDeRiscosImapctosAmbientaisSociais {
  id: string;
  tenantId: string;
  projectId: string;
  numeroReferencia?: string | null;
  processo?: string | null;
  actiactividade: string;
  riscosImpactosId: string;
  realOuPotencial?: string | null;
  condicao: 'NORMAL' | 'ANORMAL' | 'EMERGENCIA';
  factorAmbientalImpactadoId: string;
  faseProjecto:
    | 'PRE_CONSTRUCAO'
    | 'CONSTRUCAO'
    | 'OPERACAO'
    | 'DESATIVACAO'
    | 'ENCERRAMENTO'
    | 'RESTAURACAO';
  estatuto: 'POSITIVO' | 'NEGATIVO';
  extensao: 'LOCAL' | 'REGIONAL' | 'NACIONAL' | 'GLOBAL';
  duduacao: 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO';
  intensidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  probabilidade:
    | 'IMPROVAVEL'
    | 'PROVAVEL'
    | 'ALTAMENTE_PROVAVEL'
    | 'DEFINITIVA';
  significancia?: string | null;
  duracaoRisco?: string | null;
  descricaoMedidas: string;
  respresponsavelonsible?: string | null;
  prazo: Date;
  referenciaDocumentoControl?: string | null;
  legislacaoMocambicanaAplicavel?: string | null;
  observacoes: string;
  createdAt: Date;
  updatedAt: Date;
  riscosImpactos: {
    id: string;
    descricao: string;
  };
  factorAmbientalImpactado: {
    id: string;
    descricao: string;
  };
}

export interface MembroEquipa {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TabelaAccao {
  id: string;
  accao: string;
  pessoaResponsavel: string;
  prazo: Date;
  dataConclusao: Date;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
