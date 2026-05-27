import { create } from 'zustand';
import type { ThreatState } from '../types/threat';

export const useThreatStore = create<ThreatState>((set, get) => ({
  level: 0,
  maxLevel: 100,
  isHunted: false,

  addThreat: (amount) => {
    const newLevel = Math.min(get().maxLevel, get().level + amount);
    set({ 
      level: newLevel, 
      isHunted: newLevel >= 60 
    });
  },

  decayThreat: (amount) => {
    const newLevel = Math.max(0, get().level - amount);
    set({ 
      level: newLevel, 
      isHunted: newLevel >= 60 
    });
  },

  resetThreat: () => set({ level: 0, isHunted: false }),
}));