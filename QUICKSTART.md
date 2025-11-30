# Quick Start Guide - Choice in the Storm

Get the storm scene running in under 2 minutes.

## 1️⃣ Install Dependencies

```bash
cd choice-in-the-storm
npm install
```

This will install all required packages (~500MB).

## 2️⃣ Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 3️⃣ Explore the Scene

- **Move your mouse** - Camera follows with smooth parallax
- **Open Leva panel** (top-right) - Adjust all parameters in real-time
- **Watch lightning** - Random flashes illuminate the scene
- **See the rain** - 20,000 GPU-driven particles falling

## 🎛️ Key Parameters to Try

Open the Leva panel and experiment:

1. **Rain Speed** → 40 - See rain fall faster
2. **Lightning Frequency** → 8 - More frequent flashes
3. **Fog Density** → 0.15 - Thicker atmosphere
4. **Wind Strength** → 5 - Rain drifts sideways
5. **Ground Roughness** → 0.05 - More reflective surface

## 🔍 Understanding the Code

### Main Entry Points

1. **`src/App.tsx`** - Canvas setup
2. **`src/components/Scene/StormScene.tsx`** - Scene composition
3. **`src/store/useSceneStore.ts`** - State management

### Performance Components

- **Rain.tsx** - Instanced particle system (GPU-driven)
- **Lightning.tsx** - Randomized light bursts
- **Effects.tsx** - Post-processing pipeline

### Shaders

- **`shaders/rain.vert`** - Particle animation
- **`shaders/rain.frag`** - Particle rendering
- **`shaders/fog.glsl`** - Atmospheric fog

## 🚀 Next Steps

### Add Textures (Optional)

1. Download seamless ground textures from [Poly Haven](https://polyhaven.com/textures)
2. Place in `src/assets/textures/`
3. Update `Ground.tsx` to load them with `useTexture()`

### Extend the Scene

- Add a character model
- Implement walking animation
- Add thunder sound effects
- Create decision points
- Build narrative UI

### Optimize Performance

Current performance targets:
- Desktop: 60 FPS
- Mobile: 30-60 FPS

Optimization tips:
- Reduce `rainCount` for mobile (10,000-15,000)
- Lower `dpr` in `App.tsx` for older devices
- Simplify post-processing effects

## 📊 Performance Monitoring

Open browser DevTools:
- Press **F12**
- Go to **Performance** tab
- Click **Record** and move your mouse
- Check frame times (should be <16ms for 60fps)

## 🐛 Troubleshooting

### Black Screen
- Check browser console (F12) for errors
- Ensure WebGL 2.0 is supported
- Try disabling browser extensions

### Low FPS
- Reduce rain count in Leva panel
- Lower display resolution
- Close other browser tabs

### Leva Panel Not Showing
- Check that `DebugPanel.tsx` is imported in `App.tsx`
- Clear browser cache and reload

## 🎨 Customization Ideas

### Change Storm Color Palette

In `Atmosphere.tsx`:
```tsx
<ambientLight intensity={0.3} color="#4a5a6a" /> // Change this
```

In `useSceneStore.ts`:
```tsx
fogColor: '#1a1a2e', // Change default fog color
```

### Adjust Camera Position

In `App.tsx`:
```tsx
camera={{ position: [0, 3, 10] }} // Change starting position
```

In `CameraRig.tsx`:
```tsx
const targetPosition = new Vector3(0, 3, 10); // Change target
```

### Modify Rain Appearance

In `shaders/rain.vert`:
```glsl
float fallSpeed = uRainSpeed * instanceSpeed; // Adjust speed
```

In `shaders/rain.frag`:
```glsl
vec3 rainColor = vec3(0.8, 0.85, 0.95); // Change color
```

## ✅ Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Dev server running at localhost:3000
- [ ] Scene renders with dark background
- [ ] Rain particles visible and falling
- [ ] Lightning flashes occur randomly
- [ ] Camera follows mouse movement
- [ ] Leva panel appears and controls work
- [ ] Frame rate stable (check browser DevTools)

## 📚 Learn More

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [GLSL Shader Tutorial](https://thebookofshaders.com/)
- [Leva Controls](https://github.com/pmndrs/leva)

---

**Ready to build? Start with `npm run dev` and enjoy the storm! ⚡🌧️**
