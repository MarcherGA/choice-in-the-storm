import { useControls } from 'leva';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Debug panel for real-time scene parameter adjustment
 * Exposes all critical scene controls via Leva GUI
 */
export function DebugPanel() {
  const setRainSpeed = useSceneStore((state) => state.setRainSpeed);
  const setRainCount = useSceneStore((state) => state.setRainCount);
  const setLightningFrequency = useSceneStore(
    (state) => state.setLastLightningTime
  );
  const setFogDensity = useSceneStore((state) => state.setFogDensity);
  const setFogHeight = useSceneStore((state) => state.setFogHeight);
  const setCameraDamping = useSceneStore((state) => state.setCameraDamping);
  const setGroundRoughness = useSceneStore((state) => state.setGroundRoughness);
  const setSceneBrightness = useSceneStore((state) => state.setSceneBrightness);
  const setEnablePostProcessing = useSceneStore(
    (state) => state.setEnablePostProcessing
  );
  const setEnableRain = useSceneStore((state) => state.setEnableRain);
  const setEnableLightning = useSceneStore((state) => state.setEnableLightning);

  // Create Leva controls
  useControls('Rain', {
    rainSpeed: {
      value: 15,
      min: 1,
      max: 30,
      step: 0.5,
      onChange: (value) => setRainSpeed(value),
    },
    rainCount: {
      value: 20000,
      min: 1000,
      max: 50000,
      step: 1000,
      onChange: (value) => setRainCount(value),
    },
    enableRain: {
      value: true,
      onChange: (value) => setEnableRain(value),
    },
  });

  useControls('Lightning', {
    lightningFrequency: {
      value: 3,
      min: 0.5,
      max: 10,
      step: 0.5,
      label: 'Flash Interval (s)',
      onChange: (value) => {
        const store = useSceneStore.getState();
        store.lightningFrequency = value;
      },
    },
    enableLightning: {
      value: true,
      onChange: (value) => setEnableLightning(value),
    },
  });

  useControls('Fog', {
    fogDensity: {
      value: 0.08,
      min: 0,
      max: 0.3,
      step: 0.01,
      onChange: (value) => setFogDensity(value),
    },
    fogHeight: {
      value: 20,
      min: 5,
      max: 50,
      step: 1,
      onChange: (value) => setFogHeight(value),
    },
  });

  useControls('Camera', {
    cameraDamping: {
      value: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      onChange: (value) => setCameraDamping(value),
    },
  });

  useControls('Ground', {
    groundRoughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
      onChange: (value) => setGroundRoughness(value),
    },
  });

  useControls('Scene', {
    sceneBrightness: {
      value: 0.4,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (value) => setSceneBrightness(value),
    },
    enablePostProcessing: {
      value: true,
      onChange: (value) => setEnablePostProcessing(value),
    },
  });

  return null;
}
