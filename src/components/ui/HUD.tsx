import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';
import { useAudioStore } from '../../store/useAudioStore';
import SignalMeter from './SignalMeter';
import ObjectiveDisplay from './ObjectiveDisplay';
import Radar from './Radar';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useThreatStore } from '../../store/useThreatStore';

const StatCell = ({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
}) => (
  <div className="bg-black/55 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-3 min-w-[200px]">
    <div className="text-[10px] text-cyan-300/70 uppercase tracking-[0.2em] mb-1">{label}</div>
    <div className={`text-2xl font-mono ${accent ?? 'text-cyan-100'} leading-none`}>
      {value}
      {unit && <span className="text-xs text-cyan-300/70 ml-1">{unit}</span>}
    </div>
  </div>
);

const HUD = () => {
  const speed = usePlayerStore((s) => s.speed);
  const depth = usePlayerStore((s) => s.depth);
  const isBoosting = usePlayerStore((s) => s.isBoosting);

  const currentZone = useGameStore((s) => s.currentZone);
  const fragmentsCollected = useGameStore((s) => s.fragments.filter(f => f.collected).length);
  const nodesRepaired = useGameStore((s) => s.nodes.filter(n => n.repaired).length);
  const isArchiveOpen = useGameStore((s) => s.isArchiveOpen); 
  
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  
  const exportData = useTelemetryStore((s) => s.exportData);
  
  const threatLevel = useThreatStore((s) => s.level);
  const isHunted = useThreatStore((s) => s.isHunted);

  return (
    <div className={`absolute inset-0 pointer-events-none ${isArchiveOpen ? 'opacity-30' : ''} transition-opacity`}>
      <Radar />
      {/* Top left: depth + speed */}
      <div className="absolute top-6 left-6 space-y-3">
        <StatCell label="Depth" value={depth.toFixed(1)} unit="m" />
        <div>
          <StatCell label="Speed" value={speed.toFixed(1)} unit="u/s" />
          {isBoosting && (
            <div className="mt-1 text-[11px] text-yellow-300 font-mono animate-pulse pl-1">
              ◆ BOOST ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Top right: signal meter */}
      <div className="absolute top-6 right-6">
        <SignalMeter />
        <button 
          onClick={toggleMute} 
          className="bg-black/55 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 hover:bg-cyan-900/30 transition pointer-events-auto"
        >
          {isMuted ? '🔇 UNMUTE AUDIO' : '🔊 MUTE AUDIO'}
        </button>
        {/* Export telemetry button */}
        <button 
          onClick={exportData} 
          className="bg-black/55 backdrop-blur-sm border border-purple-400/30 rounded-lg px-3 py-2 text-xs font-mono text-purple-300 hover:bg-purple-900/30 transition pointer-events-auto"
          title="Export Telemetry JSON"
        >
          📊 EXPORT DATA
        </button>
        {/* Threat level indicator */}
        <div className={`bg-black/55 backdrop-blur-sm border rounded-lg px-4 py-3 min-w-[190px] transition-colors ${
          isHunted ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-cyan-400/30'
        }`}>
          <div className="text-[10px] text-cyan-300/70 uppercase tracking-[0.2em] mb-1">Threat Level</div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${isHunted ? 'bg-red-500' : 'bg-yellow-500'}`} 
              style={{ width: `${threatLevel}%` }} 
            />
          </div>
          <div className={`text-xs font-mono ${isHunted ? 'text-red-400 animate-pulse' : 'text-cyan-200/60'}`}>
            {isHunted ? '⚠ HUNTED' : threatLevel < 20 ? 'SAFE' : 'ELEVATED'}
          </div>
        </div>
      </div>


      
      {/* Bottom left: objective */}
      <div className="absolute bottom-10 left-6 max-w-md">
        <ObjectiveDisplay />
      </div>

      {/* Bottom right: zone + stats */}
      <div className="absolute bottom-10 right-6 space-y-2 text-right">
        <div className="bg-black/55 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-2">
          <div className="text-[10px] text-cyan-300/70 uppercase tracking-[0.2em]">Zone</div>
          <div className="text-sm font-mono text-cyan-100 uppercase">{currentZone}</div>
        </div>
        <div className="bg-black/55 backdrop-blur-sm border border-orange-400/30 rounded-lg px-4 py-2">
          <div className="text-[10px] text-orange-300/70 uppercase tracking-[0.2em]">Fragments</div>
          <div className="text-sm font-mono text-orange-300">{fragmentsCollected}</div>
        </div>
        <div className="bg-black/55 backdrop-blur-sm border border-green-400/30 rounded-lg px-4 py-2">
          <div className="text-[10px] text-green-300/70 uppercase tracking-[0.2em]">Nodes Repaired</div>
          <div className="text-sm font-mono text-green-300">{nodesRepaired}</div>
        </div>
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 border border-cyan-400/40 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-cyan-300/50 font-mono tracking-wider text-center">
        W/S Fwd·Back &nbsp; A/D Strafe &nbsp; Space Up &nbsp; Ctrl Down &nbsp; Shift Boost <br/>
        <span className="text-cyan-200/70">E Scan &nbsp; F Interact &nbsp; Tab Archive &nbsp; ` Debug</span>
      </div>
    </div>
  );
};


export default HUD;