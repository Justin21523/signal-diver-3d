export interface ThreatState {
  level: number; // 0 to 100
  maxLevel: number;
  isHunted: boolean;
  addThreat: (amount: number) => void;
  decayThreat: (amount: number) => void;
  resetThreat: () => void;
}