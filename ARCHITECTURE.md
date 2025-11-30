# Architecture Documentation - Choice in the Storm

Comprehensive technical overview of the storm scene prototype architecture.

## 🏛️ System Architecture

### High-Level Overview

```
User Input (Mouse/Touch)
        ↓
    App.tsx (Canvas Setup)
        ↓
    StormScene.tsx (Scene Composition)
        ↓
    ┌──────────────────────────────────┐
    │  Rendering Pipeline              │
    ├──────────────────────────────────┤
    │  1. Camera Rig (Parallax)        │
    │  2. Atmosphere (Fog + Lights)    │
    │  3. Lightning (Dynamic Light)    │
    │  4. Ground (PBR Material)        │
    │  5. Rain (GPU Particles)         │
    │  6. Effects (Post-processing)    │
    └──────────────────────────────────┘
        ↓
    WebGL Renderer → Screen
        ↑
    Zustand Store (State)
        ↑
    Leva Panel (Debug UI)
```

## 📦 Component Hierarchy

```
App
├── Canvas (R3F)
│   └── StormScene
│       ├── CameraRig
│       │   └── PerspectiveCamera
│       ├── Atmosphere
│       │   ├── fogExp2
│       │   ├── ambientLight
│       │   └── directionalLight (x2)
│       ├── Lightning
│       │   └── directionalLight (dynamic)
│       ├── Ground
│       │   └── mesh (planeGeometry + meshStandardMaterial)
│       ├── Rain
│       │   └── instancedMesh (custom shaders)
│       └── Effects
│           └── EffectComposer
│               ├── Bloom
│               ├── Vignette
│               ├── Noise
│               └── ChromaticAberration
└── DebugPanel (Leva)
```

## 🔄 Data Flow

### State Management (Zustand)

```typescript
useSceneStore
├── Rain State
│   ├── rainSpeed
│   ├── rainCount
│   └── windStrength
├── Lightning State
│   ├── lightningFrequency
│   ├── lightningIntensity
│   └── lastLightningTime
├── Fog State
│   ├── fogDensity
│   ├── fogHeight
│   └── fogColor
├── Camera State
│   ├── cameraDamping
│   └── cameraOffset
└── Visual State
    ├── groundRoughness
    └── globalBrightness
```

**Data Flow Pattern:**
1. Leva UI → DebugPanel useEffect
2. DebugPanel → Zustand actions
3. Zustand store → Component selectors
4. Component → Render/Animation

### Performance Optimizations

**State Granularity:**
- Individual selectors prevent unnecessary re-renders
- Only components using specific state values re-render on changes

**Example:**
```typescript
// Only re-renders when rainSpeed changes
const rainSpeed = useSceneStore((state) => state.rainSpeed);
```

## 🎭 Rendering Pipeline

### Frame Execution Order

```
useFrame hook (60 FPS)
    ↓
1. CameraRig.useFrame()
   - Update pointer offset
   - Lerp camera position
   - Apply rotation
    ↓
2. Rain.useFrame()
   - Update shader uniform: uTime
   - Update shader uniform: uRainSpeed
   - Update shader uniform: uWindStrength
    ↓
3. Lightning.useFrame()
   - Check flash timing
   - Calculate intensity curve
   - Update light intensity
    ↓
4. Effects (automatic)
   - Post-processing passes
   - Bloom, vignette, etc.
    ↓
WebGL Render → Display
```

## 🎨 Shader Architecture

### Rain System (GPU-Driven)

**Vertex Shader Flow:**
```glsl
Input: 
  - position (base geometry)
  - instanceOffset (spatial position)
  - instanceSpeed (fall variation)
  - instancePhase (animation offset)
  - uTime (elapsed time)

Process:
  1. Calculate fall distance
  2. Apply wind displacement
  3. Add instance offset
  4. Wrap particles (cycling)
  5. Calculate fade factors

Output:
  - gl_Position (screen space)
  - vAlpha (opacity)
  - vUv (texture coords)
```

**Fragment Shader Flow:**
```glsl
Input:
  - vAlpha (from vertex)
  - vUv (from vertex)

Process:
  1. Vertical gradient
  2. Horizontal falloff
  3. Combine with alpha
  4. Apply rain color

Output:
  - gl_FragColor (final pixel)
```

### Instancing Benefits

- **Single Draw Call:** 20,000 particles = 1 draw call
- **GPU Animation:** No JavaScript loops
- **Memory Efficient:** Shared geometry + instance attributes
- **Scalable:** Easy to increase particle count

**Memory Layout:**
```
Base Geometry (1x)
  ├── PlaneGeometry (0.02 x 1.5)
  └── Shared by all instances

Instance Attributes (20,000x)
  ├── instanceOffset: Vec3 (spatial distribution)
  ├── instanceSpeed: Float (fall speed variation)
  └── instancePhase: Float (animation offset)

Total Memory: ~1.5MB
```

## 🎥 Camera System

### Parallax Mechanism

```typescript
Input: Mouse/Touch Position
    ↓
Normalized Coordinates (-1 to 1)
    ↓
Target Offset Calculation
  - X: pointer.x × maxOffsetX
  - Y: pointer.y × maxOffsetY
    ↓
Damped Interpolation
  - current += (target - current) × damping
    ↓
Apply to Camera Group
  - Position: [x, y, z]
  - Rotation: [x × 0.03, y × 0.05, 0]
    ↓
Smooth Visual Result
```

**Damping Math:**
```
damping = 0.05 (default)
current_offset += (target_offset - current_offset) × damping

Result: Exponential approach to target
  - Fast when far from target
  - Slow when near target
  - Never oscillates
```

## ⚡ Lightning System

### Flash Algorithm

```typescript
State Machine:
  [IDLE] → Check Timer
      ↓ (time elapsed > interval)
  [TRIGGER] → Set intensity, duration = 0
      ↓
  [FLASHING] → Update intensity based on curve
      ↓ (duration < 0.2s)
      |  Intensity = curve(duration / 0.2)
      ↓ (duration >= 0.2s)
  [IDLE] → Reset, wait for next

Intensity Curve:
  - 0.0 - 0.3: Rise (linear)
  - 0.3 - 1.0: Fall (linear)
  
  Realistic flash: Quick rise, slow decay
```

**Randomization:**
- Interval: `(1/frequency) × (0.8 + random × 0.4)`
- Intensity: `baseIntensity × (0.8 + random × 0.4)`

## 🌫️ Atmospheric System

### Two-Layer Fog

**Layer 1: Three.js FogExp2**
```typescript
<fogExp2 
  color={fogColor} 
  density={fogDensity × 0.01} 
/>

Math: opacity = 1 - e^(-(distance × density)²)
```

**Layer 2: Custom Shader (Future)**
- Height-based falloff
- Noise modulation
- Distance integration
- Applied in post-processing

**Fog Composition:**
```
Final Fog = Built-in Fog + Custom Shader Fog
  - Built-in: Fast, simple depth fog
  - Custom: Height, noise, artistic control
```

## 🎨 Post-Processing Pipeline

### Effect Chain

```
Scene Render
    ↓
Bloom Pass
  - Extract bright areas (threshold 0.6)
  - Gaussian blur (6 levels)
  - Additive blend
    ↓
Vignette Pass
  - Darken edges
  - Radial gradient
    ↓
Noise Pass
  - Film grain overlay
  - Opacity 0.15
    ↓
Chromatic Aberration Pass
  - RGB channel offset
  - Subtle (0.001, 0.001)
    ↓
Final Output
```

**Performance Considerations:**
- Multi-pass rendering
- Each effect = additional GPU cost
- Mipmapped bloom for efficiency
- Effects run at full resolution

## 🔧 Performance Optimizations

### Component Level

**useMemo Usage:**
```typescript
// Geometry (reused every frame)
const geometry = useMemo(() => {
  return new PlaneGeometry(200, 400, 32, 64);
}, []);

// Material (stable reference)
const material = useMemo(() => {
  return new ShaderMaterial({...});
}, [deps]);
```

**Why:** Prevents recreation on every render

### Shader Level

**GPU Computation:**
```glsl
// BAD: CPU updates position every frame (20,000 particles)
positions[i].y -= speed;

// GOOD: GPU computes in vertex shader
pos.y -= mod(uTime * fallSpeed, 100.0);
```

**Result:** 
- CPU: ~1000 particles = performance issue
- GPU: 20,000+ particles = smooth 60fps

### State Level

**Selective Subscriptions:**
```typescript
// BAD: Re-renders on ANY state change
const state = useSceneStore();

// GOOD: Only re-renders when rainSpeed changes
const rainSpeed = useSceneStore((state) => state.rainSpeed);
```

## 📊 Performance Metrics

### Target Metrics

| Platform | Resolution | FPS | Draw Calls | Particles |
|----------|-----------|-----|------------|-----------|
| Desktop  | 1920×1080 | 60  | < 20       | 20,000    |
| Mobile   | 1280×720  | 30+ | < 20       | 10,000    |

### Bottleneck Analysis

**GPU-Bound (typical):**
- Post-processing effects
- Particle rendering (fill rate)
- Shadow mapping

**CPU-Bound (rare):**
- Too many draw calls
- Complex JavaScript calculations
- Inefficient state updates

### Profiling Tools

1. **Chrome DevTools**
   - Performance tab
   - Frame timing
   - GPU utilization

2. **React DevTools**
   - Profiler
   - Component render counts
   - Why did this render?

3. **Three.js Stats**
   ```typescript
   import Stats from 'three/examples/jsm/libs/stats.module';
   const stats = new Stats();
   document.body.appendChild(stats.dom);
   ```

## 🔐 Type Safety

### TypeScript Patterns

**Strict Typing:**
```typescript
// Component Props
interface CameraRigProps {
  // Props if needed
}

// Store State
interface SceneState {
  rainSpeed: number; // NOT: any
  setRainSpeed: (speed: number) => void;
}

// Refs
const meshRef = useRef<InstancedMesh>(null); // NOT: useRef(null)
const materialRef = useRef<ShaderMaterial>(null);
```

**Shader Imports:**
```typescript
// vite-env.d.ts enables typed imports
import rainVertexShader from './rain.vert'; // string
import rainFragmentShader from './rain.frag'; // string
```

## 🧪 Testing Strategy

### Component Testing

**Unit Tests (Recommended):**
- Store actions and state changes
- Pure utility functions
- Shader uniform calculations

**Integration Tests:**
- Component rendering
- State → Component updates
- User interactions → State changes

### Performance Testing

**Profiling Workflow:**
1. Baseline measurement (vanilla scene)
2. Add feature
3. Measure impact
4. Optimize if needed
5. Repeat

**Metrics to Track:**
- Frame time (target: <16ms)
- Draw calls (target: <20)
- Memory usage
- Shader compile time

## 🚀 Deployment Considerations

### Build Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei'],
        }
      }
    }
  }
});
```

### Asset Optimization

**Textures:**
- Use compressed formats (WebP, Basis)
- Appropriate resolutions (don't use 4K for mobile)
- Lazy load non-critical textures

**Code Splitting:**
- Lazy load debug panel
- Conditional post-processing for low-end devices

## 📚 Extension Points

### Adding New Features

**New Weather Effect:**
1. Create component in `components/Scene/`
2. Add state to `useSceneStore.ts`
3. Add controls to `DebugPanel.tsx`
4. Import in `StormScene.tsx`

**New Shader Effect:**
1. Create `.vert` and `.frag` in `shaders/`
2. Import in component
3. Create `ShaderMaterial`
4. Add uniforms for control

**New Post-Processing:**
1. Import effect from `@react-three/postprocessing`
2. Add to `Effects.tsx`
3. Add controls to debug panel

## 🎯 Best Practices Summary

✅ **DO:**
- Use `useMemo` for geometries and materials
- Leverage GPU for particle animation
- Implement granular state subscriptions
- Add TypeScript types everywhere
- Profile before optimizing

❌ **DON'T:**
- Update positions in JavaScript loops
- Create objects during render
- Subscribe to entire store
- Use `any` types
- Premature optimization

## 📖 Further Reading

- [Three.js Fundamentals](https://threejs.org/manual/)
- [R3F Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
- [GPU Instancing](https://threejs.org/examples/#webgl_instancing_dynamic)
- [Post-processing](https://github.com/pmndrs/postprocessing)

---

**This architecture is designed for scalability, maintainability, and performance.**
