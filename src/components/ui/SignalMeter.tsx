import { useGameStore } from '../../store/useGameStore';

const BAR_COUNT = 10;

const SignalMeter = () => {
  const signalStrength = useGameStore((s) => s.signalStrength);
  const percentage = Math.round(signalStrength * 100);

  return (
    <div className="bg-black/55 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-3 min-w-[230px]">
      <div className="text-[10px] text-cyan-300/70 uppercase tracking-[0.2em] mb-2">
        Signal Strength
      </div>
      <div className="flex items-end gap-1 h-8 mb-2">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const threshold = (i + 1) / BAR_COUNT;
          const active = signalStrength >= threshold - 0.05;
          return (
            <div
              key={i}
              style={{ height: `${threshold * 100}%` }}
              className={`flex-1 rounded-sm transition-colors ${
                active
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.85)]'
                  : 'bg-cyan-900/40'
              }`}
            />
          );
        })}
      </div>
      <div className="text-right font-mono text-cyan-100 text-lg leading-none">
        {percentage}
        <span className="text-xs text-cyan-300/60 ml-1">%</span>
      </div>
    </div>
  );
};

export default SignalMeter;