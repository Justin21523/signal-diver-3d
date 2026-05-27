import { useRef, useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';

const RADAR_RADIUS = 75;
const MAX_RANGE = 110;

const Radar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    let lastDraw = 0;

    const drawRadar = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const now = performance.now();
      if (now - lastDraw < 33) {
        animFrame.current = requestAnimationFrame(drawRadar);
        return;
      }
      lastDraw = now;

      const playerPos = usePlayerStore.getState().position;
      const playerRot = usePlayerStore.getState().rotation;
      const nodes = useGameStore.getState().nodes;
      const fragments = useGameStore.getState().fragments;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, RADAR_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, RADAR_RADIUS * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      const t = performance.now() / 1000;
      const sweepAngle = t % (Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(
        canvas.width / 2 + Math.cos(sweepAngle) * RADAR_RADIUS,
        canvas.height / 2 + Math.sin(sweepAngle) * RADAR_RADIUS
      );
      ctx.stroke();

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-playerRot.y);

      const toLocal = (wx: number, wz: number) => {
        const dx = wx - playerPos.x;
        const dz = wz - playerPos.z;
        return { x: dx, y: dz, dist: Math.sqrt(dx * dx + dz * dz) };
      };

      for (const node of nodes) {
        const { x, y, dist } = toLocal(node.position.x, node.position.z);
        if (dist > MAX_RANGE) continue;
        const rx = (x / MAX_RANGE) * RADAR_RADIUS;
        const ry = (y / MAX_RANGE) * RADAR_RADIUS;
        ctx.fillStyle = node.repaired ? '#4ade80' : '#2dd4bf';
        ctx.beginPath();
        ctx.arc(rx, ry, node.repaired ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const frag of fragments) {
        if (frag.collected) continue;
        const { x, y, dist } = toLocal(frag.position.x, frag.position.z);
        if (dist > MAX_RANGE) continue;
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.arc((x / MAX_RANGE) * RADAR_RADIUS, (y / MAX_RANGE) * RADAR_RADIUS, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2 - 4);
      ctx.lineTo(canvas.width / 2, canvas.height / 2 - 8);
      ctx.stroke();

      animFrame.current = requestAnimationFrame(drawRadar);
    };

    animFrame.current = requestAnimationFrame(drawRadar);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-full p-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
        <canvas ref={canvasRef} width={RADAR_RADIUS * 2 + 6} height={RADAR_RADIUS * 2 + 6} className="rounded-full" />
      </div>
      <div className="text-center text-[9px] text-cyan-400/60 font-mono mt-1 uppercase tracking-widest select-none">Sonar</div>
    </div>
  );
};

export default Radar;
