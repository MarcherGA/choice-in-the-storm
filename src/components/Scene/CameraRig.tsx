import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import { useSceneStore } from '../../store/useSceneStore';

/**
 * Camera rig with smooth pointer-based parallax movement
 * Provides cinematic camera motion responding to mouse/touch input
 */
export function CameraRig() {
  const { size } = useThree();
  const cameraDamping = useSceneStore((state) => state.cameraDamping);
  const cameraOffsetX = useSceneStore((state) => state.cameraOffsetX);
  const cameraOffsetY = useSceneStore((state) => state.cameraOffsetY);
  const setCameraOffset = useSceneStore((state) => state.setCameraOffset);

  // Target position for smooth lerping
  const targetPosition = useRef(new Vector3(0, 2, 15));
  const currentPosition = useRef(new Vector3(0, 2, 15));

  // Handle pointer movement
  const handlePointerMove = (event: PointerEvent) => {
    // Normalize pointer position to -1 to 1 range
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;

    // Update target camera offset
    setCameraOffset(x * 2, y * 1);
  };

  // Set up pointer listener
  useFrame(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pointermove', handlePointerMove);
      }
    };
  });

  // Smooth camera movement with lerp
  useFrame((state) => {
    const camera = state.camera;

    // Calculate target position with offset
    targetPosition.current.set(cameraOffsetX, 2 + cameraOffsetY * 0.5, 15);

    // Lerp current position towards target
    currentPosition.current.lerp(targetPosition.current, cameraDamping);

    // Apply position to camera
    camera.position.copy(currentPosition.current);

    // Look at point slightly ahead
    camera.lookAt(0, 0, 0);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 2, 15]}
      fov={50}
      near={0.1}
      far={200}
    />
  );
}
