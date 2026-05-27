import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSettingsStore } from '../../store/useSettingsStore';

let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
const frameTimes: number[] = [];

const PerformanceOverlay = () => {
  const [stats, setStats] = useState({ fps: 0, minFrameTime: 0, maxFrameTime: 0, avgFrameTime: 0 });
  const show = useSettingsStore((s) => s.showPerformanceOverlay);

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTime;
    frameCount++;
    frameTimes.push(delta);
    if (frameTimes.length > 60) frameTimes.shift();

    if (frameCount % 15 === 0) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      const min = Math.min(...frameTimes);
      const max = Math.max(...frameTimes);
      const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      setStats({ fps, minFrameTime: min, maxFrameTime: max, avgFrameTime: avg });
      frameCount = 0;
      lastTime = now;
    }
  });

  if (!show) return null;

  return (
    <div className="absolute bottom-24 right-2 bg-black/85 border border-green-500/40 rounded px-3 py-2 font-mono text-[10px] text-green-300 pointer-events-none select-none">
      <div>FPS: <span className="text-white">{stats.fps}</span></div>
      <div>Frame Time: <span className="text-white">{stats.avgFrameTime.toFixed(2)}ms</span></div>
      <div className="text-gray-400">Min: {stats.minFrameTime.toFixed(1)}ms | Max: {stats.maxFrameTime.toFixed(1)}ms</div>
      <div className="text-yellow-300 mt-1">{stats.fps < 45 ? '⚠ LOW PERFORMANCE' : stats.fps > 58 ? '● OPTIMAL' : '● STABLE'}</div>
    </div>
  );
};

export default PerformanceOverlay;