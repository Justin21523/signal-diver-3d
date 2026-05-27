import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useSettingsStore } from '../../store/useSettingsStore';

const PostProcessing = () => {
  const bloomIntensity = useSettingsStore((s) => s.bloomIntensity);

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        intensity={bloomIntensity}
        radius={0.4}
      />
      <Noise opacity={0.08} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export default PostProcessing;
