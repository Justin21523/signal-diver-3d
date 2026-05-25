import Phaser from 'phaser';
import { completePuzzle } from '../bridge';

interface NodeData {
  id: number;
  x: number;
  y: number;
  period: number; // ms for full pulse cycle
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

    // Background grid effect
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x004466, 0.3);
    for (let i = 0; i < width; i += 40) {
      grid.moveTo(i, 0);
      grid.lineTo(i, height);
    }
    for (let j = 0; j < height; j += 40) {
      grid.moveTo(0, j);
      grid.lineTo(width, j);
    }
    grid.strokePath();

    // Title
    this.add.text(width / 2, 60, 'FREQUENCE SEQUENCE SYNC', {
      fontSize: '24px',
      color: '#22d3ee',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, 110, 'Click nodes from SLOWEST to FASTEST pulse', {
      fontSize: '16px',
      color: '#80deea',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Generate 4 nodes with different pulse speeds
    const periods = [2000, 1200, 800, 500]; // ms (Slowest to Fastest)
    const shuffledPeriods = Phaser.Utils.Array.Shuffle([...periods]);
    
    // Target sequence is the indices of the sorted periods (slowest to fastest)
    const sortedPeriods = [...periods].sort((a, b) => b - a); // descending (slowest first)
    this.targetSequence = sortedPeriods.map(p => shuffledPeriods.indexOf(p));

    const startX = width / 2 - 225;
    const spacing = 150;

    for (let i = 0; i < 4; i++) {
      const x = startX + i * spacing;
      const y = height / 2 + 20;
      const period = shuffledPeriods[i];

      const gfx = this.add.graphics();
      const txt = this.add.text(x, y + 60, `NODE ${i + 1}`, {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }).setOrigin(0.5);

      const node: NodeData = {
        id: i,
        x,
        y,
        period,
        graphics: gfx,
        text: txt,
        clicked: false,
      };

      this.nodes.push(node);

      // Hit area
      const hitArea = this.add.zone(x, y, 80, 80).setInteractive({ useHandCursor: true });
      hitArea.on('pointerdown', () => this.handleNodeClick(i));
    }

    // Exit button
    const exitBtn = this.add.text(width - 80, height - 40, '[ ABORT ]', {
      fontSize: '16px',
      color: '#ef4444',
      fontFamily: 'monospace',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    exitBtn.on('pointerdown', () => {
      completePuzzle(false);
    });
  }

  update(time: number) {
    if (this.isCompleted) return;

    for (const node of this.nodes) {
      node.graphics.clear();
      
      // Calculate pulse phase (0 to 1)
      const phase = (time % node.period) / node.period;
      // Convert to sine wave for smooth pulsing (0 to 1)
      const pulse = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      
      const radius = 20 + pulse * 20;
      const alpha = 0.3 + pulse * 0.7;
      
      let color = 0x00e5ff; // Cyan
      if (node.clicked) {
        color = 0x69f0ae; // Green
      }

      node.graphics.lineStyle(3, color, alpha);
      node.graphics.strokeCircle(node.x, node.y, radius);
      
      node.graphics.fillStyle(color, alpha * 0.3);
      node.graphics.fillCircle(node.x, node.y, radius);
    }
  }

  handleNodeClick(nodeId: number) {
    if (this.isCompleted) return;
    if (this.nodes[nodeId].clicked) return;

    const expectedNodeId = this.targetSequence[this.currentStep];

    if (nodeId === expectedNodeId) {
      // Correct
      this.nodes[nodeId].clicked = true;
      this.currentStep++;

      if (this.currentStep >= this.targetSequence.length) {
        this.isCompleted = true;
        this.statusText.setText('SYNC COMPLETE!');
        this.statusText.setColor('#69f0ae');
        
        this.time.delayedCall(1000, () => {
          completePuzzle(true);
        });
      }
    } else {
      // Wrong
      this.statusText.setText('SEQUENCE ERROR - RESETTING...');
      this.statusText.setColor('#ef4444');
      
      // Reset all
      this.time.delayedCall(800, () => {
        this.currentStep = 0;
        for (const n of this.nodes) {
          n.clicked = false;
        }
        this.statusText.setText('Click nodes from SLOWEST to FASTEST pulse');
        this.statusText.setColor('#80deea');
      });
    }
  }
}