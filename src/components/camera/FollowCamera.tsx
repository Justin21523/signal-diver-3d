import { type RefObject, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { CAMERA_CONFIG } from '../../utils/constants';

interface FollowCameraProps {
  targetRef: RefObject<Group | null>;
}

const FollowCamera = ({ targetRef }: FollowCameraProps) => {
  const { camera } = useThree();

  const desiredPos = useRef(new Vector3());
  const rotatedOffset = useRef(new Vector3());
  const lookAtTarget = useRef(new Vector3());

  useFrame(() => {
    const target = targetRef.current;
    if (!target) return;

    const offset = CAMERA_CONFIG.offset;

    // Rotate the camera offset with the submarine so the camera trails behind it
    rotatedOffset.current.set(offset.x, offset.y, offset.z);
    rotatedOffset.current.applyEuler(target.rotation);

    desiredPos.current.copy(target.position).add(rotatedOffset.current);

    // Smoothly follow
    camera.position.lerp(desiredPos.current, CAMERA_CONFIG.lerpFactor);

    // Look slightly ahead of the submarine for better framing
    lookAtTarget.current.copy(target.position);
    lookAtTarget.current.y += 0.4;
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

export default FollowCamera;