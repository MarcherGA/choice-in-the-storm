// Rain particle fragment shader
// Renders individual rain streaks with alpha blending

varying float vAlpha;
varying float vDistance;

void main() {
  // Create elongated streak shape
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  // Vertical elongation for streak effect
  float streak = smoothstep(0.5, 0.0, abs(coord.x) * 2.0);
  streak *= smoothstep(0.8, 0.0, abs(coord.y));
  
  // Final alpha with streak shape
  float alpha = streak * vAlpha;
  
  // Discard fully transparent pixels
  if (alpha < 0.01) discard;
  
  // White/light blue rain color
  vec3 rainColor = vec3(0.85, 0.9, 1.0);
  
  gl_FragColor = vec4(rainColor, alpha);
}
