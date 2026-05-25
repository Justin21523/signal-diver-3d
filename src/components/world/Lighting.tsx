import { WORLD_CONFIG } from '../../utils/constants';

const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.12} color={WORLD_CONFIG.ambientColor} />

      <directionalLight
        position={[10, 40, 10]}
        intensity={0.35}
        color={WORLD_CONFIG.lightColor}
        castShadow={false}
      />

      <directionalLight
        position={[-15, 20, -20]}
        intensity={0.15}
        color="#065f46"
      />

      <pointLight
        position={[0, 50, 0]}
        intensity={0.45}
        color="#34d399"
        distance={160}
        decay={1.8}
      />

      <pointLight
        position={[0, -90, 0]}
        intensity={0.2}
        color="#064e3b"
        distance={220}
        decay={2}
      />
    </>
  );
};

export default Lighting;