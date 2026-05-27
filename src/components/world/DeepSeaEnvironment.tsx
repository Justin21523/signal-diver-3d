import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, Points, AdditiveBlending } from 'three';
import { WORLD_CONFIG } from '../../utils/constants';

const MAX_PARTICLES = 3000;
const SPREAD = 280;
const VERTICAL_SPREAD = 180;

const BASE_POSITIONS = (() => {
  const arr = new Float32Array(MAX_PARTICLES * 3);
  for (let i = 0; i < MAX_PARTICLES; i++) {
    arr[i * 3] = (Math.random() - 0.5) * SPREAD;
    arr[i * 3 + 1] = (Math.random() - 0.5) * VERTICAL_SPREAD;
    arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
  }
  return arr;
})();

interface Props {
  particleCount?: number;
  fogFar?: number;
}

const DeepSeaEnvironment = ({ particleCount = 2000, fogFar }: Props) => {
  const pointsRef = useRef<Points>(null);
  const lightShaftsRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(BASE_POSITIONS.slice(0, particleCount * 3), 3));
    return geo;
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const t = clock.getElapsedTime() * 0.15;
      pointsRef.current.rotation.y = t;
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pos.setY(i, pos.getY(i) + Math.sin(t + i * 0.02) * 0.005);
      }
      pos.needsUpdate = true;
    }
    if (lightShaftsRef.current) {
      lightShaftsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  const effectiveFogFar = fogFar ?? WORLD_CONFIG.fogFar;

  return (
    <>
      <color attach="background" args={[WORLD_CONFIG.backgroundColor]} />
      <fog attach="fog" args={[WORLD_CONFIG.fogColor, WORLD_CONFIG.fogNear, effectiveFogFar]} />

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
