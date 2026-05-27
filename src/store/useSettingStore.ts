import { create } from 'zustand';
import type { SettingsState, QualityPreset } from '../types/settings';
import { QUALITY_PRESETS } from '../types/settings';

const STORAGE_KEY = 'signal-diver-settings-v1';

const loadDefaults = (): Omit<SettingsState, 'updateSetting' | 'applyPreset'> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
  }
  return {
    masterVolume: 0.75,
    cameraSensitivity: 1.5,
    fogFar: 130,
    particleCount: 2000,
    bloomIntensity: 0.65,
    qualityPreset: 'high',
    showPerformanceOverlay: false,
  };
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadDefaults(),
  updateSetting: (key, value) => {
    set(() => ({ [key]: value }));
    const { updateSetting: _u, applyPreset: _a, ...serializable } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  },
  applyPreset: (preset: QualityPreset) => {
    const defaults = QUALITY_PRESETS[preset];
    set({ qualityPreset: preset, ...defaults });
    const { updateSetting: _u, applyPreset: _a, ...serializable } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  },
}));
