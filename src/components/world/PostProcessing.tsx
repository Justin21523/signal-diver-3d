import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

const PostProcessing = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        intensity={0.65}
        radius={0.4}
      />
      <Noise opacity={0.08} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export default PostProcessing;