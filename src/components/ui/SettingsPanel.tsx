import { useSettingsStore } from '../../store/useSettingsStore';
import { QUALITY_PRESETS, type QualityPreset } from '../../types/settings';

const SettingsPanel = () => {
  const {
    masterVolume, cameraSensitivity, fogFar, bloomIntensity, qualityPreset,
    updateSetting, applyPreset
  } = useSettingsStore();

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <h2 className="text-xl font-mono text-cyan-300 tracking-widest">SYSTEM SETTINGS</h2>
          <button onClick={() => updateSetting('showPerformanceOverlay', false)} className="text-red-400 hover:text-white font-mono text-sm border border-red-500/50 px-3 py-1 rounded">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-cyan-400 uppercase">Audio</h3>
            <label className="flex items-center justify-between text-xs text-cyan-200/80">
              Master Volume
              <input type="range" min="0" max="1" step="0.05" value={masterVolume} 
                onChange={(e) => updateSetting('masterVolume', parseFloat(e.target.value))}
                className="ml-4 accent-cyan-400" />
            </label>
          </div>

          {/* Camera */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-cyan-400 uppercase">Controls</h3>
            <label className="flex items-center justify-between text-xs text-cyan-200/80">
              Camera Sensitivity
              <input type="range" min="0.5" max="3" step="0.1" value={cameraSensitivity} 
                onChange={(e) => updateSetting('cameraSensitivity', parseFloat(e.target.value))}
                className="ml-4 accent-cyan-400" />
            </label>
          </div>

          {/* Quality Presets */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-cyan-400 uppercase">Render Preset</h3>
            <div className="flex gap-2">
              {(Object.keys(QUALITY_PRESETS) as QualityPreset[]).map(p => (
                <button key={p} onClick={() => applyPreset(p)}
                  className={`px-3 py-1 text-xs font-mono rounded border transition ${
                    qualityPreset === p ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'border-gray-600 text-gray-400 hover:border-cyan-400'
                  }`}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Overrides */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-cyan-400 uppercase">Advanced</h3>
            <label className="flex items-center justify-between text-xs text-cyan-200/80">
              Fog Distance
              <input type="range" min="50" max="250" step="10" value={fogFar} 
                onChange={(e) => updateSetting('fogFar', parseInt(e.target.value))}
                className="ml-4 accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between text-xs text-cyan-200/80">
              Bloom Intensity
              <input type="range" min="0" max="1.5" step="0.05" value={bloomIntensity} 
                onChange={(e) => updateSetting('bloomIntensity', parseFloat(e.target.value))}
                className="ml-4 accent-cyan-400" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;