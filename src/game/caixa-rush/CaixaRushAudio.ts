export class CaixaRushAudio {
  private isMuted = false;
  private audioCtx: AudioContext | null = null;
  private winTimers: number[] = [];

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.clearWinTimers();
    }
    return this.isMuted;
  }

  private clearWinTimers(): void {
    for (const timerId of this.winTimers) {
      window.clearTimeout(timerId);
    }
    this.winTimers = [];
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gainPeak: number,
    startOffsetSec = 0,
  ): void {
    if (this.isMuted) return;
    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextCtor();
      }
      if (this.audioCtx.state === 'suspended') {
        void this.audioCtx.resume();
      }

      const startAt = this.audioCtx.currentTime + Math.max(0, startOffsetSec);
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startAt);

      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainPeak, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, startAt + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.02);
    } catch {}
  }

  public playHit(combo: number): void {
    const pitch = Math.min(920, 440 + combo * 35);
    this.playTone(pitch, 0.09, 'triangle', 0.09);
  }

  public playError(): void {
    this.playTone(155, 0.22, 'sawtooth', 0.09);
  }

  public playWin(): void {
    if (this.isMuted) return;
    this.clearWinTimers();

    const notes: Array<{ freq: number; duration: number; delayMs: number; gain: number }> = [
      { freq: 523.25, duration: 0.14, delayMs: 0, gain: 0.12 },
      { freq: 659.25, duration: 0.14, delayMs: 110, gain: 0.12 },
      { freq: 783.99, duration: 0.16, delayMs: 220, gain: 0.13 },
      { freq: 1046.5, duration: 0.36, delayMs: 340, gain: 0.15 },
      { freq: 1318.51, duration: 0.42, delayMs: 490, gain: 0.12 },
    ];

    notes.forEach((note) => {
      this.playTone(note.freq, note.duration, 'triangle', note.gain, note.delayMs / 1000);
      this.playTone(
        note.freq * 2,
        note.duration * 0.7,
        'sine',
        note.gain * 0.28,
        note.delayMs / 1000,
      );
    });

    const cleanupId = window.setTimeout(() => {
      this.winTimers = [];
    }, 950);
    this.winTimers.push(cleanupId);
  }
}
