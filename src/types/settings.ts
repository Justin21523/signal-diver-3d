export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface SettingsState {
  masterVolume: number; // 0..1
  cameraSensitivity: number; // 0.5..3.0
  fogFar: number;
  particleCount: number;
  bloomIntensity: number;
  qualityPreset: QualityPreset;
  showPerformanceOverlay: boolean;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  applyPreset: (preset: QualityPreset) => void;
}

export const QUALITY_PRESETS: Record<QualityPreset, Partial<Omit<SettingsState, 'applyPreset' | 'updateSetting'>>> = {
  low: { fogFar: 60, particleCount: 500, bloomIntensity: 0.25 },
  medium: { fogFar: 90, particleCount: 1200, bloomIntensity: 0.5 },
  high: { fogFar: 130, particleCount: 2000, bloomIntensity: 0.65 },
  ultra: { fogFar: 200, particleCount: 4000, bloomIntensity: 0.85 },
};