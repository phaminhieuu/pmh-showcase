uniform float time;
uniform sampler2D t;
varying vec2 vUv;
varying vec3 vPosition;


void main() {
  vec4 tt = texture2D(t, vUv);
	gl_FragColor = tt;
  if(gl_FragColor.r < 0.1 && gl_FragColor.b < 0.1 && gl_FragColor.g < 0.1) discard;
  // gl_FragColor = vec4(1.,0.,0.,0.5);
}
