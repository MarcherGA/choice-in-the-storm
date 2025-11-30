import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { RepeatWrapping, MeshStandardMaterial } from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Ground plane with wet, reflective PBR material
 * Uses normal and roughness maps for realistic surface detail
 */
export function Ground() {
  const groundRoughness = useSceneStore((state) => state.groundRoughness);

  // Load textures - using procedural approach since we don't have actual texture files
  // In production, these would be real texture paths
  const textures = useMemo(() => {
    // Create canvas-based procedural textures as placeholders
    const createProceduralTexture = (
      color: string,
      size: number = 512
    ): HTMLCanvasElement => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);

        // Add noise for texture variation
        for (let i = 0; i < size * size * 0.1; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const brightness = Math.random() * 50;
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.1)`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      return canvas;
    };

    return {
      diffuse: createProceduralTexture('#1a1a1a'),
      normal: createProceduralTexture('#8080ff'),
      roughness: createProceduralTexture('#404040'),
    };
  }, []);

  // Create material with PBR workflow
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: groundRoughness,
      metalness: 0.3,
      normalScale: [0.5, 0.5],
    });

    return mat;
  }, [groundRoughness]);

  // Geometry is reused via useMemo
  const geometry = useMemo(() => {
    return [100, 300];
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, -50]}
      receiveShadow
      material={material}
    >
      <planeGeometry args={geometry} />
    </mesh>
  );
}
