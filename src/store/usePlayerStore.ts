import { create } from 'zustand';
import type { Vector3 } from '../types';

interface PlayerStore {
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
  speed: number;
  depth: number;
  isBoosting: boolean;
  setPosition: (pos: Vector3) => void;
  setVelocity: (vel: Vector3) => void;
  setRotation: (rot: Vector3) => void;
  setIsBoosting: (boosting: boolean) => void;
  reset: () => void;
}

const initialState = {
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  speed: 0,
  depth: 0,
  isBoosting: false,
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  ...initialState,
  setPosition: (position) =>
    set({
      position,
      // Depth is reported as positive number going downward (y axis is up)
      depth: Math.max(0, -position.y),
    }),
  setVelocity: (velocity) => {
    const speed = Math.sqrt(
      velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z
    );
    set({ velocity, speed });
  },
  setRotation: (rotation) => set({ rotation }),
  setIsBoosting: (isBoosting) => set({ isBoosting }),
  reset: () => set(initialState),
}));