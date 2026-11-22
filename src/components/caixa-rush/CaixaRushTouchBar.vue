<template>
  <div class="panel row items-center justify-between q-pa-xs q-gutter-xs">
    <div class="row items-center q-gutter-xs">
      <q-btn
        dense
        outline
        color="light-blue-4"
        icon="chevron_left"
        class="touch-btn"
        @pointerdown="$emit('dir', 'left', true)"
        @pointerup="$emit('dir', 'left', false)"
        @pointerleave="$emit('dir', 'left', false)"
        @pointercancel="$emit('dir', 'left', false)"
      />
      <q-btn
        dense
        outline
        color="light-blue-4"
        icon="chevron_right"
        class="touch-btn"
        @pointerdown="$emit('dir', 'right', true)"
        @pointerup="$emit('dir', 'right', false)"
        @pointerleave="$emit('dir', 'right', false)"
        @pointercancel="$emit('dir', 'right', false)"
      />
    </div>

    <div class="row items-center right-actions">
      <q-btn
        type="button"
        color="green-8"
        text-color="white"
        label="Reiniciar"
        dense
        unelevated
        class="action-btn q-px-sm"
        @click.stop="handleRestart"
      />
      <q-btn
        type="button"
        color="deep-orange-9"
        text-color="white"
        label="Sair"
        dense
        unelevated
        class="action-btn q-px-sm"
        @click.stop="exitGame"
      />
      <q-btn
        type="button"
        dense
        flat
        color="grey-3"
        :icon="isMuted ? 'volume_off' : 'volume_up'"
        :label="isMuted ? 'Mudo' : 'Som'"
        @click.stop="$emit('toggle-mute')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

function reiniciarSimples<T>(
  estadoRef: Ref<T>,
  criarEstadoInicial: () => T,
  aoReiniciar?: () => void,
): void {
  estadoRef.value = criarEstadoInicial();
  aoReiniciar?.();
}

const router = useRouter();

const props = defineProps<{
  isMuted: boolean;
  onRestart?: () => void;
}>();

const emit = defineEmits<{
  dir: [side: 'left' | 'right', pressed: boolean];
  scan: [];
  'toggle-mute': [];
  restart: [count: number];
}>();

const restartCount = ref(0);

const handleRestart = () => {
  reiniciarSimples(
    restartCount,
    () => restartCount.value + 1,
    () => {
      props.onRestart?.();
      emit('restart', restartCount.value);
    },
  );
};

const exitGame = () => {
  window.close();
  setTimeout(() => {
    router.push('/');
  }, 100);
};
</script>

<style scoped>
.panel {
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 12px;
  position: relative;
  z-index: 10;
}

.right-actions {
  gap: 4px;
}

.touch-btn {
  touch-action: none;
}

.action-btn {
  font-size: 10px;
  padding: 5px 8px;
}
</style>
