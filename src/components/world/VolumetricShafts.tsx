import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SHAFTS = Array.from({ length: 8 }, (_, i) => ({
  pos: [Math.sin(i * 0.9) * 40, 40, Math.cos(i * 0.9) * 40] as [number, number, number],
  rot: [0.6 + Math.random() * 0.4, i * 0.8, 0] as [number, number, number],
  scale: 0.8 + Math.random() * 1.2,
}));

const VolumetricShafts = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const t = clock.getElapsedTime();
        child.rotation.z = Math.sin(t * 0.3 + i) * 0.05;
        (child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>).material.opacity =
          0.03 + Math.sin(t * 0.5 + i * 2) * 0.015;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {SHAFTS.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={[s.scale, 1, s.scale]}>
          <cylinderGeometry args={[0.5, 8, 120, 8, 1, true]} />
          <meshBasicMaterial
            color="#4ade80"
            transparent
            opacity={0.04}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export default VolumetricShafts;
