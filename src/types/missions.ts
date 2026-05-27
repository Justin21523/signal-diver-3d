export type MissionStatus = 'idle' | 'active' | 'completed' | 'failed';

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: MissionStatus;
  conditionType: 'depth' | 'fragments' | 'nodes' | 'zone';
  threshold: number;
  reward?: string;
}

export interface EventNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
}