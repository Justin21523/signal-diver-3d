import { useGameStore } from '../../store/useGameStore';

/**
 * Bridge to allow Phaser scenes to communicate with the React/Zustand state.
 */
export const completePuzzle = (success: boolean) => {
  useGameStore.getState().completePuzzle(success);
};

export const getPuzzleTargetId = (): string | null => {
  return useGameStore.getState().activePuzzle?.targetId || null;
};