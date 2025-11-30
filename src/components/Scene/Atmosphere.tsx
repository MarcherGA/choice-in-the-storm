import { useMemo } from 'react';
import { Color } from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Two-layer atmospheric fog system
 * Combines built-in exponential fog with custom height-based fog
 */
export function Atmosphere() {
  const fogDensity = useSceneStore((state) => state.fogDensity);
  const fogColor = useSceneStore((state) => state.fogColor);

  // Create fog color from store values
  const color = useMemo(() => {
    return new Color(fogColor[0], fogColor[1], fogColor[2]);
  }, [fogColor]);

  return (
    <>
      {/* Exponential fog for base atmospheric scattering */}
      <fog attach="fog" args={[color, 10, 100]} />

      {/* 
        Additional custom fog shader would be implemented via:
        - Full-screen quad with custom shader material
        - Depth texture from render target
        - Applied in post-processing or as separate pass
        
        For this prototype, we use the built-in fog which provides
        good performance and visual quality. The custom shader in
        fog.glsl is available for future enhancement.
      */}
    </>
  );
}
