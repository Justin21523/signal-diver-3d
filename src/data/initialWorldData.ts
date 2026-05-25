import type { SignalNodeData, DataFragmentData } from '../types';

export const INITIAL_NODES: SignalNodeData[] = [
  { id: 'node-1', position: { x: 18, y: 2, z: -22 }, integrity: 0.3, repaired: false, frequency: 432 },
  { id: 'node-2', position: { x: -28, y: -25, z: -42 }, integrity: 0.1, repaired: false, frequency: 528 },
  { id: 'node-3', position: { x: 32, y: -60, z: 28 }, integrity: 0.5, repaired: false, frequency: 396 },
];

export const INITIAL_FRAGMENTS: DataFragmentData[] = [
  { id: 'frag-1', position: { x: 6, y: 1, z: -9 }, collected: false, title: 'Log 01: Initialization', content: 'The ocean of data was calm before the fragmentation event. We thought the AI would maintain the structure forever.' },
  { id: 'frag-2', position: { x: -11, y: -15, z: -16 }, collected: false, title: 'Log 02: The First Noise', content: 'Static began appearing in the deep sectors. It wasn\'t random; it had a pattern, a heartbeat of corrupted memory.' },
  { id: 'frag-3', position: { x: 20, y: -35, z: 12 }, collected: false, title: 'Log 03: Signal Loss', content: 'Node 7 went offline today. The divers couldn\'t reach it in time. The abyss is swallowing the network.' },
  { id: 'frag-4', position: { x: -9, y: -55, z: 6 }, collected: false, title: 'Log 04: Echoes', content: 'I hear them in the sonar. Not just data packets, but voices. The AI is trying to tell us something before it drowns.' },
  { id: 'frag-5', position: { x: 2, y: -80, z: -30 }, collected: false, title: 'Log 05: The Core', content: 'If you are reading this, the surface is already gone. Dive deeper. Find the Source Node. Fix the frequency.' },
];