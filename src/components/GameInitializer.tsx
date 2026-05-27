import { useEffect, useState } from 'react';
import { useAudioStore } from '../store/useAudioStore';
import { useGameStore } from '../store/useGameStore';
import { loadGame } from '../utils/saveSystem';

const GameInitializer = () => {
  const [isReady, setIsReady] = useState(false);
  const initAudio = useAudioStore((s) => s.initAudio);
  const initializeGame = useGameStore((s) => s.initializeGame);

  useEffect(() => {
    const saveData = loadGame();
    initializeGame(saveData);
  }, [initializeGame]);

  const handleStart = () => {
    initAudio();
    setIsReady(true);
  };

  if (isReady) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer" onClick={handleStart}>
      <div className="text-4xl font-mono text-cyan-400 tracking-[0.3em] mb-4 animate-pulse">
        SIGNAL DIVER 3D
      </div>
      <div className="text-sm text-cyan-600/70 font-mono mb-8 tracking-widest">
        CLICK ANYWHERE TO DIVE
      </div>
      <div className="text-[10px] text-gray-500 font-mono max-w-md text-center leading-relaxed">
        Headphones recommended • W/S/A/D Move • Space/Ctrl Depth • Shift Boost • E Scan • F Repair • Tab Archive
      </div>
    </div>
  );
};

export default GameInitializer;