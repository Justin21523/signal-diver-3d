import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useMissionTimerStore } from '../../store/useMissionTimerStore';
import { finishMissionRun, formatTime } from '../../utils/missionRun';

const OPTIONS = [3, 5, 10, 15];

const MissionTimerPanel = () => {
  const gameState = useGameStore((s) => s.gameState);
  const startedAt = useMissionTimerStore((s) => s.startedAt);
  const endsAt = useMissionTimerStore((s) => s.endsAt);
  const remainingMs = useMissionTimerStore((s) => s.remainingMs);
  const result = useMissionTimerStore((s) => s.result);
  const startRun = useMissionTimerStore((s) => s.startRun);
  const updateRemaining = useMissionTimerStore((s) => s.updateRemaining);

  useEffect(() => {
    if (!endsAt || result) return;

    const id = window.setInterval(() => {
      updateRemaining();
      if (Date.now() >= endsAt) {
        finishMissionRun('time_expired');
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [endsAt, result, updateRemaining]);

  if (gameState === 'menu' || gameState === 'ending') return null;

  if (!startedAt && gameState === 'playing') {
    return (
      <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
        <div className="w-[min(92vw,520px)] border border-cyan-400/50 bg-[#021412]/95 p-6 rounded-lg shadow-[0_0_35px_rgba(34,211,238,0.18)]">
          <div className="text-xs font-mono text-cyan-300/70 tracking-[0.25em] uppercase mb-2">
            Mission Timer
          </div>
          <h2 className="text-2xl font-mono text-cyan-100 mb-5">
            Select Dive Duration
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((minutes) => (
              <button
                key={minutes}
                onClick={() => startRun(minutes)}
                className="border border-cyan-500/60 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-100 font-mono py-4 rounded transition"
              >
                {minutes} MIN
              </button>
            ))}
          </div>

          <div className="mt-5 text-xs text-cyan-300/60 font-mono leading-relaxed">
            Time starts after selection. When time expires, the run records depth, fragments, repairs,
            completed missions, scans, puzzles, distance, and score.
          </div>
        </div>
      </div>
    );
  }

  if (!startedAt) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div className={`bg-black/65 border rounded-lg px-5 py-3 font-mono text-center backdrop-blur-sm ${
        remainingMs < 30000 ? 'border-red-400/70 text-red-300 animate-pulse' : 'border-cyan-400/40 text-cyan-100'
      }`}>
        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">Time Remaining</div>
        <div className="text-2xl leading-none mt-1">{formatTime(remainingMs)}</div>
      </div>
    </div>
  );
};

export default MissionTimerPanel;
