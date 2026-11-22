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
  atlasIndex: number;
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
  { label: 'ESTABILIDADE', color: '#ef4444', points: 100 },
  { label: 'PRECISÃO', color: '#38bdf8', points: 120 },
  { label: 'NFC-e OK', color: '#c2410c', points: 140 },
  { label: 'RAPIDEZ', color: '#8a17f5', points: 140 },
  { label: 'INTEGRIDADE', color: '#8d3f07', points: 140 },
  { label: 'AGILIDADE', color: '#440625', points: 140 },
  { label: 'TRANSPARENCIA', color: '#1b0204', points: 140 },
  { label: 'CONTROLE', color: '#066374', points: 140 },
  { label: 'BOM SERVIÇO', color: '#b91c1c', points: 140 },
  { label: 'SEGURANÇA', color: '#ee140c', points: 140 },
] as const;

export const BAD_ITEMS = [
  { label: 'ERRO ESTOQUE', color: '#22c55e', penaltyTime: 3 },
  { label: 'FILA TRAVADA', color: '#f97316', penaltyTime: 2 },
  { label: 'FALHA', color: '#125a2a', penaltyTime: 2 },
  { label: 'NOTA PENDENTE', color: '#e11d48', penaltyTime: 3 },
  { label: 'BUGS', color: '#770d39', penaltyTime: 3 },
  { label: 'INCONSISTÊNCIA', color: '#921313', penaltyTime: 3 },
  { label: 'DIVERGÊNCIA', color: '#ea580c', penaltyTime: 2 },
  { label: 'LENTIDÃO', color: '#1740f5', penaltyTime: 2 },
  { label: 'REJEIÇÃO', color: '#be123c', penaltyTime: 3 },
  { label: 'DUPLICIDADE', color: '#20023b', penaltyTime: 3 },
  { label: 'SEM CONEXÃO', color: '#a855f7', penaltyTime: 2 },
] as const;
