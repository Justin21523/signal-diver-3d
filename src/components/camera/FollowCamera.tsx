import { type RefObject, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils, Vector3 } from 'three';
import { mouseInput } from '../../utils/mouseInput';

const ORBIT_DIST = 14;
const PITCH_MIN = -0.55;
const PITCH_MAX = 0.65;
const SENSITIVITY = 0.003;

interface FollowCameraProps {
  targetRef: RefObject<Group | null>;
}

const FollowCamera = ({ targetRef }: FollowCameraProps) => {
  const { camera, gl } = useThree();
  const desiredPos = useRef(new Vector3(0, 5, 14));
  const lookAtVec = useRef(new Vector3());

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      mouseInput.isLocked = document.pointerLockElement === canvas;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseInput.isLocked) return;
      mouseInput.yaw -= e.movementX * SENSITIVITY;
      mouseInput.pitch -= e.movementY * SENSITIVITY;
      mouseInput.pitch = MathUtils.clamp(mouseInput.pitch, PITCH_MIN, PITCH_MAX);
    };

    const onClick = () => {
      if (!mouseInput.isLocked) canvas.requestPointerLock();
    };

    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl]);

  useFrame(() => {
    const target = targetRef.current;
    if (!target) return;

    const yaw = mouseInput.yaw;
    const pitch = mouseInput.pitch;
    const cosPitch = Math.cos(pitch);

    desiredPos.current.set(
      target.position.x + Math.sin(yaw) * cosPitch * ORBIT_DIST,
      target.position.y + Math.sin(pitch) * ORBIT_DIST + 2,
      target.position.z + Math.cos(yaw) * cosPitch * ORBIT_DIST,
    );

    camera.position.lerp(desiredPos.current, 0.1);

    lookAtVec.current.set(target.position.x, target.position.y + 1, target.position.z);
    camera.lookAt(lookAtVec.current);
  });

  return null;
};

export default FollowCamera;
