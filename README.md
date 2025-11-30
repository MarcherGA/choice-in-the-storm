# Choice in the Storm

A high-performance, cinematic storm scene prototype built with React Three Fiber, TypeScript, and custom GLSL shaders.

## 🎯 Overview

This prototype demonstrates a realistic atmospheric storm environment featuring:

- **GPU-driven rain system** - 20,000+ instanced particles with custom shaders
- **Dynamic lightning** - Randomized intensity bursts with realistic timing
- **Two-layer fog system** - Exponential fog + custom shader-based atmospheric effects
- **Cinematic camera** - Smooth pointer-based parallax with damped movement
- **PBR ground material** - Wet reflective surface with normal/roughness mapping
- **Post-processing pipeline** - Bloom, vignette, noise, and chromatic aberration
- **Real-time debug controls** - Leva-based parameter tweaking

## 🛠️ Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety and developer experience
- **React Three Fiber** - React renderer for Three.js
- **Drei** - R3F helpers and abstractions
- **Post-processing** - Advanced visual effects
- **Zustand** - Lightweight state management
- **Leva** - GUI controls for debugging
- **GLSL** - Custom shaders for advanced effects

## 📁 Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component
├── styles.css                  # Global styles
├── store/
│   └── useSceneStore.ts        # Zustand state management
├── components/
│   ├── Scene/
│   │   ├── StormScene.tsx      # Main scene composition
│   │   ├── CameraRig.tsx       # Camera controller
│   │   ├── Ground.tsx          # PBR ground plane
│   │   ├── Rain.tsx            # GPU particle system
│   │   ├── Lightning.tsx       # Dynamic lighting
│   │   ├── Atmosphere.tsx      # Fog and ambient light
│   │   └── Effects.tsx         # Post-processing
│   └── UI/
│       └── DebugPanel.tsx      # Leva debug controls
└── shaders/
    ├── rain.vert               # Rain vertex shader
    ├── rain.frag               # Rain fragment shader
    └── fog.glsl                # Atmospheric fog shader
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 🎮 Controls

Use the **Leva panel** (top-right) to adjust parameters in real-time:

### Rain Parameters
- **Rain Speed** - Vertical fall velocity
- **Rain Count** - Number of particles (performance impact)
- **Wind Strength** - Horizontal drift amount

### Lightning Parameters
- **Flash Frequency** - Strikes per second
- **Flash Intensity** - Brightness of lightning

### Fog Parameters
- **Fog Density** - Overall atmospheric thickness
- **Fog Height** - Vertical falloff amount

### Camera Parameters
- **Camera Damping** - Smoothness of parallax movement

### Visual Parameters
- **Ground Roughness** - Wetness/reflection amount
- **Scene Brightness** - Global illumination multiplier

## 🏗️ Architecture Principles

### Performance Optimization
- ✅ Instanced geometries for rain (20,000+ particles)
- ✅ GPU-driven animation via shaders
- ✅ Memoized materials and geometries
- ✅ Minimal draw calls
- ✅ Efficient state management with Zustand

### Code Quality
- ✅ Strict TypeScript with no `any` types
- ✅ Modular component architecture
- ✅ Separation of concerns (rendering/state/shaders)
- ✅ Clean React patterns (hooks only)
- ✅ Comprehensive comments

### Rendering Pipeline
1. **Scene Setup** - Camera, lights, fog
2. **Geometry** - Ground plane, instanced rain
3. **Shading** - Custom GLSL for rain, PBR for ground
4. **Post-processing** - Bloom, vignette, noise, CA

## 🎨 Shader Details

### Rain Shader (`rain.vert` / `rain.frag`)
- Instanced particle system with per-particle attributes
- GPU-driven vertical animation with wind displacement
- Distance and ground-based alpha fading
- Vertical gradient for realistic streak appearance

### Fog Shader (`fog.glsl`)
- Exponential height-based falloff
- Distance-based density
- Animated noise modulation
- Custom depth integration

## 📊 Performance Targets

- **Desktop**: 60 FPS @ 1080p
- **Mobile**: 30-60 FPS @ 720p
- **Draw Calls**: < 20
- **Particles**: 20,000+

## 🔧 Configuration

Edit `src/store/useSceneStore.ts` to change default values.

## 🎯 Future Enhancements

Potential expansions for this prototype:

- [ ] Player character with walking animation
- [ ] Path/road geometry with waypoints
- [ ] Wind-blown vegetation (grass, trees)
- [ ] Thunder sound effects synced with lightning
- [ ] Particle splashes on ground impact
- [ ] Advanced weather transitions
- [ ] Decision point UI overlays
- [ ] Save/load scene configurations

## 📝 Notes

### Texture Files
The ground component references texture paths that are currently handled procedurally. To use real textures:

1. Add texture files to `src/assets/textures/`:
   - `ground_diffuse.jpg`
   - `ground_roughness.jpg`
   - `ground_normal.jpg`

2. Update `Ground.tsx` to use `useTexture`:
   ```tsx
   const [diffuse, roughness, normal] = useTexture([
     '/src/assets/textures/ground_diffuse.jpg',
     '/src/assets/textures/ground_roughness.jpg',
     '/src/assets/textures/ground_normal.jpg',
   ]);
   ```

### Browser Compatibility
- Modern browsers with WebGL 2.0 support required
- Tested on Chrome, Firefox, Safari, Edge

## 📄 License

This is a prototype project for demonstration purposes.

## 🤝 Contributing

This is a baseline prototype. Fork and extend as needed for your projects.

---

**Built with ⚡ by Itay | High-performance 3D web experiences**
