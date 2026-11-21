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
      <q-btn
        dense
        unelevated
        color="positive"
        text-color="dark"
        class="text-weight-bold"
        label="Bipar"
        @click="$emit('scan')"
      />
    </div>

    <q-btn
      dense
      flat
      color="grey-3"
      :icon="isMuted ? 'volume_off' : 'volume_up'"
      :label="isMuted ? 'Mudo' : 'Som'"
      @click="$emit('toggle-mute')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isMuted: boolean;
}>();

defineEmits<{
  dir: [side: 'left' | 'right', pressed: boolean];
  scan: [];
  'toggle-mute': [];
}>();
</script>

<style scoped>
.panel {
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 12px;
}

.touch-btn {
  touch-action: none;
}
</style>
