import { create } from 'zustand';
import { generateWorld } from '../data/WorldGenerator';
import type { ActivePuzzle, DataFragmentData, GameState, InteractableTarget, Objective, SignalNodeData, ZoneType } from '../types';
import { saveGame, saveToSlot, type SaveData } from '../utils/saveSystem';
import { useCinematicStore } from './useCinematicStore';

// Generate initial world deterministically
const INITIAL_WORLD = generateWorld('SIGNAL_DIVER_V1');
interface GameStore {
  gameState: GameState;
  currentZone: ZoneType;
  signalStrength: number;
  currentObjective: Objective;
  currentSlotId: string | null;

  nodes: SignalNodeData[];
  fragments: DataFragmentData[];
  nearestInteractable: InteractableTarget | null;
  activePuzzle: ActivePuzzle | null;
  isScanning: boolean;
  isArchiveOpen: boolean;

  sourceRepaired: boolean;
  repairSource: () => void;
  setGameState: (state: GameState) => void;
  setCurrentZone: (zone: ZoneType) => void;
  setSignalStrength: (strength: number) => void;
  setObjective: (objective: Objective) => void;
  setCurrentSlotId: (slotId: string | null) => void;
  initializeGame: (saveData: SaveData | null) => void;

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
  currentSlotId: null,

  nodes: INITIAL_WORLD.nodes,
  fragments: INITIAL_WORLD.fragments,
  nearestInteractable: null,
  activePuzzle: null,
  isScanning: false,
  isArchiveOpen: false,
  sourceRepaired: false,
  setGameState: (gameState) => set({ gameState }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  setSignalStrength: (signalStrength) => set({ signalStrength }),
  setObjective: (currentObjective) => set({ currentObjective }),
  setCurrentSlotId: (slotId) => set({ currentSlotId: slotId }),

  initializeGame: (saveData) => {
    set((state) => {
      const updatedFragments = state.fragments.map(f => ({
        ...f,
        collected: saveData?.fragmentsCollected?.includes(f.id) ?? false,
      }));
      const updatedNodes = state.nodes.map(n => ({
        ...n,
        repaired: saveData?.nodesRepaired?.includes(n.id) ?? false,
        integrity: saveData?.nodesRepaired?.includes(n.id) ? 1 : n.integrity,
      }));
      return {
        fragments: updatedFragments,
        nodes: updatedNodes,
        currentSlotId: saveData?.slotId ?? state.currentSlotId,
      };
    });
  },

  setNearestInteractable: (nearestInteractable) => set({ nearestInteractable }),

  collectFragment: (id) => {
    set((state) => ({
      fragments: state.fragments.map(f => f.id === id ? { ...f, collected: true } : f)
    }));
    const { fragments, nodes } = get();
    saveGame(fragments, nodes);
  },

  repairNode: (id) => {
    set((state) => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, repaired: true, integrity: 1 } : n)
    }));
    const { fragments, nodes } = get();
    saveGame(fragments, nodes);
  },

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
  repairSource: () => {
    set({ sourceRepaired: true, gameState: 'cinematic' });
    useCinematicStore.getState().startCinematic();
    saveToSlot(get().currentSlotId ?? 'default', get().fragments, get().nodes, true);
  },
}));
