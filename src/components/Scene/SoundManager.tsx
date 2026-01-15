import { useEffect, useRef } from 'react';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Sound manager for storm ambience
 * Structure ready for integration with Howler.js or Three.js Audio API
 *
 * To integrate real sounds:
 * 1. Install: pnpm add howler @types/howler
 * 2. Add sound files to public/sounds/
 * 3. Uncomment Howler code below
 */

export function SoundManager() {
  const rainSoundRef = useRef<any>(null);
  const windSoundRef = useRef<any>(null);
  const thunderSoundRef = useRef<any>(null);

  const enableRain = useSceneStore((state) => state.enableRain);
  const enableLightning = useSceneStore((state) => state.enableLightning);
  const lightningIntensity = useSceneStore((state) => state.lightningIntensity);
  const lastLightningTime = useSceneStore((state) => state.lastLightningTime);

  // Initialize sounds on mount
  useEffect(() => {
    // Example Howler.js integration (requires installation):
    /*
    import { Howl } from 'howler';

    rainSoundRef.current = new Howl({
      src: ['/sounds/rain-loop.mp3'],
      loop: true,
      volume: 0.6,
      autoplay: enableRain,
    });

    windSoundRef.current = new Howl({
      src: ['/sounds/wind-loop.mp3'],
      loop: true,
      volume: 0.4,
      autoplay: true,
    });

    thunderSoundRef.current = new Howl({
      src: ['/sounds/thunder.mp3'],
      volume: 0.8,
    });
    */

    // Placeholder logging
    console.log('🔊 Sound Manager initialized (placeholder mode)');
    console.log('   To enable sounds:');
    console.log('   1. Run: pnpm add howler @types/howler');
    console.log('   2. Add audio files to public/sounds/');
    console.log('   3. Uncomment Howler code in SoundManager.tsx');

    return () => {
      // Cleanup sounds
      /*
      if (rainSoundRef.current) rainSoundRef.current.unload();
      if (windSoundRef.current) windSoundRef.current.unload();
      if (thunderSoundRef.current) thunderSoundRef.current.unload();
      */
    };
  }, []);

  // Control rain sound based on state
  useEffect(() => {
    /*
    if (rainSoundRef.current) {
      if (enableRain) {
        rainSoundRef.current.play();
        rainSoundRef.current.fade(rainSoundRef.current.volume(), 0.6, 1000);
      } else {
        rainSoundRef.current.fade(rainSoundRef.current.volume(), 0, 1000);
        setTimeout(() => rainSoundRef.current.pause(), 1000);
      }
    }
    */
  }, [enableRain]);

  // Play thunder sound on lightning flash
  useEffect(() => {
    if (enableLightning && lightningIntensity > 5) {
      // Thunder sound triggered by lightning
      /*
      if (thunderSoundRef.current) {
        // Random delay for distance effect (0-2 seconds)
        const delay = Math.random() * 2000;
        setTimeout(() => {
          thunderSoundRef.current.play();
        }, delay);
      }
      */
      console.log('⚡ Thunder sound would play here');
    }
  }, [lastLightningTime, enableLightning]);

  // This component doesn't render anything
  return null;
}

/**
 * Recommended sound files for public/sounds/:
 * - rain-loop.mp3: Continuous heavy rain ambience (loop)
 * - wind-loop.mp3: Wind gusts and howling (loop)
 * - thunder.mp3: Thunder crack (one-shot, ~3-5 seconds)
 * - thunder-distant.mp3: Distant rumble (optional variation)
 *
 * Free sound sources:
 * - freesound.org
 * - soundbible.com
 * - zapsplat.com (free tier)
 */
