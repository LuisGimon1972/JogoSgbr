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

      <template v-if="hud.victory && showVictoryPromoDialog">
        <q-card flat bordered class="victory-promo-card relative-position q-mt-xs">
          <q-card-section class="victory-promo-section text-center">
            <div class="victory-brand text-weight-bold">SG CAIXA RUSH</div>
            <div class="victory-record text-weight-bold">RECORDE CONQUISTADO!</div>
            <div class="victory-subtext">Você tem velocidade de operador profissional!</div>

            <q-separator dark class="victory-divider q-my-xs" />

            <div class="victory-cta-title text-weight-bold">
              Quer esse desempenho no seu negócio?
            </div>
            <div class="victory-cta-link text-weight-bold">Conheça nosso sistema comercial.</div>
            <div class="victory-modules">PDV MOBILE • SG MASTER • SG MASTER WEB • MEU SG</div>
            <div class="victory-qr-label text-weight-bold">
              VISITE NOSSO SITE WEB https://sgbr.com.br/ E CONHEÇA
            </div>

            <div class="row justify-center q-mt-sm">
              <button
                type="button"
                class="promo-continue-btn"
                @pointerup.stop.prevent="advanceFromPromoDialog"
                @click.stop.prevent="advanceFromPromoDialog"
              >
                VER PLACAR E SISTEMAS
              </button>
            </div>
          </q-card-section>
        </q-card>
      </template>

      <!-- 3) Tela Final Completa -->
      <template v-else>
        <p class="text-caption text-grey-2 q-ma-none overlay-desc relative-position">
          <template v-if="hud.victory">
            Certos: <strong>{{ hud.goodScannedCount }}/{{ hud.goodTotalCount }}</strong> | Erros:
            <strong>{{ hud.badScannedCount }}</strong> | Pontos: <strong>{{ hud.score }}</strong>
          </template>
          <template v-else>
            Pontuação: <strong>{{ hud.score }}</strong> | Certos:
            <strong>{{ hud.goodScannedCount }}/{{ hud.goodTotalCount }}</strong> | Erros:
            <strong>{{ hud.badScannedCount }}</strong> | Recorde:
            <strong>{{ hud.bestScore }}</strong>
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
const dismissedVictoryToken = ref<string | null>(null);

const activeVictoryToken = computed<string | null>(() => {
  if (!props.hud.finished || !props.hud.victory || props.hud.running) {
    return null;
  }
  return `${props.hud.score}-${props.hud.goodScannedCount}-${props.hud.badScannedCount}`;
});

const showVictoryPromoDialog = computed<boolean>(() => {
  const token = activeVictoryToken.value;
  if (!token) return false;
  return dismissedVictoryToken.value !== token;
});

function advanceFromPromoDialog(): void {
  const token = activeVictoryToken.value;
  if (token) {
    dismissedVictoryToken.value = token;
  }
}

watch(
  () => props.hud.level,
  (nextLevel) => {
    if (nextLevel === 'easy' || nextLevel === 'hard') {
      currentLevel.value = nextLevel;
    }
  },
);

watch(activeVictoryToken, (token) => {
  if (!token) {
    dismissedVictoryToken.value = null;
  }
});

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
  padding-top: 10px;
  padding-bottom: 12px;
}

.overlay-victory {
  background: radial-gradient(circle at center, rgba(250, 204, 21, 0.2), rgba(9, 13, 22, 0.92));
  box-shadow: inset 0 0 32px rgba(250, 204, 21, 0.45);
}

.victory-promo-card {
  width: min(94%, 430px);
  background: #0b1626;
  border-color: rgba(56, 189, 248, 0.32);
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.55);
  z-index: 3;
}

.victory-promo-section {
  padding: 8px 12px;
}

.victory-brand {
  color: #2dd4bf;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.victory-record {
  color: #facc15;
  font-size: 0.84rem;
  letter-spacing: 0.03em;
  line-height: 1.25;
  margin-top: 2px;
}

.victory-subtext {
  color: #f1f5f9;
  font-size: 0.72rem;
  line-height: 1.25;
  margin-top: 2px;
}

.victory-divider {
  background: rgba(148, 163, 184, 0.25);
}

.victory-cta-title {
  color: #f8fafc;
  font-size: 0.76rem;
  line-height: 1.25;
}

.victory-cta-link {
  color: #2dd4bf;
  font-size: 0.74rem;
  line-height: 1.25;
  margin-top: 2px;
}

.victory-modules {
  color: #e2e8f0;
  font-size: 0.68rem;
  line-height: 1.25;
  margin-top: 3px;
}

.victory-qr-label {
  color: #facc15;
  font-size: 0.7rem;
  letter-spacing: 0.03em;
  line-height: 1.25;
  margin-top: 4px;
}

.promo-continue-btn {
  position: relative;
  z-index: 5;
  background: #f59e0b;
  color: #0f172a;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  cursor: pointer;
  pointer-events: auto;
  touch-action: manipulation;
}

.promo-continue-btn:hover {
  background: #fbbf24;
}

.victory-fx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
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
  z-index: 3;
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
  .overlay {
    justify-content: center !important;
    padding: 6px 8px !important;
    gap: 3px !important;
    overflow-y: hidden !important;
  }

  .overlay-desc {
    max-width: 100%;
    font-size: 0.62rem;
    line-height: 1.18;
  }

  .level-toggle {
    font-size: 0.66rem;
    margin-top: 0 !important;
  }

  .highlights-wrap {
    gap: 3px !important;
    margin-top: 2px !important;
  }

  .promo-mini {
    flex: 1 1 calc(50% - 4px);
    max-width: 155px;
    min-width: 105px;
  }

  .promo-card-body {
    padding: 3px 5px;
  }

  .promo-title {
    font-size: 0.62rem;
    line-height: 1.1;
    margin-bottom: 1px;
  }

  .promo-desc {
    font-size: 0.58rem;
    line-height: 1.12;
  }

  .actions-wrap {
    gap: 5px !important;
    margin-top: 3px !important;
    flex-shrink: 0;
  }

  .action-btn {
    font-size: 9.5px;
    padding: 4px 8px;
    min-height: 26px;
  }

  .victory-promo-section {
    padding: 5px 8px;
  }

  .victory-brand {
    font-size: 0.72rem;
  }

  .victory-record {
    font-size: 0.66rem;
  }

  .victory-subtext {
    font-size: 0.58rem;
  }

  .victory-cta-title,
  .victory-cta-link {
    font-size: 0.6rem;
  }

  .victory-modules,
  .victory-qr-label {
    font-size: 0.54rem;
  }
}

/* Resolução 320x533 e telas estreitas/curtas */
@media (max-width: 360px) and (max-height: 600px) {
  .overlay {
    justify-content: flex-start !important;
    padding: 4px 6px 6px !important;
    gap: 2px !important;
    overflow-y: auto !important;
  }

  .overlay .text-subtitle1 {
    font-size: 0.78rem !important;
    line-height: 1.1 !important;
  }

  .overlay-desc {
    max-width: 100%;
    font-size: 0.56rem !important;
    line-height: 1.12 !important;
  }

  .level-toggle {
    font-size: 0.6rem !important;
    min-height: 20px !important;
  }

  .highlights-wrap {
    gap: 2px !important;
    margin-top: 1px !important;
  }

  .promo-mini {
    flex: 1 1 calc(50% - 4px);
    max-width: 142px;
    min-width: 92px;
  }

  .promo-card-body {
    padding: 2px 4px !important;
  }

  .promo-title {
    font-size: 0.56rem !important;
    line-height: 1.05 !important;
    margin-bottom: 1px !important;
  }

  .promo-desc {
    font-size: 0.52rem !important;
    line-height: 1.08 !important;
  }

  .actions-wrap {
    gap: 4px !important;
    margin-top: 2px !important;
    flex-shrink: 0;
  }

  .action-btn {
    font-size: 8.5px !important;
    padding: 3px 6px !important;
    min-height: 22px !important;
  }
}

/* Resoluções menores ou iguais a 214x533 */
@media (max-width: 214px) and (max-height: 533px) {
  .overlay {
    justify-content: flex-start !important;
    padding: 3px 4px 4px !important;
    gap: 2px !important;
    overflow-y: auto !important;
  }

  .overlay .text-subtitle1 {
    font-size: 0.68rem !important;
    line-height: 1.05 !important;
  }

  .overlay-desc {
    max-width: 100%;
    font-size: 0.5rem !important;
    line-height: 1.08 !important;
  }

  .level-toggle {
    font-size: 0.52rem !important;
    min-height: 18px !important;
  }

  .highlights-wrap {
    gap: 2px !important;
    margin-top: 1px !important;
  }

  .promo-mini {
    flex: 1 1 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  .promo-card-body {
    padding: 2px 4px !important;
  }

  .promo-title {
    font-size: 0.52rem !important;
    line-height: 1.05 !important;
    margin-bottom: 0 !important;
  }

  .promo-desc {
    display: none !important;
  }

  .actions-wrap {
    flex-direction: column !important;
    gap: 3px !important;
    margin-top: 2px !important;
    flex-shrink: 0;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    font-size: 8px !important;
    padding: 2px 5px !important;
    min-height: 20px !important;
  }

  .victory-promo-section {
    padding: 4px 6px;
  }

  .victory-brand {
    font-size: 0.62rem;
  }

  .victory-record {
    font-size: 0.56rem;
  }

  .victory-subtext,
  .victory-cta-title,
  .victory-cta-link,
  .victory-modules,
  .victory-qr-label {
    font-size: 0.5rem;
  }
}
</style>
