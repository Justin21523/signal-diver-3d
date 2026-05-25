import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';

interface SignalNodeProps {
  id: string;
  position: [number, number, number];
}

const SignalNode = ({ id, position }: SignalNodeProps) => {
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  
  const nodeData = useGameStore((s) => s.nodes.find(n => n.id === id));
  const nearest = useGameStore((s) => s.nearestInteractable);
  const isNearest = nearest?.type === 'node' && nearest.id === id;
  const isRepaired = nodeData?.repaired;

  const color = isRepaired ? '#69f0ae' : '#00e5ff';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * (isRepaired ? 1.0 : 2.2)) * 0.18;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.y = t * 0.6;
    }
    if (haloRef.current) {
      const halo = 1.6 + Math.sin(t * 2.2 + 1.2) * 0.35;
      haloRef.current.scale.setScalar(halo);
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isNearest ? 3.5 : 2.2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[0.95, 20, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      <pointLight color={color} intensity={isNearest ? 5 : 3.5} distance={22} decay={2} />

      {isNearest && !isRepaired && (
        <Html center distanceFactor={12} style={{ pointerEvents: 'none' }} position={[0, 2.0, 0]}>
          <div className="bg-black/80 border border-cyan-400 px-3 py-1.5 rounded text-cyan-300 text-sm font-mono whitespace-nowrap animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Press [F] to Repair Node
          </div>
        </Html>
      )}
      
      {isRepaired && (
        <Html center distanceFactor={12} style={{ pointerEvents: 'none' }} position={[0, 2.0, 0]}>
          <div className="text-green-400 text-xs font-mono tracking-widest">
            STABLE
          </div>
        </Html>
      )}
    </group>
  );
};

export default SignalNode;