import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';

interface DataFragmentProps {
  id: string;
  position: [number, number, number];
}

const DataFragment = ({ id, position }: DataFragmentProps) => {
  const meshRef = useRef<Mesh>(null);
  const baseY = position[1];
  const collected = useGameStore((s) => s.fragments.find(f => f.id === id)?.collected);
  const nearest = useGameStore((s) => s.nearestInteractable);
  const isNearest = nearest?.type === 'fragment' && nearest.id === id;

  useFrame(({ clock }) => {
    if (meshRef.current && !collected) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.9;
      meshRef.current.rotation.x = t * 0.55;
      meshRef.current.position.y = baseY + Math.sin(t * 1.6 + position[0]) * 0.35;
    }
  });

  if (collected) return null;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#ffab40"
          emissive="#ff6f00"
          emissiveIntensity={isNearest ? 2.5 : 1.4}
          metalness={0.55}
          roughness={0.25}
        />
      </mesh>
      <pointLight color="#ffab40" intensity={isNearest ? 2.5 : 1.2} distance={7} decay={2} />
      
      {isNearest && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }} position={[0, 1.2, 0]}>
          <div className="bg-black/80 border border-orange-400 px-3 py-1 rounded text-orange-300 text-xs font-mono whitespace-nowrap animate-pulse">
            Collecting...
          </div>
        </Html>
      )}
    </group>
  );
};

export default DataFragment;