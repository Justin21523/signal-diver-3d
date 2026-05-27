import { create } from 'zustand';

interface AudioStore {
  context: AudioContext | null;
  isMuted: boolean;
  isInitialized: boolean;
  initAudio: () => void;
  toggleMute: () => void;
  playTone: (frequency: number, duration: number, type?: OscillatorType) => void;
  playCollect: () => void;
  playScan: () => void;
  playRepair: () => void;
  playError: () => void;
  updateMixing: (depth: number, threatLevel: number) => void;
}

let ctx: AudioContext | null = null;
let droneNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
let baseOsc: OscillatorNode, baseGain: GainNode;
let deepOsc: OscillatorNode, deepGain: GainNode;
let threatOsc: OscillatorNode, threatGain: GainNode;

export const useAudioStore = create<AudioStore>((set, get) => ({
  context: null,
  isMuted: false,
  isInitialized: false,
  initAudio: () => {
    if (get().isInitialized) return;
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx!();
      set({ context: ctx, isInitialized: true });
      startDrone(ctx);
      startDynamicAudio(ctx);
    }
    if (ctx.state === 'suspended') ctx.resume();
  },
  toggleMute: () => {
    const muted = !get().isMuted;
    set({ isMuted: muted });
    if (droneNodes) {
      droneNodes.gain.gain.setValueAtTime(muted ? 0 : 0.06, ctx!.currentTime);
    }
  },
  playTone: (freq, dur, type = 'sine') => {
    if (get().isMuted || !ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  },
  playCollect: () => {
    get().playTone(880, 0.15, 'sine');
    setTimeout(() => get().playTone(1100, 0.12, 'triangle'), 80);
  },
  playScan: () => {
    get().playTone(350, 0.3, 'sawtooth');
    setTimeout(() => get().playTone(500, 0.25, 'square'), 120);
  },
  playRepair: () => get().playTone(528, 0.8, 'sine'),
  playError: () => get().playTone(180, 0.25, 'sawtooth'),
  // Add a new method to the store to update mixing:
  updateMixing: (depth: number, threatLevel: number) => {
    if (!ctx || get().isMuted) return;
    const t = ctx.currentTime;
    
    // Deep audio fades in after 50m
    const deepVol = Math.max(0, Math.min(0.06, (depth - 50) / 100 * 0.06));
    deepGain.gain.linearRampToValueAtTime(deepVol, t + 0.1);
    
    // Threat audio fades in when threat > 40
    const threatVol = Math.max(0, Math.min(0.08, (threatLevel - 40) / 60 * 0.08));
    threatGain.gain.linearRampToValueAtTime(threatVol, t + 0.1);
    
    // Base audio ducks slightly when threat is high
    const baseVol = 0.05 - (threatVol * 0.5);
    baseGain.gain.linearRampToValueAtTime(baseVol, t + 0.1);
  },
}));

function startDrone(audioCtx: AudioContext) {
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 48;
  osc2.type = 'triangle';
  osc2.frequency.value = 51.5;
  gain.gain.value = 0.06;
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  osc1.start();
  osc2.start();
  droneNodes = { osc1, osc2, gain };
}

function startDynamicAudio(audioCtx: AudioContext) {
  // 1. Base Ambient (Shallow/Mid)
  baseOsc = audioCtx.createOscillator();
  baseGain = audioCtx.createGain();
  baseOsc.type = 'sine';
  baseOsc.frequency.value = 48;
  baseGain.gain.value = 0.05;
  baseOsc.connect(baseGain).connect(audioCtx.destination);
  baseOsc.start();

  // 2. Deep Ambient (Abyss)
  deepOsc = audioCtx.createOscillator();
  deepGain = audioCtx.createGain();
  deepOsc.type = 'triangle';
  deepOsc.frequency.value = 32;
  deepGain.gain.value = 0; // Starts silent
  deepOsc.connect(deepGain).connect(audioCtx.destination);
  deepOsc.start();

  // 3. Threat Drone (Hunted)
  threatOsc = audioCtx.createOscillator();
  threatGain = audioCtx.createGain();
  threatOsc.type = 'sawtooth';
  threatOsc.frequency.value = 65;
  threatGain.gain.value = 0; // Starts silent
  threatOsc.connect(threatGain).connect(audioCtx.destination);
  threatOsc.start();
}