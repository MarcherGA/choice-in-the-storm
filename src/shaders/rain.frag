// Rain particle fragment shader
// Renders individual rain streaks with alpha blending

varying float vAlpha;
varying float vDistance;

void main() {
  // Create elongated vertical streak shape
  vec2 coord = gl_PointCoord - vec2(0.5);

  // Create thin vertical line streak (not a square)
  float horizontalFalloff = smoothstep(0.15, 0.0, abs(coord.x));
  float verticalLength = smoothstep(0.8, 0.0, coord.y + 0.3); // Long vertical streak

  float streak = horizontalFalloff * verticalLength;

  // Make streak more visible
  streak = pow(streak, 0.4);

  // Final alpha
  float alpha = streak * vAlpha;

  // Discard fully transparent pixels
  if (alpha < 0.02) discard;

  // Bright white rain color
  vec3 rainColor = vec3(0.9, 0.95, 1.0);

  gl_FragColor = vec4(rainColor, alpha * 2.5);
}
