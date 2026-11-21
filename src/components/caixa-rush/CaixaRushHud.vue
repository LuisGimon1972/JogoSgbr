<template>
  <div class="column q-gutter-xs">
    <div class="panel row items-center justify-between q-pa-sm q-gutter-xs">
      <div class="column">
        <div class="text-subtitle1 text-weight-bolder text-amber-4">SG CAIXA RUSH GAME</div>
        <div class="text-caption text-grey-4">SGBR Sistemas LTDA</div>
      </div>

      <div class="row items-center q-gutter-xs">
        <q-badge color="slate-8" text-color="white" class="stat-badge">
          Pontos: <strong class="q-ml-xs text-light-blue-3">{{ hud.score }}</strong>
        </q-badge>
        <q-badge color="slate-8" text-color="white" class="stat-badge">
          Tempo: <strong class="q-ml-xs text-amber-3">{{ hud.timeLeft }}s</strong>
        </q-badge>
        <q-badge color="slate-8" text-color="white" class="stat-badge">
          Recorde: <strong class="q-ml-xs text-positive">{{ hud.bestScore }}</strong>
        </q-badge>
      </div>
    </div>

    <div class="combo-box row items-center justify-between q-px-sm q-py-xs">
      <div class="row items-center q-gutter-xs">
        <q-badge color="light-blue-7" text-color="white" :label="hud.comboTitle" />
        <span class="text-caption text-grey-3">{{ hud.comboDetail }}</span>
      </div>
      <span class="text-subtitle2 text-weight-bolder text-amber-4">x{{ hud.multiplier }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaixaRushSnapshot } from '../../game/caixa-rush/caixaRushTypes';

defineProps<{
  hud: CaixaRushSnapshot;
}>();
</script>

<style scoped>
.panel {
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 12px;
}

.stat-badge {
  background: rgba(30, 41, 59, 0.95);
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 0.78rem;
}

.combo-box {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 10px;
  min-height: 36px;
}
</style>
