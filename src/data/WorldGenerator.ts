import { SeededRNG } from '../utils/rng';
import type { SignalNodeData, DataFragmentData } from '../types';

const LORE_SNIPPETS = [
  'The deep currents carry echoes of the old network.',
  'Signal degradation detected in sector 7G.',
  'We thought the AI would maintain the structure forever.',
  'Static began appearing. It had a pattern, a heartbeat.',
  'The abyss is swallowing the network node by node.',
];

export const generateWorld = (seed: string | number = 'SIGNAL_DIVER_V1') => {
  const rng = new SeededRNG(seed);
  
  const nodes: SignalNodeData[] = Array.from({ length: 8 }, (_, i) => ({
    id: `node-gen-${i}`,
    position: {
      x: rng.range(-140, 140),
      y: rng.range(-110, -15),
      z: rng.range(-140, 140),
    },
    integrity: rng.range(0.1, 0.4),
    repaired: false,
    frequency: rng.int(300, 600),
  }));

  const fragments: DataFragmentData[] = Array.from({ length: 20 }, (_, i) => ({
    id: `frag-gen-${i}`,
    position: {
      x: rng.range(-160, 160),
      y: rng.range(-115, -5),
      z: rng.range(-160, 160),
    },
    collected: false,
    title: `Recovered Log ${String(i + 1).padStart(2, '0')}`,
    content: `Automated transcript ${i + 1}. ${LORE_SNIPPETS[rng.int(0, LORE_SNIPPETS.length)]} Signal loss at ${rng.int(40, 99)}%.`,
  }));

  return { nodes, fragments };
};