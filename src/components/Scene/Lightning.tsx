import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DirectionalLight } from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Lightning system with randomized intensity bursts
 * Creates atmospheric flashes at variable intervals
 */
export function Lightning() {
  const lightRef = useRef<DirectionalLight>(null);

  const lightningIntensity = useSceneStore(
    (state) => state.lightningIntensity
  );
  const lightningFrequency = useSceneStore(
    (state) => state.lightningFrequency
  );
  const lastLightningTime = useSceneStore((state) => state.lastLightningTime);
  const setLightningIntensity = useSceneStore(
    (state) => state.setLightningIntensity
  );
  const setLastLightningTime = useSceneStore(
    (state) => state.setLastLightningTime
  );
  const enableLightning = useSceneStore((state) => state.enableLightning);
  const sceneBrightness = useSceneStore((state) => state.sceneBrightness);

  // Update lightning effect
  useFrame((state) => {
    if (!lightRef.current || !enableLightning) return;

    const currentTime = state.clock.elapsedTime;
    const timeSinceLastFlash = currentTime - lastLightningTime;

    // Check if we should trigger a new lightning flash
    // Use Poisson-like distribution for natural timing
    const shouldFlash =
      timeSinceLastFlash > lightningFrequency &&
      Math.random() < 0.02; // 2% chance per frame when eligible

    if (shouldFlash) {
      // Trigger lightning flash
      const flashIntensity = 3 + Math.random() * 5; // Random intensity
      setLightningIntensity(flashIntensity);
      setLastLightningTime(currentTime);
    }

    // Decay lightning intensity
    if (lightningIntensity > 0) {
      const decayRate = 0.95;
      setLightningIntensity(lightningIntensity * decayRate);
    }

    // Apply intensity to light
    lightRef.current.intensity = sceneBrightness + lightningIntensity;
  });

  return (
    <>
      {/* Main directional light (sun/lightning source) */}
      <directionalLight
        ref={lightRef}
        position={[10, 20, 5]}
        intensity={sceneBrightness}
        color="#d0e0ff"
        castShadow
      />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={sceneBrightness * 0.3} color="#8090a0" />

      {/* Hemisphere light for sky/ground color variation */}
      <hemisphereLight
        skyColor="#404860"
        groundColor="#101418"
        intensity={sceneBrightness * 0.5}
      />
    </>
  );
}
