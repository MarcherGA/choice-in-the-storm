// Rain particle vertex shader
// Handles GPU-driven instanced rain streaks

uniform float uTime;
uniform float uRainSpeed;
uniform float uWindStrength;
uniform vec3 uCameraPosition;

// Instance attributes
attribute vec3 instanceOffset;
attribute float instanceSpeed;
attribute float instancePhase;

varying float vAlpha;
varying float vDistance;

void main() {
  // Calculate animated position
  float time = uTime * uRainSpeed;
  
  // Individual particle offset with phase variation
  float yOffset = mod(time * instanceSpeed + instancePhase, 50.0) - 25.0;
  
  // Wind influence (horizontal drift)
  float xOffset = sin(time * 0.5 + instancePhase) * uWindStrength;
  
  // Apply instance offset and animation
  vec3 animatedPosition = position;
  animatedPosition.y += yOffset;
  animatedPosition.x += instanceOffset.x + xOffset;
  animatedPosition.z += instanceOffset.z;
  
  // Calculate world position
  vec4 worldPosition = modelMatrix * vec4(animatedPosition, 1.0);
  
  // Distance-based fading
  vDistance = distance(worldPosition.xyz, uCameraPosition);
  
  // Fade out near ground and far from camera
  float groundFade = smoothstep(-20.0, -10.0, worldPosition.y);
  float distanceFade = 1.0 - smoothstep(30.0, 80.0, vDistance);
  
  vAlpha = groundFade * distanceFade * 0.6;
  
  // Project to screen space
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
  
  // Point size based on distance
  gl_PointSize = 2.0 * (1.0 / vDistance) * 100.0;
}
