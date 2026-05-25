import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, Points, AdditiveBlending } from 'three';
import { WORLD_CONFIG } from '../../utils/constants';

const PARTICLE_COUNT = 2000;
const SPREAD = 280;
const VERTICAL_SPREAD = 180;

const DeepSeaEnvironment = () => {
  const pointsRef = useRef<Points>(null);
  const lightShaftsRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * VERTICAL_SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime() * 0.15;
      pointsRef.current.rotation.y = t;
      // Subtle drift
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos.setY(i, pos.getY(i) + Math.sin(t + i * 0.02) * 0.005);
      }
      pos.needsUpdate = true;
    }
    if (lightShaftsRef.current) {
      lightShaftsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={[WORLD_CONFIG.backgroundColor]} />
      <fog attach="fog" args={[WORLD_CONFIG.fogColor, WORLD_CONFIG.fogNear, WORLD_CONFIG.fogFar]} />

      {/* Marine snow / plankton */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.25}
          color="#4ade80"
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Fake light shafts (volumetric feel) */}
      <group ref={lightShaftsRef} position={[0, 30, 0]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[0.8, i * 0.8, 0.2]}
            position={[Math.sin(i * 1.2) * 8, 15, Math.cos(i * 1.2) * 8]}
          >
            <coneGeometry args={[1.5, 60, 6]} />
            <meshBasicMaterial color="#2dd4bf" transparent opacity={0.04} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default DeepSeaEnvironment;