// lib/constants.ts
export interface Institution {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export const INSTITUTIONS: Record<string, Institution> = {
  aias: {
    id: 'aias',
    name: 'Administração de Infraestruturas de Água e Saneamento',
    shortName: 'AIAS',
    color: '#1E88E5',
  },
  dnaas: {
    id: 'dnaas',
    name: 'Direção Nacional de Abastecimento de Água e Saneamento',
    shortName: 'DNAAS',
    color: '#26A69A',
  },
  fipag: {
    id: 'fipag',
    name: 'Fundo de Investimento e Património do Abastecimento de Água',
    shortName: 'FIPAG',
    color: '#7E57C2',
  },
};
