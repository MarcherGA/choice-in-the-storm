import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Endless wet asphalt road with animated shader
 * Creates illusion of infinite road stretching to horizon
 */
export function Ground() {
  const roadRef = useRef<THREE.Mesh>(null);

  const groundRoughness = useSceneStore((state) => state.groundRoughness);

  // Road surface shader with wet asphalt and lane markings
  const roadMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ...THREE.UniformsLib.lights, // Include Three.js light uniforms
        uTime: { value: 0 },
        uRoughness: { value: groundRoughness },
        uCameraZ: { value: 0 },
      },
      lights: true, // Enable automatic light uniform updates
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        // Include Three.js lighting functions
        #include <common>
        #include <lights_pars_begin>

        uniform float uTime;
        uniform float uRoughness;
        uniform float uCameraZ;

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        // Noise function for asphalt texture
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

        void main() {
          // Create scrolling UV for endless road effect
          vec2 roadUv = vUv;
          roadUv.y += uCameraZ * 0.1; // Scroll with camera

          // Base asphalt color (dark gray)
          vec3 asphaltColor = vec3(0.12, 0.12, 0.13);

          // Add noise for asphalt texture variation
          float detail = smoothNoise(roadUv * 80.0);
          asphaltColor += (detail - 0.5) * 0.05;

          // Lane markings (dashed white lines)
          float centerLine = step(0.48, roadUv.x) * step(roadUv.x, 0.52);
          float dashPattern = step(0.5, fract(roadUv.y * 5.0)); // Dashed pattern
          float lineStrength = centerLine * dashPattern;

          // Edge lines (solid white)
          float leftEdge = step(roadUv.x, 0.02);
          float rightEdge = step(0.98, roadUv.x);
          float edgeLines = leftEdge + rightEdge;

          // Combine lane markings
          vec3 lineColor = vec3(0.9, 0.9, 0.85);
          vec3 finalColor = mix(asphaltColor, lineColor, lineStrength * 0.8 + edgeLines * 0.7);

          // Wet surface effect - add specular highlights
          float wetness = 0.7;
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
          finalColor += fresnel * wetness * 0.15;

          // Calculate lighting from scene lights
          vec3 normal = normalize(vNormal);
          vec3 lighting = vec3(0.0);

          // Ambient light contribution
          lighting += ambientLightColor;

          // Directional lights
          #if NUM_DIR_LIGHTS > 0
            for(int i = 0; i < NUM_DIR_LIGHTS; i++) {
              vec3 lightDir = normalize(directionalLights[i].direction);
              float diff = max(dot(normal, -lightDir), 0.0);
              lighting += directionalLights[i].color * diff;
            }
          #endif

          // Point lights (lightning flash)
          #if NUM_POINT_LIGHTS > 0
            for(int i = 0; i < NUM_POINT_LIGHTS; i++) {
              vec3 lightVec = pointLights[i].position - vWorldPosition;
              float distance = length(lightVec);
              vec3 lightDir = normalize(lightVec);
              float diff = max(dot(normal, lightDir), 0.0);
              float attenuation = 1.0 / (1.0 + pointLights[i].distance * distance +
                                         pointLights[i].decay * distance * distance);
              lighting += pointLights[i].color * diff * attenuation;
            }
          #endif

          // Hemisphere light
          #if NUM_HEMI_LIGHTS > 0
            for(int i = 0; i < NUM_HEMI_LIGHTS; i++) {
              float hemiDiffuseWeight = 0.5 * dot(normal, vec3(0.0, 1.0, 0.0)) + 0.5;
              lighting += mix(hemisphereLights[i].groundColor, hemisphereLights[i].skyColor, hemiDiffuseWeight);
            }
          #endif

          // Apply lighting to final color
          finalColor *= lighting;

          // Distance fog fade
          float dist = length(vWorldPosition - cameraPosition);
          float fogFactor = smoothstep(30.0, 120.0, dist);
          vec3 fogColor = vec3(0.12, 0.14, 0.18);
          finalColor = mix(finalColor, fogColor, fogFactor);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [groundRoughness]);


  // Update uniforms
  useFrame((state) => {
    if (roadRef.current) {
      const mat = roadRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      mat.uniforms.uCameraZ.value = state.camera.position.z;
      mat.uniforms.uRoughness.value = groundRoughness;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      {/* Main road surface - no shoulders, desert goes to road edge */}
      <mesh ref={roadRef} material={roadMaterial} receiveShadow>
        <planeGeometry args={[12, 400, 1, 50]} />
      </mesh>
    </group>
  );
}
