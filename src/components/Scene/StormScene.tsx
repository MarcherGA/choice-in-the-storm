import { Suspense } from 'react';
import { CameraRig } from './CameraRig';
import { Ground } from './Ground';
import { Rain } from './Rain';
import { Lightning } from './Lightning';
import { Atmosphere } from './Atmosphere';
import { Effects } from './Effects';

/**
 * Main storm scene component
 * Assembles all scene elements into cohesive cinematic environment
 */
export function StormScene() {
  return (
    <>
      {/* Camera system with parallax motion */}
      <CameraRig />

      {/* Atmospheric elements */}
      <Atmosphere />

      {/* Lighting system */}
      <Lightning />

      {/* Scene geometry wrapped in Suspense for texture loading */}
      <Suspense fallback={null}>
        {/* Ground plane */}
        <Ground />
      </Suspense>

      {/* Particle systems */}
      <Rain />

      {/* Post-processing effects */}
      <Effects />
    </>
  );
}
