import { useMemo } from 'react';
import { Color } from 'three';
import { useSceneStore } from '../../store/useSceneStore';
import { Sky } from './Sky';

/**
 * Atmospheric system combining sky dome and distance fog
 * Creates depth and dramatic storm atmosphere
 */
export function Atmosphere() {
  const fogColor = useSceneStore((state) => state.fogColor);

  // Create fog color from store values (storm blue-gray)
  const color = useMemo(() => {
    return new Color(fogColor[0], fogColor[1], fogColor[2]);
  }, [fogColor]);

  return (
    <>
      {/* Stormy sky dome with clouds */}
      <Sky />

      {/* Distance-based exponential fog for depth - DARKER */}
      <fog attach="fog" args={[color, 30, 150]} />

      {/* Very dark background for stormy night */}
      <color attach="background" args={['#0a0d12']} />
    </>
  );
}
