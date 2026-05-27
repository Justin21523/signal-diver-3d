import { create } from 'zustand';
import { eventBus, GameEvents } from '../utils/eventBus';

export interface TelemetryEvent {
  t: number;
  type: string;
  data?: Record<string, unknown>;
}

interface TelemetryStore {
  sessionId: string;
  startTime: number;
  events: TelemetryEvent[];
  distanceTraveled: number;
  scanCount: number;
  puzzlesSolved: number;
  
  logEvent: (type: string, data?: Record<string, unknown>) => void;
  addDistance: (d: number) => void;
  exportData: () => void;
  initListeners: () => void;
}

export const useTelemetryStore = create<TelemetryStore>((set, get) => ({
  sessionId: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  startTime: Date.now(),
  events: [],
  distanceTraveled: 0,
  scanCount: 0,
  puzzlesSolved: 0,

  logEvent: (type, data) => set((s) => ({
    events: [...s.events, { t: Date.now() - s.startTime, type, data }]
  })),
  
  addDistance: (d) => set((s) => ({ distanceTraveled: s.distanceTraveled + d })),

  exportData: () => {
    const state = get();
    const payload = {
      sessionId: state.sessionId,
      exportTime: new Date().toISOString(),
      durationMs: Date.now() - state.startTime,
      summary: {
        distanceTraveled: parseFloat(state.distanceTraveled.toFixed(2)),
        scanCount: state.scanCount,
        puzzlesSolved: state.puzzlesSolved,
        totalEvents: state.events.length,
      },
      timeline: state.events,
    };
    
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-diver-telemetry-${state.sessionId}.json`;
    document.body.appendChild(a);
    // Trigger the download and clean up
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  initListeners: () => {
    // Subscribe to global game events without coupling to specific stores
    eventBus.on(GameEvents.SCAN_TRIGGERED, () => {
      set((s) => ({ scanCount: s.scanCount + 1 }));
      get().logEvent('scan');
    });
    
    eventBus.on(GameEvents.FRAGMENT_COLLECTED, (id) => {
      get().logEvent('collect_fragment', { id });
    });
    
    eventBus.on(GameEvents.PUZZLE_COMPLETED, (success) => {
      if (success) set((s) => ({ puzzlesSolved: s.puzzlesSolved + 1 }));
      get().logEvent('puzzle_end', { success });
    });

    eventBus.on(GameEvents.ZONE_CHANGED, (zone) => {
      get().logEvent('zone_enter', { zone });
    });
  }
}));