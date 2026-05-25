import { create } from 'zustand';
import type { GameState, ZoneType, Objective, SignalNodeData, DataFragmentData, InteractableTarget, ActivePuzzle } from '../types';
import { INITIAL_NODES, INITIAL_FRAGMENTS } from '../data/initialWorldData';

interface GameStore {
  gameState: GameState;
  currentZone: ZoneType;
  signalStrength: number;
  currentObjective: Objective;
  
  nodes: SignalNodeData[];
  fragments: DataFragmentData[];
  nearestInteractable: InteractableTarget | null;
  activePuzzle: ActivePuzzle | null;
  isScanning: boolean;
  isArchiveOpen: boolean;
  
  setGameState: (state: GameState) => void;
  setCurrentZone: (zone: ZoneType) => void;
  setSignalStrength: (strength: number) => void;
  setObjective: (objective: Objective) => void;
  
  setNearestInteractable: (target: InteractableTarget | null) => void;
  collectFragment: (id: string) => void;
  repairNode: (id: string) => void;
  
  triggerScan: () => void;
  endScan: () => void;
  
  startPuzzle: (puzzle: ActivePuzzle) => void;
  completePuzzle: (success: boolean) => void;
  
  toggleArchive: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'playing',
  currentZone: 'shallow',
  signalStrength: 0.72,
  currentObjective: {
    id: 'obj-001',
    title: 'Locate the First Signal Node',
    description: 'Navigate toward the pulsing cyan beacon and press F to repair it.',
    completed: false,
  },
  
  nodes: INITIAL_NODES,
  fragments: INITIAL_FRAGMENTS,
  nearestInteractable: null,
  activePuzzle: null,
  isScanning: false,
  isArchiveOpen: false,

  setGameState: (gameState) => set({ gameState }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  setSignalStrength: (signalStrength) => set({ signalStrength }),
  setObjective: (currentObjective) => set({ currentObjective }),
  
  setNearestInteractable: (nearestInteractable) => set({ nearestInteractable }),
  
  collectFragment: (id) => set((state) => ({
    fragments: state.fragments.map(f => f.id === id ? { ...f, collected: true } : f)
  })),
  
  repairNode: (id) => set((state) => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, repaired: true, integrity: 1 } : n)
  })), 

  triggerScan: () => set({ isScanning: true }),
  endScan: () => set({ isScanning: false }),
  
  startPuzzle: (activePuzzle) => set({ activePuzzle, gameState: 'puzzle' }),
  completePuzzle: (success) => {
    const { activePuzzle } = get();
    if (success && activePuzzle) {
      get().repairNode(activePuzzle.targetId);
    }
    set({ activePuzzle: null, gameState: 'playing' });
  },
  
  toggleArchive: () => set((s) => ({ isArchiveOpen: !s.isArchiveOpen })),
}));
