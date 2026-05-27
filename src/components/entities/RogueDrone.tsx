import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useThreatStore } from '../../store/useThreatStore';

interface RogueDroneProps {
  initialPos: [number, number, number];
}

const RogueDrone = ({ initialPos }: RogueDroneProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const wanderTarget = useRef(new THREE.Vector3(...initialPos));
  const tempVec = useRef(new THREE.Vector3());

  const playerPos = usePlayerStore((s) => s.position);
  const isHunted = useThreatStore((s) => s.isHunted);

  const stats = useMemo(() => ({
    maxSpeed: isHunted ? 14 : 6,
    wanderRadius: 30,
    seekWeight: 1.5,
    wanderWeight: 0.8,
  }), [isHunted]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);
    const pos = meshRef.current.position;

    // 1. Determine Target
    if (isHunted) {
      tempVec.current.set(playerPos.x, playerPos.y, playerPos.z);
    } else {
      // Update wander target occasionally
      if (pos.distanceTo(wanderTarget.current) < 5) {
        wanderTarget.current.set(
          pos.x + (Math.random() - 0.5) * stats.wanderRadius,
          pos.y + (Math.random() - 0.5) * 10,
          pos.z + (Math.random() - 0.5) * stats.wanderRadius
        );
      }
      tempVec.current.copy(wanderTarget.current);
    }

    // 2. Steering (Seek)
    const desired = tempVec.current.clone().sub(pos).normalize().multiplyScalar(stats.maxSpeed);
    const steer = desired.sub(velocity.current).clampLength(0, 15 * dt);
    velocity.current.add(steer);
    velocity.current.clampLength(0, stats.maxSpeed);

    // 3. Apply Movement
    pos.add(velocity.current.clone().multiplyScalar(dt));

    // 4. Rotation (Look at velocity)
    if (velocity.current.lengthSq() > 0.1) {
      const lookAtPos = pos.clone().add(velocity.current);
      meshRef.current.lookAt(lookAtPos);
    }
  });

  return (
    <group ref={meshRef} position={initialPos}>
      {/* Drone Body */}
      <mesh castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color={isHunted ? '#ef4444' : '#64748b'} 
          emissive={isHunted ? '#7f1d1d' : '#1e293b'} 
          emissiveIntensity={isHunted ? 2 : 0.5}
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      {/* Eye / Sensor */}
      <mesh position={[0, 0, 0.6]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={isHunted ? '#ff0000' : '#00e5ff'} />
      </mesh>
      <pointLight color={isHunted ? '#ff0000' : '#00e5ff'} intensity={isHunted ? 4 : 1.5} distance={12} decay={2} />
    </group>
  );
};

export default RogueDrone;