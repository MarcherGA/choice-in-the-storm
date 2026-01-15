import { useControls } from 'leva';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Debug panel for real-time scene parameter adjustment
 * Exposes all critical scene controls via Leva GUI
 */
export function DebugPanel() {
  // Create Leva controls with organized folders
  useControls('🌧️ Rain', {
    rainSpeed: {
      value: 15,
      min: 1,
      max: 30,
      step: 0.5,
      label: 'Fall Speed',
      onChange: (value) => useSceneStore.getState().setRainSpeed(value),
    },
    windStrength: {
      value: 2,
      min: 0,
      max: 10,
      step: 0.5,
      label: 'Wind Drift',
      onChange: (value) => {
        const store = useSceneStore.getState();
        store.windStrength = value;
      },
    },
    rainCount: {
      value: 20000,
      min: 5000,
      max: 50000,
      step: 5000,
      label: 'Particle Count',
      onChange: (value) => useSceneStore.getState().setRainCount(value),
    },
    enableRain: {
      value: true,
      label: 'Enable',
      onChange: (value) => useSceneStore.getState().setEnableRain(value),
    },
  });

  useControls('⚡ Lightning', {
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
      label: 'Enable',
      onChange: (value) => useSceneStore.getState().setEnableLightning(value),
    },
  });

  useControls('🌫️ Atmosphere', {
    sceneBrightness: {
      value: 0.3,
      min: 0.1,
      max: 2,
      step: 0.1,
      label: 'Overall Brightness',
      onChange: (value) => useSceneStore.getState().setSceneBrightness(value),
    },
    fogDensity: {
      value: 0.08,
      min: 0,
      max: 0.3,
      step: 0.01,
      label: 'Fog Density',
      onChange: (value) => useSceneStore.getState().setFogDensity(value),
    },
  });

  useControls('🎥 Camera', {
    cameraDamping: {
      value: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      label: 'Mouse Smoothing',
      onChange: (value) => useSceneStore.getState().setCameraDamping(value),
    },
  });

  useControls('🛣️ Ground', {
    groundRoughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.05,
      label: 'Wetness',
      onChange: (value) => useSceneStore.getState().setGroundRoughness(value),
    },
  });

  useControls('🎬 Effects', {
    enablePostProcessing: {
      value: true,
      label: 'Post-Processing',
      onChange: (value) => useSceneStore.getState().setEnablePostProcessing(value),
    },
  });

  return null;
}
