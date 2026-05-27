import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { Mesh } from 'three';

interface AnomalyZoneProps {
  position: [number, number, number];
  radius?: number;
}

const AnomalyZone = ({ position, radius = 15 }: AnomalyZoneProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[radius, 4]} />
        <MeshDistortMaterial
          color="#4c1d95"
          emissive="#7e22ce"
          emissiveIntensity={0.8}
          transparent
          opacity={0.25}
          distort={0.4}
          speed={2}
          roughness={0.2}
        />
      </mesh>
      <pointLight color="#a855f7" intensity={5} distance={radius * 2.5} decay={2} />
    </group>
  );
};

export default AnomalyZone;