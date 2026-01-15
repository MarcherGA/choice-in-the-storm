import { create } from 'zustand';

/**
 * Global scene state store
 * Contains all runtime parameters for the storm scene
 */
interface SceneState {
  // Lightning state
  lightningIntensity: number;
  lightningFrequency: number;
  lastLightningTime: number;
  setLightningIntensity: (intensity: number) => void;
  setLastLightningTime: (time: number) => void;

  // Rain parameters
  rainSpeed: number;
  rainCount: number;
  windStrength: number;
  setRainSpeed: (speed: number) => void;
  setRainCount: (count: number) => void;

  // Fog parameters
  fogDensity: number;
  fogHeight: number;
  fogColor: [number, number, number];
  setFogDensity: (density: number) => void;
  setFogHeight: (height: number) => void;

  // Camera parameters
  cameraDamping: number;
  cameraOffsetX: number;
  cameraOffsetY: number;
  setCameraDamping: (damping: number) => void;
  setCameraOffset: (x: number, y: number) => void;

  // Ground parameters
  groundRoughness: number;
  setGroundRoughness: (roughness: number) => void;

  // Global scene controls
  sceneBrightness: number;
  setSceneBrightness: (brightness: number) => void;

  // Global toggles for future expansion
  enablePostProcessing: boolean;
  enableRain: boolean;
  enableLightning: boolean;
  setEnablePostProcessing: (enabled: boolean) => void;
  setEnableRain: (enabled: boolean) => void;
  setEnableLightning: (enabled: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  // Lightning defaults
  lightningIntensity: 0,
  lightningFrequency: 3,
  lastLightningTime: 0,
  setLightningIntensity: (intensity) => set({ lightningIntensity: intensity }),
  setLastLightningTime: (time) => set({ lastLightningTime: time }),

  // Rain defaults
  rainSpeed: 15,
  rainCount: 20000,
  windStrength: 2,
  setRainSpeed: (speed) => set({ rainSpeed: speed }),
  setRainCount: (count) => set({ rainCount: count }),

  // Fog defaults
  fogDensity: 0.08,
  fogHeight: 20,
  fogColor: [0.1, 0.12, 0.15],
  setFogDensity: (density) => set({ fogDensity: density }),
  setFogHeight: (height) => set({ fogHeight: height }),

  // Camera defaults
  cameraDamping: 0.05,
  cameraOffsetX: 0,
  cameraOffsetY: 0,
  setCameraDamping: (damping) => set({ cameraDamping: damping }),
  setCameraOffset: (x, y) => set({ cameraOffsetX: x, cameraOffsetY: y }),

  // Ground defaults
  groundRoughness: 0.1,
  setGroundRoughness: (roughness) => set({ groundRoughness: roughness }),

  // Scene defaults - reduced for dark stormy night atmosphere
  sceneBrightness: 0.3,
  setSceneBrightness: (brightness) => set({ sceneBrightness: brightness }),

  // Toggle defaults
  enablePostProcessing: true,
  enableRain: true,
  enableLightning: true,
  setEnablePostProcessing: (enabled) => set({ enablePostProcessing: enabled }),
  setEnableRain: (enabled) => set({ enableRain: enabled }),
  setEnableLightning: (enabled) => set({ enableLightning: enabled }),
}));
