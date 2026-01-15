import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DirectionalLight, PointLight } from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Lightning system with dramatic flashes and ambient lighting
 * Creates cinematic storm lighting with variable intensity
 */
export function Lightning() {
  const mainLightRef = useRef<DirectionalLight>(null);
  const flashLightRef = useRef<PointLight>(null);

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
    if (!mainLightRef.current || !flashLightRef.current) return;

    const currentTime = state.clock.elapsedTime;
    const timeSinceLastFlash = currentTime - lastLightningTime;

    // Check if we should trigger a new lightning flash
    if (enableLightning) {
      const shouldFlash =
        timeSinceLastFlash > lightningFrequency &&
        Math.random() < 0.03; // 3% chance per frame when eligible

      if (shouldFlash) {
        // Trigger VERY dramatic lightning flash for dark scene
        const flashIntensity = 20 + Math.random() * 30;
        setLightningIntensity(flashIntensity);
        setLastLightningTime(currentTime);
      }
    }

    // Decay lightning intensity with realistic fall-off
    if (lightningIntensity > 0.1) {
      const decayRate = 0.82; // Faster decay for dramatic effect
      setLightningIntensity(lightningIntensity * decayRate);
    } else if (lightningIntensity > 0) {
      setLightningIntensity(0);
    }

    // Apply intensity to main directional light - affects ENTIRE scene
    mainLightRef.current.intensity = sceneBrightness * 0.2 + lightningIntensity * 1.2;

    // Apply to flash point light (very dramatic)
    flashLightRef.current.intensity = lightningIntensity * 4;
  });

  return (
    <>
      {/* Main directional light (overcast ambient) */}
      <directionalLight
        ref={mainLightRef}
        position={[10, 30, 10]}
        intensity={sceneBrightness}
        color="#c8d8e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Lightning flash point light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 50, -30]}
        intensity={0}
        color="#e8f4ff"
        distance={150}
        decay={2}
      />

      {/* Very dim ambient light for dark stormy night */}
      <ambientLight intensity={0.15} color="#3a4a5a" />

      {/* Subtle hemisphere light for minimal contrast */}
      <hemisphereLight
        skyColor="#2a3545"
        groundColor="#0a0d12"
        intensity={0.25}
      />

      {/* Minimal fill lights - scene should be dark until lightning */}
      <directionalLight
        position={[-15, 8, -10]}
        intensity={0.08}
        color="#5a6a7a"
      />
      <directionalLight
        position={[10, 6, 15]}
        intensity={0.06}
        color="#4a5a6a"
      />
    </>
  );
}
