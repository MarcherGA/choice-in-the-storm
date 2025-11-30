import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Post-processing effects stack
 * Applies cinematic effects for atmospheric enhancement
 */
export function Effects() {
  const enablePostProcessing = useSceneStore(
    (state) => state.enablePostProcessing
  );

  if (!enablePostProcessing) return null;

  return (
    <EffectComposer multisampling={8}>
      {/* Subtle bloom for lightning and highlights */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Vignette for focus and atmosphere */}
      <Vignette
        offset={0.3}
        darkness={0.7}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Film grain for organic feel */}
      <Noise
        opacity={0.08}
        blendFunction={BlendFunction.OVERLAY}
      />

      {/* Chromatic aberration for lens-like distortion */}
      <ChromaticAberration
        offset={[0.0008, 0.0008]}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Very subtle depth of field */}
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.05}
        bokehScale={1.5}
        height={480}
      />
    </EffectComposer>
  );
}
