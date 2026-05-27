import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

const KELP_COUNT = 100;

const KELP_INSTANCES = Array.from({ length: KELP_COUNT }, () => ({
  pos: [
    (Math.random() - 0.5) * 180,
    -120 + Math.random() * 10,
    (Math.random() - 0.5) * 180,
  ] as [number, number, number],
  height: 8 + Math.random() * 22,
  phase: Math.random() * Math.PI * 2,
}));

const KelpForest = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummyRef = useRef(new Object3D());

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = dummyRef.current;

    for (let i = 0; i < KELP_COUNT; i++) {
      const { pos, height, phase } = KELP_INSTANCES[i];
      const swayX = Math.sin(t * 1.1 + phase) * 2.2;
      const swayZ = Math.cos(t * 0.85 + phase) * 1.6;

      dummy.position.set(pos[0] + swayX, pos[1] + height / 2, pos[2] + swayZ);
      dummy.scale.set(1, height, 1);
      dummy.rotation.z = swayX * 0.035;
      dummy.rotation.x = swayZ * 0.035;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, KELP_COUNT]}>
      <cylinderGeometry args={[0.1, 0.03, 1, 4]} />
      <meshStandardMaterial color="#0f4a3e" roughness={0.8} metalness={0.15} />
    </instancedMesh>
  );
};

export default KelpForest;
