import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { SequenceSyncScene } from './scenes/SequenceSyncScene';
import { useGameStore } from '../../store/useGameStore';

const PhaserOverlay = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameState = useGameStore((s) => s.gameState);
  const activePuzzle = useGameStore((s) => s.activePuzzle);

  useEffect(() => {
    if (gameState === 'puzzle' && activePuzzle && containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 500,
        parent: containerRef.current,
        backgroundColor: '#000a14',
        scene: [SequenceSyncScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameState !== 'puzzle' && gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameState, activePuzzle]);

  if (gameState !== 'puzzle') return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/85 z-50 pointer-events-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
          ESTABLISHING NEURAL LINK...
        </div>
        <div 
          ref={containerRef} 
          className="border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.4)] rounded-lg overflow-hidden" 
        />
      </div>
    </div>
  );
};

export default PhaserOverlay;