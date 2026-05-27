import type { DataFragmentData, SignalNodeData } from '../types';

const STORAGE_KEY = 'signal-diver-save-v1';

export interface SaveData {
  fragmentsCollected: string[];
  nodesRepaired: string[];
  sourceRepaired: boolean;
  timestamp: number;
}

export interface SaveSlot {
  id: number;
  data: SaveData | null;
}

const SLOT_KEYS = [
  'signal-diver-save-slot-1',
  'signal-diver-save-slot-2',
  'signal-diver-save-slot-3',
  'signal-diver-save-slot-4',
  'signal-diver-save-slot-5',
  'signal-diver-save-slot-6',
];

export const getSaveSlots = (): SaveSlot[] => {
  return SLOT_KEYS.map((key, index) => {
    try {
      const raw = localStorage.getItem(key);
      return { id: index + 1, data: raw ? JSON.parse(raw) : null };
    } catch {
      return { id: index + 1, data: null };
    }
  });
};

export const saveToSlot = (slotId: number, fragments: DataFragmentData[], nodes: SignalNodeData[], sourceRepaired: boolean) => {
  const key = SLOT_KEYS[slotId - 1];
  if (!key) return;
  const data: SaveData = {
    fragmentsCollected: fragments.filter(f => f.collected).map(f => f.id),
    nodesRepaired: nodes.filter(n => n.repaired).map(n => n.id),
    sourceRepaired,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromSlot = (slotId: number): SaveData | null => {
  const key = SLOT_KEYS[slotId - 1];
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveGame = (fragments: DataFragmentData[], nodes: SignalNodeData[]) => {
  const data: SaveData = {
    fragmentsCollected: fragments.filter(f => f.collected).map(f => f.id),
    nodesRepaired: nodes.filter(n => n.repaired).map(n => n.id),
    sourceRepaired: false, // Initialize to false, update as needed
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Save system: localStorage write failed', e);
  }
};

export const deleteSlot = (slotId: number) => {
  const key = SLOT_KEYS[slotId - 1];
  if (key) localStorage.removeItem(key);
};

export const loadGame = (): SaveData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch (e) {
    console.warn('Save system: localStorage read failed', e);
    return null;
  }
};

export const clearSave = () => {
  localStorage.removeItem(STORAGE_KEY);
};