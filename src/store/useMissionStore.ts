import { create } from 'zustand';
import type { Mission, EventNotification, MissionStatus } from '../types/missions';

interface MissionStore {
  missions: Mission[];
  notifications: EventNotification[];
  addMission: (mission: Mission) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  pushNotification: (notif: Omit<EventNotification, 'id'>) => void;
  clearNotification: (id: string) => void;
  checkMissions: (depth: number, fragments: number, nodes: number) => void;
}

const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Surface Drop', description: 'Reach 20m depth to calibrate sonar.', status: 'active', conditionType: 'depth', threshold: 20 },
  { id: 'm2', title: 'Signal Recovery', description: 'Collect 3 Data Fragments.', status: 'idle', conditionType: 'fragments', threshold: 3, reward: 'Unlock Archive Tier 2' },
  { id: 'm3', title: 'Node Stabilization', description: 'Repair 2 Signal Nodes.', status: 'idle', conditionType: 'nodes', threshold: 2, reward: 'Increase Max Depth' },
];

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: INITIAL_MISSIONS,
  notifications: [],
  addMission: (mission) => set((s) => ({ missions: [...s.missions, mission] })),
  updateMissionStatus: (id, status) => {
    set((s) => ({ missions: s.missions.map(m => m.id === id ? { ...m, status } : m) }));
  },
  pushNotification: (notif) => {
    const id = `n_${Date.now()}`;
    set((s) => ({ notifications: [...s.notifications, { ...notif, id }] }));
    if (notif.duration > 0) {
      setTimeout(() => get().clearNotification(id), notif.duration);
    }
  },
  clearNotification: (id) => {
    set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) }));
  },
  checkMissions: (depth, fragments, nodes) => {
    const { missions } = get();
    for (const m of missions) {
      if (m.status === 'completed') continue;
      let met = false;
      if (m.conditionType === 'depth') met = depth >= m.threshold;
      else if (m.conditionType === 'fragments') met = fragments >= m.threshold;
      else if (m.conditionType === 'nodes') met = nodes >= m.threshold;
      if (met) {
        get().updateMissionStatus(m.id, 'completed');
        get().pushNotification({ message: `Mission complete: ${m.title}`, type: 'success', duration: 4000 });
      }
    }
  },
}));
