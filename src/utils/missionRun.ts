import { useGameStore } from '../store/useGameStore';
import { useMissionStore } from '../store/useMissionStore';
import { useMissionTimerStore, type MissionRunResult } from '../store/useMissionTimerStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useTelemetryStore } from '../store/useTelemetryStore';

export const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const createMissionRunResult = (reason: MissionRunResult['reason']): MissionRunResult => {
  const game = useGameStore.getState();
  const timer = useMissionTimerStore.getState();
  const telemetry = useTelemetryStore.getState();
  const player = usePlayerStore.getState();
  const missions = useMissionStore.getState().missions;

  const fragmentsCollected = game.fragments.filter((f) => f.collected).length;
  const nodesRepaired = game.nodes.filter((n) => n.repaired).length;
  const missionsCompleted = missions.filter((m) => m.status === 'completed').length;
  const durationSeconds = timer.startedAt
    ? Math.round((Date.now() - timer.startedAt) / 1000)
    : 0;
  const maxDepth = Math.max(timer.maxDepth, player.depth);

  return {
    reason,
    durationSeconds,
    fragmentsCollected,
    fragmentsTotal: game.fragments.length,
    nodesRepaired,
    nodesTotal: game.nodes.length,
    missionsCompleted,
    missionsTotal: missions.length,
    maxDepth,
    distanceTraveled: telemetry.distanceTraveled,
    scanCount: telemetry.scanCount,
    puzzlesSolved: telemetry.puzzlesSolved,
    score:
      fragmentsCollected * 100 +
      nodesRepaired * 350 +
      missionsCompleted * 250 +
      Math.round(maxDepth) +
      (reason === 'source_repaired' ? 5000 : 0),
  };
};

export const finishMissionRun = (reason: MissionRunResult['reason']) => {
  const timer = useMissionTimerStore.getState();
  if (timer.result) return;

  timer.finishRun(createMissionRunResult(reason));
  useGameStore.getState().setGameState('ending');
};
