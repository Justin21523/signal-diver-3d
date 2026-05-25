import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial } from 'three';
import { INTERACTION_CONFIG } from '../../utils/constants';

interface SonarWaveProps {
  origin: [number, number, number];
  onComplete: () => void;
}

const SonarWave = ({ origin, onComplete }: SonarWaveProps) => {
  const meshRef = useRef<Mesh>(null);
  const scaleRef = useRef(0.1);
  const opacityRef = useRef(0.8);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    scaleRef.current += delta * INTERACTION_CONFIG.scanSpeed;
    opacityRef.current -= delta * 1.2;
    
    if (opacityRef.current <= 0 || scaleRef.current > INTERACTION_CONFIG.scanRadius) {
      onComplete();
      return;
    }
    
    meshRef.current.scale.setScalar(scaleRef.current);
    (meshRef.current.material as MeshBasicMaterial).opacity = opacityRef.current;
  });

  return (
    <mesh ref={meshRef} position={origin}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} wireframe depthWrite={false} />
    </mesh>
  );
};

export default SonarWave;