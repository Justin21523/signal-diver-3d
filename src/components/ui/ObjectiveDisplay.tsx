import { useGameStore } from '../../store/useGameStore';

const ObjectiveDisplay = () => {
  const currentObjective = useGameStore((s) => s.currentObjective);

  return (
    <div className="bg-black/55 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.85)]" />
        <div className="text-[10px] text-cyan-300/70 uppercase tracking-[0.2em]">
          Current Objective
        </div>
      </div>
      <div className="text-cyan-100 font-semibold text-sm leading-tight">
        {currentObjective.title}
      </div>
      <div className="text-[11px] text-cyan-300/60 mt-1 leading-snug">
        {currentObjective.description}
      </div>
    </div>
  );
};

export default ObjectiveDisplay;