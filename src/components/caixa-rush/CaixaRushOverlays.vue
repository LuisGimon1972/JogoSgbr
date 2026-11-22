<template>
  <div>
    <!-- Overlay Inicial -->
    <div
      v-if="!hud.running && !hud.finished"
      class="overlay column items-center justify-center q-pa-sm text-center q-gutter-xs"
    >
      <div class="text-subtitle1 text-weight-bold text-amber-2">SG CAIXA RUSH GAME</div>
      <p class="text-caption text-grey-3 q-ma-none overlay-desc">
        Para vencer, marque <strong>todos os itens certos</strong> no tempo estipulado e
        <strong>não marque nenhum item errado</strong> (Erro Estoque, Fila Travada, Nota Pendente,
        Bugs, Lentidão, Rejeição, Duplicidade, Rejeição...).
      </p>

      <div class="row items-center justify-center q-mt-xs">
        <q-toggle
          dense
          dark
          :model-value="currentLevel === 'hard'"
          color="amber-6"
          class="level-toggle text-grey-2"
          :label="currentLevel === 'hard' ? 'Nível: Difícil' : 'Nível: Fácil'"
          @update:model-value="onToggle"
        />
      </div>

      <div class="row q-gutter-xs full-width justify-center items-start q-mt-xs highlights-wrap">
        <q-card v-for="item in START_HIGHLIGHTS" :key="item.id" flat bordered class="promo-mini">
          <q-card-section class="promo-card-body text-left">
            <div class="promo-title text-weight-bold text-amber-3">{{ item.title }}</div>
            <div class="promo-desc text-grey-4">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-gutter-sm q-mt-xs justify-center actions-wrap">
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

      <div class="row items-center justify-center q-mt-xs relative-position">
        <q-toggle
          dense
          dark
          :model-value="currentLevel === 'hard'"
          color="amber-6"
          class="level-toggle text-grey-2"
          :label="currentLevel === 'hard' ? 'Nível: Difícil' : 'Nível: Fácil'"
          @update:model-value="onToggle"
        />
      </div>

      <div
        class="row q-gutter-xs full-width justify-center items-start q-mt-xs relative-position highlights-wrap"
      >
        <q-card v-for="item in END_HIGHLIGHTS" :key="item.id" flat bordered class="promo-mini">
          <q-card-section class="promo-card-body text-left">
            <div class="promo-title text-weight-bold text-amber-3">{{ item.title }}</div>
            <div class="promo-desc text-grey-4">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-gutter-sm q-mt-xs justify-center relative-position actions-wrap">
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
import { ref, watch } from 'vue';
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

const props = defineProps<{
  hud: CaixaRushSnapshot;
  copied: boolean;
}>();

const emit = defineEmits<{
  start: [];
  copy: [];
  'toggle-level': [level: 'easy' | 'hard'];
}>();

const currentLevel = ref<'easy' | 'hard'>(props.hud.level ?? 'easy');

watch(
  () => props.hud.level,
  (nextLevel) => {
    if (nextLevel === 'easy' || nextLevel === 'hard') {
      currentLevel.value = nextLevel;
    }
  },
);

function onToggle(val: boolean | null) {
  const nextLevel: 'easy' | 'hard' = val ? 'hard' : 'easy';
  currentLevel.value = nextLevel;
  emit('toggle-level', nextLevel);
}
</script>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(9, 13, 22, 0.9);
  backdrop-filter: blur(4px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
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

.level-toggle {
  font-size: 0.75rem;
  font-weight: 700;
  touch-action: manipulation;
}

.promo-mini {
  min-height: 0;
  height: auto;
  max-width: 220px;
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
  touch-action: manipulation;
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1023px) {
  .overlay-desc {
    max-width: 520px;
  }

  .promo-mini {
    max-width: 210px;
  }

  .action-btn {
    font-size: 11.5px;
    padding: 6px 11px;
  }
}

/* Phone */
@media (max-width: 599px) {
  .overlay-desc {
    max-width: 100%;
    font-size: 0.7rem;
    line-height: 1.32;
  }

  .level-toggle {
    font-size: 0.7rem;
  }

  .highlights-wrap {
    gap: 4px !important;
  }

  .promo-mini {
    flex: 1 1 calc(50% - 6px);
    max-width: 175px;
    min-width: 120px;
  }

  .promo-card-body {
    padding: 5px 7px;
  }

  .promo-title {
    font-size: 0.68rem;
  }

  .promo-desc {
    font-size: 0.65rem;
    line-height: 1.2;
  }

  .actions-wrap {
    gap: 6px !important;
  }

  .action-btn {
    font-size: 10px;
    padding: 5px 8px;
  }
}
</style>
