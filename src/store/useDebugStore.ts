import { create } from 'zustand';

interface DebugStore {
  fps: number;
  frameTime: number;
  setFps: (fps: number) => void;
  setFrameTime: (frameTime: number) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  fps: 0,
  frameTime: 0,
  setFps: (fps) => set({ fps }),
  setFrameTime: (frameTime) => set({ frameTime }),
}));