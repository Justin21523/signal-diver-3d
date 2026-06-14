import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, InstancedMesh, Object3D } from 'three';
import { SeededRNG } from '../../utils/rng';

const GLOW_COUNT = 150;
const VENT_COUNT = 34;

interface DeepDecorFieldProps {
  seed: string;
  depth: number;
}

const DeepDecorField = ({ seed, depth }: DeepDecorFieldProps) => {
  const glowRef = useRef<InstancedMesh>(null);
  const ventRef = useRef<InstancedMesh>(null);
  const dummyRef = useRef(new Object3D());

  const glowInstances = useMemo(() => {
    const rng = new SeededRNG(`glow:${seed}`);
    const density = depth > 1800 ? 1 : depth > 600 ? 0.75 : 0.45;
    return Array.from({ length: GLOW_COUNT }, (_, i) => ({
      active: i < GLOW_COUNT * density,
      pos: [rng.range(-110, 110), rng.range(-145, 145), rng.range(-110, 110)] as [number, number, number],
      scale: rng.range(0.08, depth > 1400 ? 0.34 : 0.24),
      phase: rng.range(0, Math.PI * 2),
    }));
  }, [depth, seed]);

  const ventInstances = useMemo(() => {
    const rng = new SeededRNG(`vents:${seed}`);
    const density = depth > 1300 ? 1 : depth > 500 ? 0.45 : 0.15;
    return Array.from({ length: VENT_COUNT }, (_, i) => ({
      active: i < VENT_COUNT * density,
      pos: [rng.range(-105, 105), rng.range(-145, 135), rng.range(-105, 105)] as [number, number, number],
      height: rng.range(1.5, depth > 1600 ? 6 : 3.5),
      width: rng.range(0.25, 0.7),
      rot: rng.range(0, Math.PI * 2),
    }));
  }, [depth, seed]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const dummy = dummyRef.current;

    if (glowRef.current) {
      for (let i = 0; i < GLOW_COUNT; i++) {
        const { active, pos, scale, phase } = glowInstances[i];
        if (!active) {
          dummy.scale.set(0, 0, 0);
        } else {
          const pulse = 0.75 + Math.sin(t * 1.8 + phase) * 0.25;
          dummy.position.set(
            pos[0] + Math.sin(t * 0.35 + phase) * 0.9,
            pos[1] + Math.cos(t * 0.4 + phase) * 0.55,
            pos[2],
          );
          dummy.scale.setScalar(scale * pulse);
        }
        dummy.updateMatrix();
        glowRef.current.setMatrixAt(i, dummy.matrix);
      }
      glowRef.current.instanceMatrix.needsUpdate = true;
    }

    if (ventRef.current) {
      for (let i = 0; i < VENT_COUNT; i++) {
        const { active, pos, height, width, rot } = ventInstances[i];
        if (!active) {
          dummy.scale.set(0, 0, 0);
        } else {
          dummy.position.set(pos[0], pos[1], pos[2]);
          dummy.rotation.set(0, rot, 0);
          dummy.scale.set(width, height, width);
        }
        dummy.updateMatrix();
        ventRef.current.setMatrixAt(i, dummy.matrix);
      }
      ventRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const glowColor = depth > 1900 ? '#a78bfa' : depth > 900 ? '#22d3ee' : '#5eead4';
  const ventColor = depth > 1700 ? '#4338ca' : '#155e75';

  return (
    <>
      <instancedMesh ref={glowRef} args={[undefined, undefined, GLOW_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.55} depthWrite={false} blending={AdditiveBlending} />
      </instancedMesh>

      <instancedMesh ref={ventRef} args={[undefined, undefined, VENT_COUNT]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color={ventColor} emissive={ventColor} emissiveIntensity={0.35} roughness={0.9} />
      </instancedMesh>
    </>
  );
};

export default DeepDecorField;
