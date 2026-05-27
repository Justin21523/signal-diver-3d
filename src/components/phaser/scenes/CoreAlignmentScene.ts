import Phaser from 'phaser';
import { completePuzzle } from '../bridge';

export class CoreAlignmentScene extends Phaser.Scene {
  rings: { angle: number; speed: number; target: number; locked: boolean; gfx: Phaser.GameObjects.Graphics }[] = [];
  statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'CoreAlignmentScene' });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.text(cx, 40, 'CORE ALIGNMENT PROTOCOL', {
      fontSize: '24px', color: '#fbbf24', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.statusText = this.add.text(cx, height - 40, 'Click to lock rings when markers align at the top', {
      fontSize: '14px', color: '#fcd34d', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // 3 Rings with different speeds and target angles (all targeting top: -PI/2)
    const configs = [
      { radius: 80, speed: 0.03, color: 0xef4444 },
      { radius: 130, speed: -0.045, color: 0xf97316 },
      { radius: 180, speed: 0.02, color: 0xeab308 },
    ];

    configs.forEach((cfg, i) => {
      const gfx = this.add.graphics();
      this.rings.push({
        angle: Math.random() * Math.PI * 2,
        speed: cfg.speed,
        target: -Math.PI / 2, // Top
        locked: false,
        gfx,
      });

      // Draw static track
      gfx.lineStyle(2, cfg.color, 0.2);
      gfx.strokeCircle(cx, cy, cfg.radius);
      
      // Draw target marker at top
      gfx.fillStyle(0xffffff, 0.5);
      gfx.fillRect(cx - 2, cy - cfg.radius - 10, 4, 20);
    });

    // Click handler
    this.input.on('pointerdown', () => this.lockNextRing());

    // Abort
    const exitBtn = this.add.text(width - 80, height - 30, '[ ABORT ]', {
      fontSize: '14px', color: '#f87171', fontFamily: 'monospace', backgroundColor: '#000', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    exitBtn.on('pointerdown', () => completePuzzle(false));
  }

  update() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.rings.forEach((ring, i) => {
      ring.gfx.clear();
      
      // Redraw track
      ring.gfx.lineStyle(2, ring.locked ? 0x4ade80 : [0xef4444, 0xf97316, 0xeab308][i], 0.3);
      ring.gfx.strokeCircle(cx, cy, [80, 130, 180][i]);
      ring.gfx.fillStyle(0xffffff, 0.5);
      ring.gfx.fillRect(cx - 2, cy - [80, 130, 180][i] - 10, 4, 20);

      if (!ring.locked) {
        ring.angle += ring.speed;
      }

      // Draw marker
      const mx = cx + Math.cos(ring.angle) * [80, 130, 180][i];
      const my = cy + Math.sin(ring.angle) * [80, 130, 180][i];
      
      ring.gfx.fillStyle(ring.locked ? 0x4ade80 : [0xef4444, 0xf97316, 0xeab308][i], 1);
      ring.gfx.fillCircle(mx, my, 8);
    });
  }

  lockNextRing() {
    const currentRing = this.rings.find(r => !r.locked);
    if (!currentRing) return;

    // Check alignment (allow 0.15 radian tolerance)
    let diff = Math.abs(currentRing.angle - currentRing.target);
    diff = Math.min(diff, Math.PI * 2 - diff); // Handle wrap-around

    if (diff < 0.15) {
      currentRing.locked = true;
      currentRing.angle = currentRing.target; // Snap

      if (this.rings.every(r => r.locked)) {
        this.statusText.setText('ALIGNMENT COMPLETE');
        this.statusText.setColor('#4ade80');
        this.time.delayedCall(1000, () => completePuzzle(true));
      }
    } else {
      this.statusText.setText('MISALIGNMENT DETECTED');
      this.statusText.setColor('#ef4444');
      this.time.delayedCall(500, () => {
        this.statusText.setText('Click to lock rings when markers align at the top');
        this.statusText.setColor('#fcd34d');
      });
    }
  }
}