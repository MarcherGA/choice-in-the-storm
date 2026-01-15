import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Stormy sky dome with animated volumetric clouds
 * Creates dramatic overcast atmosphere with depth
 */
export function Sky() {
  const skyRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Sky shader material with animated storm clouds - DARK NIGHT STORM
  const skyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTopColor: { value: new THREE.Color(0x0a0d15) }, // Very dark blue-black
        uHorizonColor: { value: new THREE.Color(0x1a2030) }, // Dark storm blue
        uBottomColor: { value: new THREE.Color(0x151820) }, // Dark gray-blue
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uHorizonColor;
        uniform vec3 uBottomColor;

        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          // Gradient from horizon to top
          float h = normalize(vWorldPosition).y;

          // Create gradient with horizon band - DARKER for stormy night
          vec3 color;
          if (h > 0.0) {
            // Upper hemisphere - very dark storm clouds
            color = mix(uHorizonColor, uTopColor, smoothstep(0.0, 0.8, h));
          } else {
            // Lower hemisphere - subtle glow near horizon
            color = mix(uHorizonColor, uBottomColor, smoothstep(0.0, -0.2, h));
          }

          // Darken overall for night storm
          color *= 0.7;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);

  // Cloud layer shader material - MORE VISIBLE AND DRAMATIC
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCloudDensity: { value: 0.4 }, // More clouds visible
        uCloudSpeed: { value: 0.03 }, // Faster movement
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uCloudDensity;
        uniform float uCloudSpeed;

        varying vec3 vWorldPosition;
        varying vec2 vUv;

        // Simple noise function
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;

          for (int i = 0; i < 4; i++) {
            value += amplitude * smoothNoise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }

          return value;
        }

        void main() {
          vec3 normal = normalize(vWorldPosition);

          // Only render clouds in upper hemisphere
          if (normal.y < 0.0) {
            discard;
          }

          // Create scrolling cloud pattern
          vec2 cloudUv = vec2(normal.x, normal.z) * 3.0;
          cloudUv.x += uTime * uCloudSpeed;

          // Multi-octave noise for cloud detail
          float clouds = fbm(cloudUv);
          clouds = smoothstep(1.0 - uCloudDensity, 1.0, clouds);

          // Fade clouds near horizon
          float horizonFade = smoothstep(0.0, 0.3, normal.y);
          clouds *= horizonFade;

          // Very dark storm cloud color - almost black with blue tint
          vec3 cloudColor = vec3(0.08, 0.09, 0.12);

          // Make clouds more opaque and visible
          gl_FragColor = vec4(cloudColor, clouds * 0.9);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Animate shaders
  useFrame((state) => {
    if (skyRef.current) {
      const mat = skyRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (cloudsRef.current) {
      const mat = cloudsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Sky gradient dome */}
      <mesh ref={skyRef} material={skyMaterial}>
        <sphereGeometry args={[150, 32, 32]} />
      </mesh>

      {/* Volumetric cloud layer */}
      <mesh ref={cloudsRef} material={cloudMaterial}>
        <sphereGeometry args={[145, 32, 32]} />
      </mesh>
    </group>
  );
}
