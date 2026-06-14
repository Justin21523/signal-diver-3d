import { create } from 'zustand';

export interface MissionRunResult {
  reason: 'time_expired' | 'source_repaired';
  durationSeconds: number;
  fragmentsCollected: number;
  fragmentsTotal: number;
  nodesRepaired: number;
  nodesTotal: number;
  missionsCompleted: number;
  missionsTotal: number;
  maxDepth: number;
  distanceTraveled: number;
  scanCount: number;
  puzzlesSolved: number;
  score: number;
}

const RESULT_HISTORY_KEY = 'signal-diver-run-results';

const persistResult = (result: MissionRunResult) => {
  const raw = window.localStorage.getItem(RESULT_HISTORY_KEY);
  const history = raw ? JSON.parse(raw) as MissionRunResult[] : [];
  window.localStorage.setItem(
    RESULT_HISTORY_KEY,
    JSON.stringify([{ ...result }, ...history].slice(0, 20)),
  );
};

interface MissionTimerStore {
  durationMinutes: number | null;
  startedAt: number | null;
  endsAt: number | null;
  remainingMs: number;
  maxDepth: number;
  result: MissionRunResult | null;
  startRun: (minutes: number) => void;
  updateRemaining: (now?: number) => void;
  recordDepth: (depth: number) => void;
  finishRun: (result: MissionRunResult) => void;
  resetRun: () => void;
}

export const useMissionTimerStore = create<MissionTimerStore>((set, get) => ({
  durationMinutes: null,
  startedAt: null,
  endsAt: null,
  remainingMs: 0,
  maxDepth: 0,
  result: null,

  startRun: (durationMinutes) => {
    const startedAt = Date.now();
    const durationMs = durationMinutes * 60 * 1000;
    set({
      durationMinutes,
      startedAt,
      endsAt: startedAt + durationMs,
      remainingMs: durationMs,
      maxDepth: 0,
      result: null,
    });
  },

  updateRemaining: (now = Date.now()) => {
    const { endsAt, result } = get();
    if (!endsAt || result) return;
    set({ remainingMs: Math.max(0, endsAt - now) });
  },

  recordDepth: (depth) =>
    set((state) => ({ maxDepth: Math.max(state.maxDepth, depth) })),

  finishRun: (result) => {
    persistResult(result);
    set({ result, remainingMs: 0 });
  },

  resetRun: () =>
    set({
      durationMinutes: null,
      startedAt: null,
      endsAt: null,
      remainingMs: 0,
      maxDepth: 0,
      result: null,
    }),
}));
