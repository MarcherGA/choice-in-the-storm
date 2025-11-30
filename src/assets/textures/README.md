# Texture Assets

This directory is intended for PBR texture maps for the ground material.

## Required Textures (Optional)

The ground component currently works with procedural materials, but you can enhance visual quality by adding:

1. **ground_diffuse.jpg** - Base color/albedo map
2. **ground_roughness.jpg** - Surface roughness (0=smooth, 1=rough)
3. **ground_normal.jpg** - Normal map for surface detail

## Recommended Specifications

- **Resolution**: 2048x2048 or 1024x1024
- **Format**: JPG or PNG
- **Tiling**: Seamless textures work best
- **Style**: Dark, wet asphalt or concrete

## Free Texture Resources

- [Poly Haven](https://polyhaven.com/textures)
- [3D Textures](https://3dtextures.me/)
- [CC0 Textures](https://cc0textures.com/)

## Integration

Once textures are added, update `src/components/Scene/Ground.tsx`:

```tsx
const [diffuse, roughness, normal] = useTexture([
  '/src/assets/textures/ground_diffuse.jpg',
  '/src/assets/textures/ground_roughness.jpg', 
  '/src/assets/textures/ground_normal.jpg',
]);
```

Then assign them to the material:
```tsx
<meshStandardMaterial
  map={diffuse}
  roughnessMap={roughness}
  normalMap={normal}
  // ... other props
/>
```
