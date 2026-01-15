import { Suspense } from 'react';
import { CameraRig } from './CameraRig';
import { Ground } from './Ground';
import { DesertTerrain } from './DesertTerrain';
import { Rain } from './Rain';
import { Lightning } from './Lightning';
import { Atmosphere } from './Atmosphere';
import { Effects } from './Effects';
import { SoundManager } from './SoundManager';

/**
 * Main storm scene component
 * Assembles all scene elements into cohesive cinematic environment
 */
export function StormScene() {
  return (
    <>
      {/* Camera system with parallax motion */}
      <CameraRig />

      {/* Atmospheric elements (sky + fog) */}
      <Atmosphere />

      {/* Lighting system with lightning flashes */}
      <Lightning />

      {/* Scene geometry wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Endless road */}
        <Ground />

        {/* Desert terrain on sides */}
        <DesertTerrain />
      </Suspense>

      {/* Particle systems */}
      <Rain />

      {/* Post-processing effects */}
      <Effects />

      {/* Sound manager (placeholder structure) */}
      <SoundManager />
    </>
  );
}