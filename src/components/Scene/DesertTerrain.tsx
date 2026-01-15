import { useMemo } from 'react';
import * as THREE from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Desert terrain on both sides of the road
 * Rocky, sparse Albuquerque-style landscape
 */
export function DesertTerrain() {
  // Desert floor material
  const desertMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ...THREE.UniformsLib.lights, // Include Three.js light uniforms
        uTime: { value: 0 },
      },
      lights: true, // Enable automatic light uniform updates
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vElevation;

        // Simple noise for terrain variation
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vUv = uv;

          // Add subtle height variation
          vec3 pos = position;
          float elevation = noise(uv * 10.0) * 0.5;
          pos.y += elevation;
          vElevation = elevation;

          vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPosition.xyz;

          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        // Include Three.js lighting functions
        #include <common>
        #include <lights_pars_begin>

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying float vElevation;

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
          // Desert sandy-rock color
          vec3 baseColor = vec3(0.25, 0.22, 0.18);

          // Add variation with noise
          float variation = smoothNoise(vUv * 50.0);
          vec3 desertColor = mix(
            vec3(0.28, 0.24, 0.19), // Lighter sand
            vec3(0.22, 0.19, 0.15), // Darker rock
            variation
          );

          // Darken based on elevation (shadows in low areas)
          desertColor *= 0.7 + vElevation * 0.6;

          // Calculate lighting from scene lights
          vec3 normal = vec3(0.0, 1.0, 0.0); // Desert is flat, normal points up
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
          vec3 finalColor = desertColor * lighting;

          // Distance fog
          float dist = length(vWorldPosition - cameraPosition);
          float fogFactor = smoothstep(40.0, 120.0, dist);
          vec3 fogColor = vec3(0.12, 0.14, 0.18);
          finalColor = mix(finalColor, fogColor, fogFactor);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  // Create scattered rock instances
  const rocks = useMemo(() => {
    const rockPositions: Array<[number, number, number]> = [];
    const rockCount = 50;

    for (let i = 0; i < rockCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (15 + Math.random() * 30);
      const z = (Math.random() - 0.5) * 300;
      const y = -0.5;
      rockPositions.push([x, y, z]);
    }

    return rockPositions;
  }, []);

  return (
    <group>
      {/* Left desert floor - extends right to road edge */}
      <mesh
        position={[-22, -0.52, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={desertMaterial}
        receiveShadow
      >
        <planeGeometry args={[38, 400, 20, 20]} />
      </mesh>

      {/* Right desert floor - extends left to road edge */}
      <mesh
        position={[22, -0.52, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={desertMaterial}
        receiveShadow
      >
        <planeGeometry args={[38, 400, 20, 20]} />
      </mesh>

      {/* Scattered rocks */}
      {rocks.map((position, i) => {
        const scale = 0.5 + Math.random() * 1.5;
        // Adjust rock Y position to sit on desert floor
        const adjustedPosition: [number, number, number] = [
          position[0],
          -0.52 + scale * 0.3, // Sit on desert floor
          position[2]
        ];
        return (
          <mesh
            key={i}
            position={adjustedPosition}
            scale={[scale, scale * 0.7, scale]}
            rotation={[0, Math.random() * Math.PI * 2, 0]}
            castShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={new THREE.Color(0.2, 0.18, 0.15)}
              roughness={0.95}
              metalness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
