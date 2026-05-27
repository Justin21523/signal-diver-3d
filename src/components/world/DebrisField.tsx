import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

const COUNT = 90;

const DEBRIS_INSTANCES = Array.from({ length: COUNT }, () => ({
  pos: [(Math.random() - 0.5) * 180, -120 + Math.random() * 40, (Math.random() - 0.5) * 180],
  rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
  scale: 0.4 + Math.random() * 2.2,
}));

const DebrisField = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummyRef = useRef(new Object3D());

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.25;
    const dummy = dummyRef.current;
    for (let i = 0; i < COUNT; i++) {
      const { pos, rot, scale } = DEBRIS_INSTANCES[i];
      dummy.position.set(pos[0] + Math.sin(t + i * 0.5) * 0.6, pos[1], pos[2] + Math.cos(t * 0.7 + i) * 0.6);
      dummy.rotation.set(rot[0] + t * 0.08, rot[1] + t * 0.04, rot[2]);
      dummy.scale.set(scale, scale * 0.6, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1a2f36" roughness={0.92} metalness={0.45} />
    </instancedMesh>
  );
};

export default DebrisField;
