import Phaser from 'phaser';
import { completePuzzle } from '../bridge';

interface NodeData {
  id: number;
  x: number;
  y: number;
  period: number;
  graphics: Phaser.GameObjects.Graphics;
  text: Phaser.GameObjects.Text;
  clicked: boolean;
}

export class SequenceSyncScene extends Phaser.Scene {
  nodes: NodeData[] = [];
  targetSequence: number[] = [];
  currentStep = 0;
  statusText!: Phaser.GameObjects.Text;
  isCompleted = false;

  constructor() {
    super({ key: 'SequenceSyncScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Deep-sea grid background
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x0a3d3a, 0.4);
    for (let i = 0; i < width; i += 40) {
      grid.moveTo(i, 0);
      grid.lineTo(i, height);
    }
    for (let j = 0; j < height; j += 40) {
      grid.moveTo(0, j);
      grid.lineTo(width, j);
    }
    grid.strokePath();

    // UI
    this.add.text(width / 2, 60, 'FREQUENCE SEQUENCE SYNC', {
      fontSize: '22px',
      color: '#34d399',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, 100, 'Click nodes from SLOWEST to FASTEST pulse', {
      fontSize: '15px',
      color: '#6ee7b7',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Generate 4 nodes with different pulse speeds
    const periods = [2200, 1400, 900, 550];
    const shuffledPeriods = Phaser.Utils.Array.Shuffle([...periods]);
    const sortedPeriods = [...periods].sort((a, b) => b - a);
    this.targetSequence = sortedPeriods.map(p => shuffledPeriods.indexOf(p));

    const startX = width / 2 - 225;
    const spacing = 150;

    for (let i = 0; i < 4; i++) {
      const x = startX + i * spacing;
      const y = height / 2 + 20;
      const period = shuffledPeriods[i];

      const gfx = this.add.graphics();
      const txt = this.add.text(x, y + 60, `NODE ${i + 1}`, {
        fontSize: '13px',
        color: '#e0f2fe',
        fontFamily: 'monospace',
      }).setOrigin(0.5);

      this.nodes.push({ id: i, x, y, period, graphics: gfx, text: txt, clicked: false });

      const hitArea = this.add.zone(x, y, 80, 80).setInteractive({ useHandCursor: true });
      hitArea.on('pointerdown', () => this.handleNodeClick(i));
    }

    const exitBtn = this.add.text(width - 80, height - 40, '[ ABORT ]', {
      fontSize: '14px',
      color: '#f87171',
      fontFamily: 'monospace',
      backgroundColor: '#001514',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    exitBtn.on('pointerdown', () => completePuzzle(false));
  }

  update(time: number) {
    if (this.isCompleted) return;

    for (const node of this.nodes) {
      node.graphics.clear();
      const phase = (time % node.period) / node.period;
      const pulse = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const radius = 18 + pulse * 22;
      const alpha = 0.25 + pulse * 0.75;
      const color = node.clicked ? 0x34d399 : 0x2dd4bf;

      node.graphics.lineStyle(3, color, alpha);
      node.graphics.strokeCircle(node.x, node.y, radius);
      node.graphics.fillStyle(color, alpha * 0.3);
      node.graphics.fillCircle(node.x, node.y, radius);
    }
  }

  handleNodeClick(nodeId: number) {
    if (this.isCompleted || this.nodes[nodeId].clicked) return;

    if (nodeId === this.targetSequence[this.currentStep]) {
      this.nodes[nodeId].clicked = true;
      this.currentStep++;

      if (this.currentStep >= this.targetSequence.length) {
        this.isCompleted = true;
        this.statusText.setText('SYNC COMPLETE');
        this.statusText.setColor('#4ade80');
        this.time.delayedCall(900, () => completePuzzle(true));
      }
    } else {
      this.statusText.setText('SEQUENCE ERROR - RESETTING');
      this.statusText.setColor('#f87171');
      this.time.delayedCall(700, () => {
        this.currentStep = 0;
        for (const n of this.nodes) n.clicked = false;
        this.statusText.setText('Click nodes from SLOWEST to FASTEST pulse');
        this.statusText.setColor('#6ee7b7');
      });
    }
  }
}