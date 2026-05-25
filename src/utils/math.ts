import type { Vector3 } from '../types';

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const vec3Length = (v: Vector3): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

export const shortestAngleDelta = (from: number, to: number): number => {
  let delta = ((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  return delta;
};