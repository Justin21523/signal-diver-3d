import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useCinematicStore } from '../../store/useCinematicStore';
import { finishMissionRun } from '../../utils/missionRun';

const CinematicCamera = () => {
  const { camera } = useThree();
  const isPlaying = useCinematicStore((s) => s.isPlaying);
  const updateProgress = useCinematicStore((s) => s.updateProgress);
  const endCinematic = useCinematicStore((s) => s.endCinematic);
  
  const progressRef = useRef(0);

  const curve = useMemo(() => {
    return new CatmullRomCurve3([
      new Vector3(0, -2910, 30),
      new Vector3(20, -130, 10),
      new Vector3(10, -145, -20),
      new Vector3(-15, -2960, -30),
      new Vector3(0, -100, -50), // Pull back and up
    ]);
  }, []);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    progressRef.current += delta * 0.08; // Speed of cinematic
    if (progressRef.current >= 1) {
      progressRef.current = 1;
      endCinematic();
      finishMissionRun('source_repaired');
      return;
    }

    updateProgress(progressRef.current);

    const pos = curve.getPoint(progressRef.current);
    camera.position.copy(pos);
    
    // Always look at the Source Node
    camera.lookAt(0, -2960, 0);
  });

  return null;
};

export default CinematicCamera;
