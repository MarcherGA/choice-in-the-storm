import { Canvas } from '@react-three/fiber';
import { StormScene } from './components/Scene/StormScene';
import { DebugPanel } from './components/UI/DebugPanel';
import './styles.css';

/**
 * Main application component
 * Sets up React Three Fiber canvas and scene
 */
function App() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0, 2, 15],
          fov: 50,
          near: 0.1,
          far: 200,
        }}
      >
        <StormScene />
      </Canvas>

      {/* Debug controls panel */}
      <DebugPanel />
    </>
  );
}

export default App;
