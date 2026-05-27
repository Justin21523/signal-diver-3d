import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils, Vector3 as ThreeVector3 } from 'three';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useAudioStore } from '../../store/useAudioStore';
import { useChunkManager } from '../../store/useChunkManager';
import { useGameStore } from '../../store/useGameStore';
import { useMissionStore } from '../../store/useMissionStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import type { InteractableTarget, ZoneType } from '../../types';
import { INTERACTION_CONFIG, PLAYER_CONFIG, ZONE_THRESHOLDS } from '../../utils/constants';
import { clamp, shortestAngleDelta } from '../../utils/math';
import { mouseInput } from '../../utils/mouseInput';
import FollowCamera from '../camera/FollowCamera';
import Submarine from './Submarine';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useThreatStore } from '../../store/useThreatStore';


const PlayerController = () => {
  const groupRef = useRef<Group>(null);
  const velocityRef = useRef(new ThreeVector3(0, 0, 0));
  const tempVec = useRef(new ThreeVector3(0, 0, 0));

  const { getInput } = useKeyboard();

  // Player Store
  const setPosition = usePlayerStore((s) => s.setPosition);
  const setVelocity = usePlayerStore((s) => s.setVelocity);
  const setRotation = usePlayerStore((s) => s.setRotation);
  const setIsBoosting = usePlayerStore((s) => s.setIsBoosting);

  // Game Store
  const fragments = useGameStore((s) => s.fragments);
  const nodes = useGameStore((s) => s.nodes);
  const currentZone = useGameStore((s) => s.currentZone);
  const gameState = useGameStore((s) => s.gameState);

  const setCurrentZone = useGameStore((s) => s.setCurrentZone);
  const setNearestInteractable = useGameStore((s) => s.setNearestInteractable);
  const collectFragment = useGameStore((s) => s.collectFragment);
  const triggerScan = useGameStore((s) => s.triggerScan);
  const startPuzzle = useGameStore((s) => s.startPuzzle);
  const toggleArchive = useGameStore((s) => s.toggleArchive);

  const lastStoreUpdateRef = useRef(0);
  const STORE_UPDATE_INTERVAL_MS = 80;
  const scanCooldownRef = useRef(0);

  const updateChunkPos = useChunkManager((s) => s.updatePlayerPos);
  const checkMissions = useMissionStore((s) => s.checkMissions);

  // Track key presses for single-press actions
  const prevInputRef = useRef({ scan: false, interact: false, archive: false, mute: false });

  // 在 PlayerController 裡加入一個 ref 來存放平滑後的輸入向量
  const smoothInputRef = useRef({ x: 0, y: 0, z: 0 });
  
  const addDistance = useTelemetryStore((s) => s.addDistance);
  const prevPosRef = useRef(new ThreeVector3(0, 0, 0));
  
  const addThreat = useThreatStore((s) => s.addThreat);
  const decayThreat = useThreatStore((s) => s.decayThreat);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.1);
    const input = getInput();

    // Pause movement if in puzzle or archive
    const canMove = gameState === 'playing';
    const now = performance.now();

    if (canMove) {
      const velocity = velocityRef.current;
      const config = PLAYER_CONFIG;
      const speedMultiplier = input.boost ? config.boostMultiplier : 1.0;

      // Smooth input: lerp raw key input to avoid instant direction change
      const rawInput = {
        x: (input.right ? 1 : 0) - (input.left ? 1 : 0),
        y: (input.up ? 1 : 0) - (input.down ? 1 : 0),
        z: (input.forward ? 1 : 0) - (input.backward ? 1 : 0),
      };

      const smoothing = 4;
      const si = smoothInputRef.current;
      si.x += (rawInput.x - si.x) * Math.min(1, smoothing * dt);
      si.y += (rawInput.y - si.y) * Math.min(1, smoothing * dt);
      si.z += (rawInput.z - si.z) * Math.min(1, smoothing * dt);

      const accel = config.acceleration * speedMultiplier * dt;
      const yaw = mouseInput.yaw;
      const sinYaw = Math.sin(yaw);
      const cosYaw = Math.cos(yaw);
      // Camera-relative movement: W/S follow camera heading, A/D strafe perpendicular
      velocity.x += (-sinYaw * si.z + cosYaw * si.x) * accel;
      velocity.z += (-cosYaw * si.z - sinYaw * si.x) * accel;
      // Vertical: explicit up/down keys + pitch-based diving when moving forward
      velocity.y += (si.y - Math.sin(mouseInput.pitch) * si.z * 0.6) * accel;

      const dragFactor = 1 - Math.min(1, config.drag * dt);
      velocity.multiplyScalar(dragFactor);

      const currentSpeed = velocity.length();
      const maxAllowed = config.maxSpeed * speedMultiplier;
      if (currentSpeed > maxAllowed) {
        velocity.multiplyScalar(maxAllowed / currentSpeed);
      }

      group.position.x += velocity.x * dt;
      group.position.y += velocity.y * dt;
      group.position.z += velocity.z * dt;

      group.position.x = clamp(group.position.x, -config.bounds.x, config.bounds.x);
      group.position.y = clamp(group.position.y, -config.bounds.y, config.bounds.y);
      group.position.z = clamp(group.position.z, -config.bounds.z, config.bounds.z);

      // Yaw: turn toward velocity direction, only when moving fast enough
      const horizontalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
      if (horizontalSpeed > 0.2) {
        const targetYaw = Math.atan2(velocity.x, velocity.z);
        const deltaAngle = shortestAngleDelta(group.rotation.y, targetYaw);
        group.rotation.y += deltaAngle * Math.min(1, dt * config.rotationSpeed);
      }

      // Pitch and roll follow velocity gradually
      const targetPitch = MathUtils.clamp(-velocity.y * 0.04, -0.35, 0.35);
      group.rotation.x = MathUtils.lerp(group.rotation.x, targetPitch, dt * config.rotationSpeed * 0.8);

      const targetRoll = MathUtils.clamp(-velocity.x * 0.018, -0.28, 0.28);
      group.rotation.z = MathUtils.lerp(group.rotation.z, targetRoll, dt * config.rotationSpeed * 0.8);
    } else {
      // Freeze velocity when not playing
      velocityRef.current.set(0, 0, 0);
    }

    if (now - lastStoreUpdateRef.current > STORE_UPDATE_INTERVAL_MS) {
      // ... existing store updates ...
      updateChunkPos({ x: group.position.x, y: group.position.y, z: group.position.z });

      // Mission check
      const depth = -group.position.y;
      const fragsCollected = fragments.filter(f => f.collected).length;
      const nodesRepaired = nodes.filter(n => n.repaired).length;
      checkMissions(depth, fragsCollected, nodesRepaired);
    }
    // Calculate distance traveled for telemetry
    const distDelta = group.position.distanceTo(prevPosRef.current);
    if (distDelta > 0.01) {
      addDistance(distDelta);
      prevPosRef.current.copy(group.position);
    }
    // --- Interactions & Logic (Runs even if paused for UI toggles) ---
    if (input.mute && !prevInputRef.current.mute) {
      useAudioStore.getState().toggleMute();
    }
    prevInputRef.current.mute = input.mute;
    // 1. Zone Detection
    const y = group.position.y;
    let newZone: ZoneType = 'shallow';
    if (y < ZONE_THRESHOLDS.abyss) newZone = 'abyss';
    else if (y < ZONE_THRESHOLDS.deep) newZone = 'deep';
    else if (y < ZONE_THRESHOLDS.mid) newZone = 'mid';

    if (newZone !== currentZone) {
      setCurrentZone(newZone);
    }

    // 2. Proximity Checks (Fragments & Nodes)
    let nearest: InteractableTarget | null = null;
    let minNodeDist = INTERACTION_CONFIG.nodeRadius;

    for (const frag of fragments) {
      if (frag.collected) continue;
      tempVec.current.set(frag.position.x, frag.position.y, frag.position.z);
      const dist = group.position.distanceTo(tempVec.current);
      if (dist < INTERACTION_CONFIG.fragmentRadius) {
        collectFragment(frag.id);
      }
    }

    // get nearest node for potential interaction (but don't auto-collect)
    for (const node of nodes) {
      if (node.repaired) continue;
      tempVec.current.set(node.position.x, node.position.y, node.position.z);
      const dist = group.position.distanceTo(tempVec.current);
      if (dist < minNodeDist) {
        minNodeDist = dist;
        nearest = { type: 'node', id: node.id };
      }
    }

    // Only update store if changed to avoid unnecessary renders
    const currentNearest = useGameStore.getState().nearestInteractable;
    if (currentNearest?.id !== nearest?.id || currentNearest?.type !== nearest?.type) {
      setNearestInteractable(nearest);
    }

    // 3. Single Press Actions
    if (input.scan && !prevInputRef.current.scan && scanCooldownRef.current <= 0 && canMove) {
      triggerScan();
      addThreat(30);
      scanCooldownRef.current = 3.0;
    }
    if (scanCooldownRef.current > 0) scanCooldownRef.current -= dt;

    // Threat Management
    decayThreat(dt * 1.5);
    if (group.position.y < -80) {
      addThreat(dt * 0.5);
    }

    // Interaction (e.g. start puzzle)
    if (input.interact && !prevInputRef.current.interact && canMove) {
      if (nearest && nearest.type === 'node') {
        startPuzzle({ type: 'sequence_sync', targetId: nearest.id });
      }
    }
    // Archive toggle
    if (input.archive && !prevInputRef.current.archive) {
      toggleArchive();
    }

    prevInputRef.current.scan = input.scan;
    prevInputRef.current.interact = input.interact;
    prevInputRef.current.archive = input.archive;

    // 4. Throttled Store Update for HUD
    if (now - lastStoreUpdateRef.current > STORE_UPDATE_INTERVAL_MS) {
      lastStoreUpdateRef.current = now;
      setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
      setVelocity({ x: velocityRef.current.x, y: velocityRef.current.y, z: velocityRef.current.z });
      setRotation({ x: group.rotation.x, y: group.rotation.y, z: group.rotation.z });
      setIsBoosting(input.boost && velocityRef.current.length() > 0.6);
      useAudioStore.getState().updateMixing(-group.position.y, useThreatStore.getState().level);
    }
    
  });

  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]}>
        <Submarine />
      </group>
      <FollowCamera targetRef={groupRef} />
    </>
  );
};

export default PlayerController;