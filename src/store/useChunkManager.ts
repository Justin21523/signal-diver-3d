import { create } from 'zustand';
import type { Vector3 } from '../types';

const CHUNK_SIZE = 150;
const RENDER_RADIUS = 2; // chunks

interface ChunkStore {
  playerPos: Vector3;
  activeChunks: Set<string>;
  updatePlayerPos: (pos: Vector3) => void;
  isChunkActive: (chunkKey: string) => boolean;
}

export const useChunkManager = create<ChunkStore>((set, get) => ({
  playerPos: { x: 0, y: 0, z: 0 },
  activeChunks: new Set(['0:0']),
  updatePlayerPos: (pos) => {
    set({ playerPos: pos });
    const cx = Math.round(pos.x / CHUNK_SIZE);
    const cz = Math.round(pos.z / CHUNK_SIZE);
    const newActive = new Set<string>();
    for (let x = cx - RENDER_RADIUS; x <= cx + RENDER_RADIUS; x++) {
      for (let z = cz - RENDER_RADIUS; z <= cz + RENDER_RADIUS; z++) {
        newActive.add(`${x}:${z}`);
      }
    }
    set({ activeChunks: newActive });
  },
  isChunkActive: (key) => get().activeChunks.has(key),
}));