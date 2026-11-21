<template>
  <div>
    <!-- Overlay Inicial -->
    <div
      v-if="!hud.running && !hud.finished"
      class="overlay column items-center justify-center q-pa-sm text-center q-gutter-xs"
    >
      <div class="text-subtitle1 text-weight-bold text-amber-4">SG CAIXA RUSH GAME</div>
      <p class="text-caption text-grey-3 q-ma-none overlay-desc">
        Para vencer, marque <strong>todos os itens certos</strong> no tempo estipulado e
        <strong>não marque nenhum item errado</strong> (Erro Estoque, Fila Travada, Nota Pendente,
        Bugs, Lentidão, Rejeição, Duplicidades ou Sangria Inválida).
      </p>

      <div class="row q-gutter-xs full-width justify-center items-start q-mt-xs">
        <q-card v-for="item in START_HIGHLIGHTS" :key="item.id" flat bordered class="promo-mini">
          <q-card-section class="promo-card-body text-left">
            <div class="promo-title text-weight-bold text-amber-3">{{ item.title }}</div>
            <div class="promo-desc text-grey-4">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-gutter-sm q-mt-xs">
        <q-btn
          dense
          color="light-blue-6"
          text-color="dark"
          unelevated
          class="action-btn text-weight-bold q-px-md"
          label="Iniciar Turno (60s)"
          @click="$emit('start')"
        />
        <q-btn
          dense
          outline
          color="amber-4"
          icon="open_in_new"
          class="action-btn text-weight-bold q-px-md"
          label="Site SGBr"
          :href="SGBR_WEBSITE_URL"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>

    <!-- Overlay Final (Vitória ou Turno Encerrado) -->
    <div
      v-if="hud.finished"
      class="overlay column items-center justify-center q-pa-sm text-center q-gutter-xs"
      :class="{ 'overlay-victory': hud.victory }"
    >
      <div v-if="hud.victory" class="victory-fx" aria-hidden="true">
        <span
          v-for="piece in confettiPieces"
          :key="piece.id"
          class="confetti-piece"
          :style="{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size * 1.45}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--drift': `${piece.drift}px`,
          }"
        />
      </div>

      <div
        class="text-subtitle1 text-weight-bold relative-position"
        :class="hud.victory ? 'text-amber-3 victory-heading' : 'text-amber-4'"
      >
        {{ hud.victory ? 'VITÓRIA PERFEITA!' : 'TURNO ENCERRADO!' }}
      </div>

      <p class="text-caption text-grey-2 q-ma-none overlay-desc relative-position">
        <template v-if="hud.victory">
          Certos: <strong>{{ hud.goodScannedCount }}/{{ hud.goodTotalCount }}</strong> | Erros:
          <strong>{{ hud.badScannedCount }}</strong> | Pontos: <strong>{{ hud.score }}</strong>
        </template>
        <template v-else>
          Pontuação: <strong>{{ hud.score }}</strong> | Certos:
          <strong>{{ hud.goodScannedCount }}/{{ hud.goodTotalCount }}</strong> | Erros:
          <strong>{{ hud.badScannedCount }}</strong> | Recorde: <strong>{{ hud.bestScore }}</strong>
        </template>
      </p>

      <div class="row q-gutter-xs full-width justify-center items-start q-mt-xs relative-position">
        <q-card v-for="item in END_HIGHLIGHTS" :key="item.id" flat bordered class="promo-mini">
          <q-card-section class="promo-card-body text-left">
            <div class="promo-title text-weight-bold text-amber-3">{{ item.title }}</div>
            <div class="promo-desc text-grey-4">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-gutter-sm q-mt-xs relative-position">
        <q-btn
          dense
          color="light-blue-6"
          text-color="dark"
          unelevated
          class="action-btn text-weight-bold q-px-md"
          label="Jogar Novamente"
          @click="$emit('start')"
        />
        <q-btn
          dense
          outline
          color="grey-3"
          :label="copied ? 'Placar Copiado!' : 'Copiar Placar'"
          class="action-btn"
          @click="$emit('copy')"
        />
        <q-btn
          dense
          unelevated
          color="amber-6"
          text-color="dark"
          icon="open_in_new"
          class="action-btn text-weight-bold"
          label="Conhecer a SGBr"
          :href="SGBR_WEBSITE_URL"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaixaRushSnapshot } from '../../game/caixa-rush/caixaRushTypes';
import {
  END_HIGHLIGHTS,
  SGBR_WEBSITE_URL,
  START_HIGHLIGHTS,
} from '../../game/caixa-rush/sgbrPromoData';

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const CONFETTI_COLORS = ['#facc15', '#38bdf8', '#22c55e', '#f472b6', '#c084fc', '#fb923c'];

const confettiPieces: ConfettiPiece[] = Array.from({ length: 28 }, (_, idx) => ({
  id: idx,
  left: ((idx * 19 + 5) % 94) + 3,
  color: CONFETTI_COLORS[idx % CONFETTI_COLORS.length] ?? '#facc15',
  size: 5 + (idx % 4) * 2,
  delay: (idx % 8) * 0.12,
  duration: 1.7 + (idx % 5) * 0.3,
  drift: (idx % 2 === 0 ? 1 : -1) * (14 + (idx % 4) * 7),
}));

defineProps<{
  hud: CaixaRushSnapshot;
  copied: boolean;
}>();

defineEmits<{
  start: [];
  copy: [];
}>();
</script>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 13, 22, 0.9);
  backdrop-filter: blur(4px);
  overflow: hidden;
}

.overlay-victory {
  background: radial-gradient(circle at center, rgba(250, 204, 21, 0.2), rgba(9, 13, 22, 0.92));
  box-shadow: inset 0 0 32px rgba(250, 204, 21, 0.45);
}

.victory-fx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -14px;
  border-radius: 2px;
  animation-name: victory-fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.victory-heading {
  animation: victory-pulse 0.85s ease-in-out infinite alternate;
  text-shadow: 0 0 14px rgba(250, 204, 21, 0.75);
}

@keyframes victory-fall {
  0% {
    transform: translate3d(0, -12px, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--drift, 16px), 420px, 0) rotate(540deg);
    opacity: 0.15;
  }
}

@keyframes victory-pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.07);
  }
}

.overlay-desc {
  max-width: 440px;
  line-height: 1.4;
}

.promo-mini {
  min-height: 0;
  height: auto;
  background: rgba(30, 41, 59, 0.88);
  border-color: rgba(56, 189, 248, 0.25);
}

.promo-card-body {
  padding: 6px 10px;
}

.promo-title {
  font-size: 0.75rem;
  line-height: 1.15;
  margin-bottom: 2px;
}

.promo-desc {
  font-size: 0.72rem;
  line-height: 1.25;
}

.action-btn {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  white-space: nowrap;
}
</style>
