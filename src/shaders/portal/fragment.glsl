#pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
varying vec2 vUv;

void main() {
  // Displace the UV
  vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, uTime * 0.1));
  vec2 some = vUv;

  // Perlin noise
  float strength = cnoise3(vec3(displacedUv * 5.0, uTime * 0.2));

  // Outer glow
  float outerGlow = distance(vUv, vec2(0.5)) * 4.0 - 1.4;
  strength += outerGlow;

  // Apply cool step
  strength += step(-0.2, strength) * 0.8;

  // Clamp the value from 0 to 1
  strength = clamp(strength, 0.0, 1.0);

  // Final color
  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}
