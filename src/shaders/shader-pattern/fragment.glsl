#pragma glslify: cnoise2 = require(glsl-noise/classic/2d.glsl) 
#define PI 3.1415926535897932384626433

varying vec2 vUv;
varying vec2 vPos;

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) * mid.y);
}

float random(in vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453); }

float circleshape(vec2 position, float radius) {
  return step(radius, length(vPos));
}

float rectshape(vec2 position, vec2 size){
  return max(
    step(size.x, abs(position.x - 0.5)),
    step(size.y, abs(position.y - 0.5))
  );
}

void main(){
  float strength = step(0.9, sin(cnoise2(vUv * 10.0) * 20.0));

  strength = clamp(strength, 0.0, 1.0);

  vec3 blackColor = vec3(0.0);

  vec3 uvColor = vec3(vUv, 1.0);

  vec3 mixedColor = mix(blackColor, uvColor, strength);

  float circle = circleshape(vPos, 1.);
  float rect = rectshape(vPos, vec2(1., 0.3));
  vec3 color = vec3(rect);

  // gl_FragColor = vec4(mixedColor, 1.0);   
  gl_FragColor = vec4(color, 1.0);   
}
