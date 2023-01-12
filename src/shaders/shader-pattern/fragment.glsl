varying vec2 vUv;

float random(in vec2 st){ return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453); }

void main(){
  float strength = vUv.x;

  gl_FragColor = vec4(vec3(strength), 1.0);   
}
