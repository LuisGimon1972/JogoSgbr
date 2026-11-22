import { CaixaRushAudio } from './CaixaRushAudio';
import {
  BAD_ITEMS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type CaixaRushSnapshot,
  type ComboTitle,
  type ConveyorItem,
  type FloatText,
  GOOD_ITEMS,
  LANES_Y,
  type Particle,
  SCANNER_Y,
} from './caixaRushTypes';

export type GameLevel = 'easy' | 'hard';

const BEST_STORAGE_KEY = 'sg_caixa_rush_quasar_best_v1';
const ITEM_WIDTH = 128;
const ITEM_HEIGHT = 85;
const ROUND_TOTAL_SECONDS = 60;
const ATLAS_COLS = 4;
const ATLAS_ROWS = 4;
const ATLAS_SRC = '/images/AtlasItens.png';

interface VictoryConfetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  color: string;
}

type ConveyorRenderItem = ConveyorItem & { atlasIndex: number };

export class CaixaRushEngine {
  private readonly audio = new CaixaRushAudio();

  private level: GameLevel = 'easy';
  private running = false;
  private finished = false;
  private victory = false;
  private score = 0;
  private bestScore = 0;
  private combo = 0;
  private maxCombo = 0;
  private timeLeft = ROUND_TOTAL_SECONDS;

  private goodTotalCount = 0;
  private goodScannedCount = 0;
  private goodMissedCount = 0;
  private badScannedCount = 0;

  private items: ConveyorRenderItem[] = [];
  private particles: Particle[] = [];
  private victoryConfetti: VictoryConfetti[] = [];
  private floatTexts: FloatText[] = [];
  private nextItemId = 1;

  private spawnTimer = 0.25;
  private lastSecTick = 0;
  private scannerX = CANVAS_WIDTH / 2;

  private moveLeft = false;
  private moveRight = false;

  private atlasImage: HTMLImageElement | null = null;
  private atlasLoaded = false;

  constructor() {
    const saved = Number(localStorage.getItem(BEST_STORAGE_KEY) || 0);
    this.bestScore = Number.isFinite(saved) ? saved : 0;

    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        this.atlasImage = img;
        this.atlasLoaded = true;
      };
      img.src = ATLAS_SRC;
    }
  }

  public getLevel(): GameLevel {
    return this.level;
  }

  public setLevel(nextLevel: GameLevel): GameLevel {
    this.level = nextLevel;
    return this.level;
  }

  public toggleLevel(): GameLevel {
    this.level = this.level === 'easy' ? 'hard' : 'easy';
    return this.level;
  }

  public getMultiplier(): number {
    return 1 + Math.floor(this.combo / 3);
  }

  private getComboInfo(): { title: ComboTitle; detail: string } {
    if (this.combo >= 12) {
      return { title: 'NOTA EMITIDA', detail: 'Ritmo fiscal impecável na ponta do caixa!' };
    }
    if (this.combo >= 6) {
      return { title: 'ESTOQUE EM DIA', detail: 'Zero gargalo e alta precisão!' };
    }
    if (this.combo >= 3) {
      return { title: 'PDV ÁGIL', detail: 'Atendimento rápido e fluido!' };
    }
    if (this.combo > 0) {
      return { title: 'SEM COMBO', detail: 'Sem erros até agora! Marque todos os certos.' };
    }
    return {
      title: 'SEM COMBO',
      detail: 'Marque todos os itens certos sem errar nenhum no tempo!',
    };
  }

  public getSnapshot(): CaixaRushSnapshot {
    const comboInfo = this.getComboInfo();
    return {
      running: this.running,
      finished: this.finished,
      victory: this.victory,
      level: this.level,
      score: this.score,
      bestScore: this.bestScore,
      combo: this.combo,
      maxCombo: this.maxCombo,
      multiplier: this.getMultiplier(),
      comboTitle: comboInfo.title,
      comboDetail: comboInfo.detail,
      timeLeft: Math.max(0, Math.ceil(this.timeLeft)),
      isMuted: this.audio.getMuted(),
      goodScannedCount: this.goodScannedCount,
      goodTotalCount: this.goodTotalCount,
      badScannedCount: this.badScannedCount,
    } as CaixaRushSnapshot;
  }

  public toggleMute(): boolean {
    return this.audio.toggleMute();
  }

  public setHorizontalInput(dir: 'left' | 'right', pressed: boolean): void {
    if (dir === 'left') this.moveLeft = pressed;
    if (dir === 'right') this.moveRight = pressed;
  }

  public startMatch(now: number): void {
    this.running = true;
    this.finished = false;
    this.victory = false;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = ROUND_TOTAL_SECONDS;
    this.goodTotalCount = 0;
    this.goodScannedCount = 0;
    this.goodMissedCount = 0;
    this.badScannedCount = 0;
    this.items = [];
    this.particles = [];
    this.victoryConfetti = [];
    this.floatTexts = [];
    this.spawnTimer = this.level === 'easy' ? 0.35 : 0.2;
    this.lastSecTick = now;
    this.scannerX = CANVAS_WIDTH / 2;
  }

  private checkVictoryCondition(): boolean {
    return this.badScannedCount === 0 && this.goodMissedCount === 0 && this.goodScannedCount > 0;
  }

  private spawnVictoryEffects(): void {
    const palette = ['#facc15', '#38bdf8', '#22c55e', '#a855f7', '#f472b6', '#fb923c'];
    const centers = [
      { x: CANVAS_WIDTH * 0.22, y: CANVAS_HEIGHT * 0.35 },
      { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.25 },
      { x: CANVAS_WIDTH * 0.78, y: CANVAS_HEIGHT * 0.35 },
    ];

    centers.forEach((center, cIdx) => {
      for (let i = 0; i < 16; i++) {
        const ang = (Math.PI * 2 * i) / 16;
        const spd = 65 + Math.random() * 135;
        this.particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.95,
          maxLife: 0.95,
          color: palette[(i + cIdx) % palette.length] ?? '#facc15',
        });
      }
    });

    for (let i = 0; i < 48; i++) {
      this.victoryConfetti.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -15 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 90,
        vy: 65 + Math.random() * 110,
        size: 5 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 8,
        life: 2.2 + Math.random() * 0.9,
        maxLife: 3.1,
        color: palette[i % palette.length] ?? '#facc15',
      });
    }

    this.floatTexts.push({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT * 0.32,
      text: 'VITÓRIA PERFEITA!',
      color: '#facc15',
      life: 1.5,
      maxLife: 1.5,
    });
  }

  private finishMatch(isVictory: boolean): void {
    if (!this.running) return;
    this.running = false;
    this.finished = true;
    this.victory = isVictory;

    if (isVictory) {
      this.spawnVictoryEffects();
      this.audio.playWin();
    } else {
      this.audio.playError();
    }
  }

  private spawnItem(): void {
    const isEasy = this.level === 'easy';
    const laneIdx = Math.floor(Math.random() * LANES_Y.length);
    const y = LANES_Y[laneIdx] ?? LANES_Y[0];
    const fromLeft = laneIdx % 2 === 0;
    const badChance = isEasy ? 0.2 : 0.32;
    const isBad = Math.random() < badChance;

    const elapsed = ROUND_TOTAL_SECONDS - this.timeLeft;
    const speedBase = isEasy ? 75 + elapsed * 0.85 : 115 + elapsed * 1.4;
    const speed = speedBase * (isEasy ? 0.85 + Math.random() * 0.25 : 0.88 + Math.random() * 0.35);
    const totalCells = ATLAS_COLS * ATLAS_ROWS;

    if (isBad) {
      const randIdx = Math.floor(Math.random() * BAD_ITEMS.length);
      const tpl = BAD_ITEMS[randIdx] ?? BAD_ITEMS[0];
      const atlasIndex = (9 + randIdx) % totalCells;
      const penaltyTime = isEasy ? Math.max(1, Math.round(tpl.penaltyTime * 0.5)) : tpl.penaltyTime;

      this.items.push({
        id: this.nextItemId++,
        x: fromLeft ? -55 : CANVAS_WIDTH + 55,
        y,
        w: ITEM_WIDTH,
        h: ITEM_HEIGHT,
        vx: fromLeft ? speed : -speed,
        isBad: true,
        label: tpl.label,
        color: tpl.color,
        points: 0,
        penaltyTime,
        atlasIndex,
      });
    } else {
      const randIdx = Math.floor(Math.random() * GOOD_ITEMS.length);
      const tpl = GOOD_ITEMS[randIdx] ?? GOOD_ITEMS[0];
      const atlasIndex = randIdx % totalCells;
      this.goodTotalCount += 1;

      this.items.push({
        id: this.nextItemId++,
        x: fromLeft ? -55 : CANVAS_WIDTH + 55,
        y,
        w: ITEM_WIDTH,
        h: ITEM_HEIGHT,
        vx: fromLeft ? speed : -speed,
        isBad: false,
        label: tpl.label,
        color: tpl.color,
        points: tpl.points,
        penaltyTime: 0,
        atlasIndex,
      });
    }
  }

  private addBurst(x: number, y: number, color: string, text: string): void {
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI * 2 * i) / 10;
      const spd = 50 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.45,
        maxLife: 0.45,
        color,
      });
    }
    this.floatTexts.push({
      x,
      y: y - 10,
      text,
      color,
      life: 0.75,
      maxLife: 0.75,
    });
  }

  private consumeItem(index: number): void {
    const [item] = this.items.splice(index, 1);
    if (!item || !this.running) return;

    if (item.isBad) {
      this.badScannedCount += 1;
      this.combo = 0;
      const scorePenalty = this.level === 'easy' ? 25 : 50;
      this.score = Math.max(0, this.score - scorePenalty);
      this.timeLeft = Math.max(0, this.timeLeft - item.penaltyTime);
      this.audio.playError();
      this.addBurst(item.x, item.y, '#ef4444', `-${item.penaltyTime}s!`);

      if (this.timeLeft <= 0) {
        this.finishMatch(false);
        return;
      }
    } else {
      this.goodScannedCount += 1;
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const gained = item.points * this.getMultiplier();
      this.score += gained;
      this.audio.playHit(this.combo);
      this.addBurst(item.x, item.y, item.color, `+${gained}`);
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(BEST_STORAGE_KEY, String(this.bestScore));
    }
  }

  public handlePointerAt(canvasX: number, canvasY: number): void {
    if (!this.running) return;
    this.scannerX = Math.max(48, Math.min(CANVAS_WIDTH - 48, canvasX));

    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (!it) continue;
      const pad = 8;
      if (
        canvasX >= it.x - it.w / 2 - pad &&
        canvasX <= it.x + it.w / 2 + pad &&
        canvasY >= it.y - it.h / 2 - pad &&
        canvasY <= it.y + it.h / 2 + pad
      ) {
        this.consumeItem(i);
        return;
      }
    }
  }

  public scanNearestToPdv(): void {
    if (!this.running) return;
    let bestIdx = -1;
    let bestDist = 78;

    this.items.forEach((it, idx) => {
      const dist = Math.hypot(it.x - this.scannerX, it.y - SCANNER_Y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    if (bestIdx >= 0) {
      this.consumeItem(bestIdx);
    }
  }

  private updateEffectsOnly(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (!p) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.victoryConfetti.length - 1; i >= 0; i--) {
      const c = this.victoryConfetti[i];
      if (!c) continue;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rotation += c.vRot * dt;
      c.life -= dt;
      if (c.life <= 0 || c.y > CANVAS_HEIGHT + 24) {
        this.victoryConfetti.splice(i, 1);
      }
    }

    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      if (!ft) continue;
      ft.y -= 36 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatTexts.splice(i, 1);
    }
  }

  public update(dt: number, now: number): void {
    if (!this.running) {
      this.updateEffectsOnly(dt);
      return;
    }

    if (now - this.lastSecTick >= 1000) {
      const elapsedSec = Math.floor((now - this.lastSecTick) / 1000);
      this.lastSecTick += elapsedSec * 1000;
      this.timeLeft -= elapsedSec;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.finishMatch(this.checkVictoryCondition());
        this.updateEffectsOnly(dt);
        return;
      }
    }

    if (this.moveLeft) this.scannerX -= 320 * dt;
    if (this.moveRight) this.scannerX += 320 * dt;
    this.scannerX = Math.max(48, Math.min(CANVAS_WIDTH - 48, this.scannerX));

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnItem();
      const elapsed = ROUND_TOTAL_SECONDS - this.timeLeft;
      this.spawnTimer =
        this.level === 'easy'
          ? Math.max(0.85, 1.45 - elapsed * 0.008)
          : Math.max(0.45, 0.92 - elapsed * 0.006);
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      if (!it) continue;
      it.x += it.vx * dt;
      if (it.x < -90 || it.x > CANVAS_WIDTH + 90) {
        if (!it.isBad && this.timeLeft > 0) {
          this.goodMissedCount += 1;
        }
        this.items.splice(i, 1);
      }
    }

    this.updateEffectsOnly(dt);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    LANES_Y.forEach((y, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(30, 41, 59, 0.78)' : 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(16, y - 14, CANVAS_WIDTH - 32, 28);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(22, y + 8);
      ctx.lineTo(CANVAS_WIDTH - 22, y + 8);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    this.items.forEach((it) => {
      const left = it.x - it.w / 2;
      const top = it.y - it.h / 2;

      if (this.atlasLoaded && this.atlasImage && this.atlasImage.width > 0) {
        const cellW = this.atlasImage.width / ATLAS_COLS;
        const cellH = this.atlasImage.height / ATLAS_ROWS;
        const col = it.atlasIndex % ATLAS_COLS;
        const row = Math.floor(it.atlasIndex / ATLAS_COLS) % ATLAS_ROWS;
        const pad = 2;

        ctx.drawImage(
          this.atlasImage,
          col * cellW + pad,
          row * cellH + pad,
          Math.max(1, cellW - pad * 2),
          Math.max(1, cellH - pad * 2),
          left,
          top,
          it.w,
          it.h,
        );
      } else {
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.roundRect(left, top, it.w, it.h, 6);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Nome sempre impresso sobre o item com contorno para leitura nítida
      ctx.save();
      ctx.font = '800 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(9, 13, 22, 0.9)';
      ctx.strokeText(it.label, it.x, it.y + 0.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(it.label, it.x, it.y + 0.5);
      ctx.restore();
    });

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(this.scannerX - 44, SCANNER_Y - 16, 88, 32, 8);
    ctx.fill();
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PDV SGBR', this.scannerX, SCANNER_Y);

    this.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    this.victoryConfetti.forEach((c) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, c.life / 0.8));
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size * 0.35, c.size, c.size * 0.7);
      ctx.restore();
    });

    this.floatTexts.forEach((ft) => {
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = ft.color;
      ctx.font = '800 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    });
    ctx.globalAlpha = 1;
  }
}
