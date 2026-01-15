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
  float groundFade = smoothstep(-20.0, -5.0, worldPosition.y);
  float distanceFade = 1.0 - smoothstep(40.0, 100.0, vDistance);

  // INCREASED base alpha for better visibility
  vAlpha = groundFade * distanceFade * 0.9;

  // Project to screen space
  gl_Position = projectionMatrix * viewMatrix * worldPosition;

  // Larger point size for better visibility
  gl_PointSize = max(3.0, 4.0 * (1.0 / vDistance) * 100.0);
}
