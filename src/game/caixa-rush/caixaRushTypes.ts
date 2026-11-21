export type ComboTitle = 'SEM COMBO' | 'PDV ÁGIL' | 'ESTOQUE EM DIA' | 'NOTA EMITIDA';

export interface ConveyorItem {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  isBad: boolean;
  label: string;
  color: string;
  points: number;
  penaltyTime: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface CaixaRushSnapshot {
  running: boolean;
  finished: boolean;
  victory: boolean;
  score: number;
  bestScore: number;
  combo: number;
  maxCombo: number;
  multiplier: number;
  comboTitle: ComboTitle;
  comboDetail: string;
  timeLeft: number;
  isMuted: boolean;
  goodScannedCount: number;
  goodTotalCount: number;
  badScannedCount: number;
}

// Mais largo e menos alto na vertical
export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 380;
export const LANES_Y = [75, 145, 215] as const;
export const SCANNER_Y = 292;

export const GOOD_ITEMS = [
  { label: 'VENDA PDV', color: '#22c55e', points: 100 },
  { label: 'EFICIÊNCIA', color: '#38bdf8', points: 120 },
  { label: 'NFC-e OK', color: '#a855f7', points: 140 },
  { label: 'AGILIDADE', color: '#8a17f5', points: 140 },
  { label: 'ORGANIZAÇÃO', color: '#125a2a', points: 140 },
  { label: 'AGILIDADE', color: '#8a17f5', points: 140 },
  { label: 'ESTABILIDADE', color: '#1740f5', points: 140 },
  { label: 'CONTROLE', color: '#066374', points: 140 },
  { label: 'BOM SERVIÇO', color: '#a855f7', points: 140 },
  { label: 'EXCELÊNCIA', color: '#0aa342', points: 140 },
] as const;

export const BAD_ITEMS = [
  { label: 'ERRO ESTOQUE', color: '#ef4444', penaltyTime: 3 },
  { label: 'FILA TRAVADA', color: '#f97316', penaltyTime: 2 },
  { label: 'FALHA', color: '#8d3f07', penaltyTime: 2 },
  { label: 'NOTA PENDENTE', color: '#e11d48', penaltyTime: 3 },
  { label: 'BUGS', color: '#dc2626', penaltyTime: 3 },
  { label: 'INCONSISTÊNCIA', color: '#921313', penaltyTime: 3 },
  { label: 'DIVERGÊNCIA', color: '#ea580c', penaltyTime: 2 },
  { label: 'LENTIDÃO', color: '#eaa40c', penaltyTime: 2 },
  { label: 'REJEIÇÃO', color: '#be123c', penaltyTime: 3 },
  { label: 'DUPLICIDADE', color: '#b91c1c', penaltyTime: 3 },
  { label: 'SEM CONEXÃO', color: '#c2410c', penaltyTime: 2 },
] as const;
