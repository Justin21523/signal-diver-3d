type EventCallback = (...args: unknown[]) => void;

/**
 * Global Event Bus for decoupled communication between systems.
 * Prevents circular dependencies and allows easy plugin integration.
 */
class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, ...args: unknown[]) {
    this.listeners.get(event)?.forEach(cb => {
      try { cb(...args); } catch (e) { console.error(`EventBus error in ${event}:`, e); }
    });
  }
}

export const eventBus = new EventBus();

export const GameEvents = {
  FRAGMENT_COLLECTED: 'fragment:collected',
  NODE_REPAIRED: 'node:repaired',
  SCAN_TRIGGERED: 'scan:triggered',
  PUZZLE_STARTED: 'puzzle:started',
  PUZZLE_COMPLETED: 'puzzle:completed',
  ZONE_CHANGED: 'zone:changed',
  PLAYER_MOVED: 'player:moved',
} as const;