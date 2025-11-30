import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  AdditiveBlending,
} from 'three';
import { useSceneStore } from '../../store/useSceneStore';
import rainVertexShader from '../../shaders/rain.vert';
import rainFragmentShader from '../../shaders/rain.frag';

/**
 * High-performance instanced rain particle system
 * Renders 20,000+ particles using GPU-driven animation
 */
export function Rain() {
  const pointsRef = useRef<Points>(null);
  const rainSpeed = useSceneStore((state) => state.rainSpeed);
  const rainCount = useSceneStore((state) => state.rainCount);
  const windStrength = useSceneStore((state) => state.windStrength);
  const enableRain = useSceneStore((state) => state.enableRain);

  // Create instanced geometry with attributes
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();

    // Single point vertex (will be instanced)
    const positions = new Float32Array([0, 0, 0]);
    geo.setAttribute('position', new BufferAttribute(positions, 3));

    // Instance attributes
    const instanceOffsets = new Float32Array(rainCount * 3);
    const instanceSpeeds = new Float32Array(rainCount);
    const instancePhases = new Float32Array(rainCount);

    // Randomize instance data
    for (let i = 0; i < rainCount; i++) {
      // Random position in volume
      instanceOffsets[i * 3 + 0] = (Math.random() - 0.5) * 100; // X
      instanceOffsets[i * 3 + 1] = Math.random() * 50 - 25; // Y
      instanceOffsets[i * 3 + 2] = (Math.random() - 0.5) * 100; // Z

      // Random speed variation
      instanceSpeeds[i] = 0.8 + Math.random() * 0.4;

      // Random phase for animation offset
      instancePhases[i] = Math.random() * 100;
    }

    geo.setAttribute(
      'instanceOffset',
      new BufferAttribute(instanceOffsets, 3)
    );
    geo.setAttribute('instanceSpeed', new BufferAttribute(instanceSpeeds, 1));
    geo.setAttribute('instancePhase', new BufferAttribute(instancePhases, 1));

    return geo;
  }, [rainCount]);

  // Create shader material
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRainSpeed: { value: rainSpeed },
        uWindStrength: { value: windStrength },
        uCameraPosition: { value: [0, 0, 0] },
      },
      vertexShader: rainVertexShader,
      fragmentShader: rainFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
  }, [rainSpeed, windStrength]);

  // Update uniforms per frame
  useFrame((state) => {
    if (!pointsRef.current || !enableRain) return;

    const mat = pointsRef.current.material as ShaderMaterial;

    // Update time
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Update camera position for distance-based fading
    mat.uniforms.uCameraPosition.value = [
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
    ];

    // Update rain parameters from store
    mat.uniforms.uRainSpeed.value = rainSpeed;
    mat.uniforms.uWindStrength.value = windStrength;
  });

  if (!enableRain) return null;

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}
