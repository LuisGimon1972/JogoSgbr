<template>
  <q-page class="flex flex-center bg-dark text-white q-pa-md caixa-page">
    <div class="game-shell column q-gutter-sm">
      <CaixaRushHud :hud="hud" />

      <div class="stage-box relative-position">
        <canvas
          ref="canvasRef"
          :width="CANVAS_WIDTH"
          :height="CANVAS_HEIGHT"
          class="game-canvas"
          @pointerdown="onCanvasPointerDown"
        />

        <CaixaRushOverlays :hud="hud" :copied="copied" @start="startMatch" @copy="copyScore" />
      </div>

      <CaixaRushTouchBar
        :is-muted="hud.isMuted"
        @dir="onTouchDir"
        @scan="onScanPdv"
        @toggle-mute="toggleMute"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import CaixaRushHud from '../components/caixa-rush/CaixaRushHud.vue';
import CaixaRushOverlays from '../components/caixa-rush/CaixaRushOverlays.vue';
import CaixaRushTouchBar from '../components/caixa-rush/CaixaRushTouchBar.vue';
import { useCaixaRushControls } from '../composables/useCaixaRushControls';
import { CaixaRushEngine } from '../game/caixa-rush/CaixaRushEngine';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type CaixaRushSnapshot,
} from '../game/caixa-rush/caixaRushTypes';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const engine = new CaixaRushEngine();
const hud = ref<CaixaRushSnapshot>(engine.getSnapshot());
const copied = ref(false);

let rafId: number | null = null;
let lastFrame = 0;

const syncHud = (): void => {
  hud.value = engine.getSnapshot();
};

useCaixaRushControls(engine, syncHud);

const startMatch = (): void => {
  const now = performance.now();
  lastFrame = now;
  engine.startMatch(now);
  syncHud();
};

const onTouchDir = (side: 'left' | 'right', pressed: boolean): void => {
  engine.setHorizontalInput(side, pressed);
};

const onScanPdv = (): void => {
  engine.scanNearestToPdv();
  syncHud();
};

const toggleMute = (): void => {
  engine.toggleMute();
  syncHud();
};

const copyScore = async (): Promise<void> => {
  const text = `Fiz ${hud.value.score} pontos (combo máx ${hud.value.maxCombo}) no SG Caixa Rush Game — SGBR Sistemas!`;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
};

const onCanvasPointerDown = (event: PointerEvent): void => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  engine.handlePointerAt(x, y);
  syncHud();
};

const loop = (now: number): void => {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  engine.update(dt, now);
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) {
    engine.render(ctx);
  }

  syncHud();
  rafId = requestAnimationFrame(loop);
};

onMounted(() => {
  const now = performance.now();
  lastFrame = now;
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) {
    engine.render(ctx);
  }
  syncHud();
  rafId = requestAnimationFrame(loop);
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<style scoped>
.caixa-page {
  min-height: 100dvh;
}

/* Alterado de max-width: 540px para ampliar a largura do jogo em telas maiores */
.game-shell {
  width: min(94vw, 1080px);
  max-width: 1080px;
}

.stage-box {
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid rgba(56, 189, 248, 0.35);
  background: #0b1220;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
}

.game-canvas {
  display: block;
  width: 100%;
  height: auto;
  touch-action: none;
  cursor: pointer;
}
</style>
