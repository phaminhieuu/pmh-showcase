varying vec2 vUv;
varying vec3 vPos;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

uniform float move;
uniform float time;
uniform vec2 mouse;

void main(){
  vUv = uv;
  vec3 pos = position;

  // NOT STABLE
  pos.x += sin(move * aSpeed) * 3.;
  pos.y += sin(move * aSpeed) * 3.;
  pos.z = mod(position.z + move * 20. * aSpeed + aOffset, 2000.) - 1000.;


  vec3 stable = position;
  // STABLE
  vec4 mvPosition = modelViewMatrix * vec4(stable, 1.);
  gl_PointSize = 3000. * ( 1. / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vCoordinates = aCoordinates.xy;
  vPos = pos;
}
