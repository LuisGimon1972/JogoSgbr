import { onMounted, onUnmounted } from 'vue';
import type { CaixaRushEngine } from '../game/caixa-rush/CaixaRushEngine';

export function useCaixaRushControls(engine: CaixaRushEngine, onAction?: () => void) {
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      engine.setHorizontalInput('left', true);
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      engine.setHorizontalInput('right', true);
    } else if (event.code === 'Space') {
      event.preventDefault();
      engine.scanNearestToPdv();
      onAction?.();
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      engine.setHorizontalInput('left', false);
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      engine.setHorizontalInput('right', false);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
}
