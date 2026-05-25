import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 as ThreeVector3, MathUtils } from 'three';
import Submarine from './Submarine';
import FollowCamera from '../camera/FollowCamera';
import { useKeyboard } from '../../hooks/useKeyboard';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';
import { PLAYER_CONFIG, INTERACTION_CONFIG, ZONE_THRESHOLDS } from '../../utils/constants';
import { clamp, shortestAngleDelta } from '../../utils/math';
import type { ZoneType, InteractableTarget } from '../../types';

const PlayerController = () => {
  const groupRef = useRef<Group>(null);
  const velocityRef = useRef(new ThreeVector3(0, 0, 0));
  const directionRef = useRef(new ThreeVector3(0, 0, 0));
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
  
  // Track key presses for single-press actions
  const prevInputRef = useRef({ scan: false, interact: false, archive: false });

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.1);
    const input = getInput();
    
    // Pause movement if in puzzle or archive
    const canMove = gameState === 'playing';

    if (canMove) {
      const velocity = velocityRef.current;
      const config = PLAYER_CONFIG;
      const speedMultiplier = input.boost ? config.boostMultiplier : 1.0;

      const dir = directionRef.current;
      dir.set(0, 0, 0);
      if (input.forward) dir.z += 1;
      if (input.backward) dir.z -= 1;
      if (input.left) dir.x -= 1;
      if (input.right) dir.x += 1;
      if (input.up) dir.y += 1;
      if (input.down) dir.y -= 1;

      if (dir.lengthSq() > 0) {
        dir.normalize();
        dir.applyEuler(group.rotation);
        const accel = config.acceleration * speedMultiplier * dt;
        velocity.x += dir.x * accel;
        velocity.y += dir.y * accel;
        velocity.z += dir.z * accel;
      }

      const dragFactor = 1 - Math.min(1, config.drag * dt);
      velocity.x *= dragFactor;
      velocity.y *= dragFactor;
      velocity.z *= dragFactor;

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

      const horizontalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
      if (horizontalSpeed > 0.4) {
        const targetYaw = Math.atan2(velocity.x, velocity.z);
        const deltaAngle = shortestAngleDelta(group.rotation.y, targetYaw);
        group.rotation.y += deltaAngle * Math.min(1, dt * config.rotationSpeed);
      }

      const targetPitch = MathUtils.clamp(-velocity.y * 0.045, -0.45, 0.45);
      group.rotation.x = MathUtils.lerp(group.rotation.x, targetPitch, dt * config.rotationSpeed);

      const targetRoll = MathUtils.clamp(-velocity.x * 0.02, -0.35, 0.35);
      group.rotation.z = MathUtils.lerp(group.rotation.z, targetRoll, dt * config.rotationSpeed);
    } else {
      // Freeze velocity when not playing
      velocityRef.current.set(0, 0, 0);
    }

    // --- Interactions & Logic (Runs even if paused for UI toggles) ---
    
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
      scanCooldownRef.current = 3.0; // 3 seconds cooldown
    }
    if (scanCooldownRef.current > 0) scanCooldownRef.current -= dt;

    if (input.interact && !prevInputRef.current.interact && canMove) {
      if (nearest && nearest.type === 'node') {
        startPuzzle({ type: 'sequence_sync', targetId: nearest.id });
      }
    }

    if (input.archive && !prevInputRef.current.archive) {
      toggleArchive();
    }

    prevInputRef.current.scan = input.scan;
    prevInputRef.current.interact = input.interact;
    prevInputRef.current.archive = input.archive;

    // 4. Throttled Store Update for HUD
    const now = performance.now();
    if (now - lastStoreUpdateRef.current > STORE_UPDATE_INTERVAL_MS) {
      lastStoreUpdateRef.current = now;
      setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
      setVelocity({ x: velocityRef.current.x, y: velocityRef.current.y, z: velocityRef.current.z });
      setRotation({ x: group.rotation.x, y: group.rotation.y, z: group.rotation.z });
      setIsBoosting(input.boost && velocityRef.current.length() > 0.6);
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