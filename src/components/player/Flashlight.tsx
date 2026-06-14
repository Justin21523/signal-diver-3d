import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FlashlightProps {
  enabled: boolean;
}

const Flashlight = ({ enabled }: FlashlightProps) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const { camera, scene } = useThree();
  const fwdVec = useRef(new THREE.Vector3());

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    scene.add(light.target);
    return () => { scene.remove(light.target); };
  }, [scene]);

  useFrame(() => {
    const light = lightRef.current;
    if (!light || !enabled) return;
    light.position.copy(camera.position);
    fwdVec.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
    light.target.position.copy(camera.position).addScaledVector(fwdVec.current, 30);
    light.target.updateMatrixWorld();
  });

  return (
    <spotLight
      ref={lightRef}
      color="#cce8ff"
      intensity={enabled ? 12 : 0}
      distance={80}
      angle={Math.PI / 7}
      penumbra={0.4}
      decay={1.5}
    />
  );
};

export default Flashlight;
