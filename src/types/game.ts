import type { Vector3 } from './player';

export type GameState = 'menu' | 'loading' | 'playing' | 'paused' | 'puzzle' | 'cinematic' | 'ending';
export type ZoneType = 'shallow' | 'mid' | 'deep' | 'abyss' | 'anomaly';

export interface Objective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface SignalNodeData {
  id: string;
  position: Vector3;
  integrity: number; 
  repaired: boolean;
  frequency: number; 
}

export interface DataFragmentData {
  id: string;
  position: Vector3;
  collected: boolean;
  title: string;
  content: string;
}

export interface InteractableTarget {
  type: 'node' | 'fragment';
  id: string;
}

export interface ActivePuzzle {
  type: 'sequence_sync' | 'frequency_match'; // Phase 2 uses sequence_sync
  targetId: string;
}