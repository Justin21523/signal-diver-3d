import { create } from 'zustand';

interface UIStore {
  isDebugVisible: boolean;
  isMenuOpen: boolean;
  notifications: string[];
  toggleDebug: () => void;
  toggleMenu: () => void;
  pushNotification: (message: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDebugVisible: true,
  isMenuOpen: false,
  notifications: [],
  toggleDebug: () => set((s) => ({ isDebugVisible: !s.isDebugVisible })),
  toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
  pushNotification: (message) =>
    set((s) => ({ notifications: [...s.notifications, message].slice(-5) })),
  clearNotifications: () => set({ notifications: [] }),
}));