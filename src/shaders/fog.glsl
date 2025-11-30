// Atmospheric volumetric fog shader
// Provides depth-based and height-based fog with noise modulation

uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogHeight;
uniform float uTime;
uniform sampler2D tDepth;
uniform vec2 uResolution;
uniform mat4 uInverseProjectionMatrix;
uniform mat4 uInverseViewMatrix;

varying vec2 vUv;

// Simple 3D noise function
float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float n = i.x + i.y * 57.0 + i.z * 113.0;
  
  float res = mix(
    mix(
      mix(fract(sin(n) * 43758.5453), fract(sin(n + 1.0) * 43758.5453), f.x),
      mix(fract(sin(n + 57.0) * 43758.5453), fract(sin(n + 58.0) * 43758.5453), f.x),
      f.y
    ),
    mix(
      mix(fract(sin(n + 113.0) * 43758.5453), fract(sin(n + 114.0) * 43758.5453), f.x),
      mix(fract(sin(n + 170.0) * 43758.5453), fract(sin(n + 171.0) * 43758.5453), f.x),
      f.y
    ),
    f.z
  );
  
  return res;
}

void main() {
  // Sample scene depth
  float depth = texture2D(tDepth, vUv).x;
  
  // Reconstruct world position from depth
  vec4 ndc = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 viewPos = uInverseProjectionMatrix * ndc;
  viewPos /= viewPos.w;
  vec4 worldPos = uInverseViewMatrix * viewPos;
  
  // Calculate distance-based fog
  float distance = length(viewPos.xyz);
  float distanceFog = 1.0 - exp(-uFogDensity * distance * 0.01);
  
  // Calculate height-based fog
  float height = worldPos.y;
  float heightFog = exp(-max(0.0, height) / uFogHeight);
  
  // Combine fog factors
  float fogAmount = distanceFog * heightFog;
  
  // Add noise modulation for atmospheric variation
  vec3 noiseCoord = worldPos.xyz * 0.02 + vec3(uTime * 0.05, 0.0, 0.0);
  float noiseValue = noise3D(noiseCoord);
  fogAmount *= (0.8 + noiseValue * 0.4);
  
  // Clamp fog amount
  fogAmount = clamp(fogAmount, 0.0, 1.0);
  
  // Output fog contribution
  gl_FragColor = vec4(uFogColor, fogAmount * 0.5);
}
