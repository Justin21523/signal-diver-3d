import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';
import { useUIStore } from '../../store/useUIStore';
import { useDebugStore } from '../../store/useDebugStore';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-green-400/70">{label}</span>
    <span className="text-green-200">{value}</span>
  </div>
);

const DebugPanel = () => {
  const position = usePlayerStore((s) => s.position);
  const velocity = usePlayerStore((s) => s.velocity);
  const speed = usePlayerStore((s) => s.speed);

  const currentZone = useGameStore((s) => s.currentZone);

  const isDebugVisible = useUIStore((s) => s.isDebugVisible);
  const toggleDebug = useUIStore((s) => s.toggleDebug);

  const fps = useDebugStore((s) => s.fps);
  const setFps = useDebugStore((s) => s.setFps);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Independent FPS counter (does not depend on R3F frame loop)
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      frameCountRef.current += 1;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [setFps]);

  // Toggle with backtick key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Backquote') {
        toggleDebug();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleDebug]);

  if (!isDebugVisible) {
    return (
      <div className="absolute top-2 left-2 text-[10px] text-cyan-400/40 font-mono">
        Press ` to show debug
      </div>
    );
  }

  return (
    <div className="absolute top-24 left-6 bg-black/75 backdrop-blur-sm border border-green-400/40 rounded-lg px-4 py-3 font-mono text-[11px] text-green-300 min-w-[280px]">
      <div className="text-green-400 font-bold mb-2 uppercase tracking-[0.2em] text-[10px]">
        Debug Panel{' '}
        <span className="text-green-300/50 font-normal">(press ` to hide)</span>
      </div>
      <div className="space-y-1">
        <Row
          label="FPS"
          value={fps.toString()}
        />
        <Row
          label="Position"
          value={`${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`}
        />
        <Row
          label="Velocity"
          value={`${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}`}
        />
        <Row label="Speed" value={speed.toFixed(2)} />
        <Row label="Zone" value={currentZone.toUpperCase()} />
      </div>
      {/* Color the FPS value based on performance */}
      <style>{`
        .debug-fps-warn { color: #f87171; }
      `}</style>
    </div>
  );
};

export default DebugPanel;