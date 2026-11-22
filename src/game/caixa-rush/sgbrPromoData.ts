export interface PromoHighlight {
  id: string;
  title: string;
  description: string;
}

export const SGBR_WEBSITE_URL = 'https://sgbr.com.br/';

export const START_HIGHLIGHTS: PromoHighlight[] = [
  {
    id: 'pdv-agil',
    title: 'PDV Ágil',
    description: 'Vendas rápidas sem gargalos no atendimento.',
  },
  {
    id: 'estoque-em-dia',
    title: 'Estoque em Dia',
    description: 'Controle integrado no dia a dia. Controle de stock máximo e mínimo.',
  },
  {
    id: 'nota-emitida',
    title: 'Nota Emitida',
    description: 'Agilidade na operação fiscal, com emissão rápida e simplificada.',
  },
];

export const END_HIGHLIGHTS: PromoHighlight[] = [
  {
    id: 'sgbr-sistemas',
    title: 'SGBR Sistemas LTDA',
    description: 'Automação comercial e gestão empresarial.',
  },
  {
    id: 'sg-master',
    title: 'SG Master',
    description: 'Gestão completa para varejo e serviços no ambiente DESKTOP.',
  },

  {
    id: 'sg-masterweb',
    title: 'SG Master WEB',
    description: 'Gestão completa para varejo e serviços no ambiente WEB.',
  },
  {
    id: 'sg-pdv-mobile',
    title: 'SG PDV Mobile',
    description: 'Agilidade nas vendas móveis.',
  },
  {
    id: 'meusg',
    title: 'MeuSG',
    description: 'Plataforma completa para a gestão de Pedidos de venda.',
  },
  {
    id: 'sg-agenda',
    title: 'SG Agenda',
    description: 'Agenda inteligente para clientes.',
  },
  {
    id: 'super-bio',
    title: 'SuperBio',
    description: 'Pagamentos por Reconhecimento Facial.',
  },
];

export const SGBR_TIPS: string[] = [
  'Frente de caixa ágil reduz filas e melhora a experiência do cliente.',
  'Estoque atualizado em tempo real evita rupturas nas vendas.',
  'Emissão fiscal rápida mantém a operação do caixa fluida.',
];
