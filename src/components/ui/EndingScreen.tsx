import { useGameStore } from '../../store/useGameStore';
import { useCinematicStore } from '../../store/useCinematicStore';

const EndingScreen = () => {
  const gameState = useGameStore((s) => s.gameState);
  const fragments = useGameStore((s) => s.fragments);
  const progress = useCinematicStore((s) => s.progress);
  
  if (gameState !== 'ending') return null;

  const collected = fragments.filter(f => f.collected).length;
  const total = fragments.length;
  const percentage = collected / total;

  let title: string = '';
  let text: string = '';

  if (percentage >= 0.8) {
    title = 'THE ARCHIVIST';
    text = 'You recovered the lost memories. The data ocean is calm once more. The AI remembers its creators, and in turn, it remembers you. The surface may be gone, but the legacy survives in the deep.';
  } else if (percentage >= 0.4) {
    title = 'THE SURVIVOR';
    text = 'The core is stabilized, but many fragments remain lost in the abyss. The network holds, barely. You pilot the Signal Diver back toward the faint light of the surface, carrying only pieces of the truth.';
  } else {
    title = 'THE ECHO';
    text = 'The core hums with a fragile rhythm. You fixed the machine, but the soul of the data ocean is gone. You drift in the silent dark, a ghost in a sea of static.';
  }

  return (
    <div className={`absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 transition-opacity duration-1000 ${progress > 0.9 ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-5xl font-mono text-cyan-400 tracking-[0.4em] mb-8 animate-pulse">{title}</h1>
      <p className="max-w-2xl text-center text-cyan-100/80 text-lg leading-relaxed font-light mb-12">
        {text}
      </p>
      <div className="text-sm font-mono text-cyan-500/60 mb-8">
        Data Recovered: {collected} / {total} ({Math.round(percentage * 100)}%)
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-3 border border-cyan-500 text-cyan-300 font-mono tracking-widest hover:bg-cyan-500/20 transition"
      >
        RETURN TO MENU
      </button>
    </div>
  );
};

export default EndingScreen;