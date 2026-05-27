import { create } from 'zustand';

interface CinematicStore {
  isPlaying: boolean;
  progress: number; // 0 to 1
  startCinematic: () => void;
  updateProgress: (p: number) => void;
  endCinematic: () => void;
}

export const useCinematicStore = create<CinematicStore>((set) => ({
  isPlaying: false,
  progress: 0,
  startCinematic: () => set({ isPlaying: true, progress: 0 }),
  updateProgress: (progress) => set({ progress }),
  endCinematic: () => set({ isPlaying: false, progress: 0 }),
}));