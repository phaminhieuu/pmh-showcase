import { shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { MathUtils } from 'three';

export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: null,
    tex2: null,
    disp: null
  },
  ` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  ` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`
);

extend({ ImageFadeMaterial });

const FadingImage: React.FC = () => {
  const ref = useRef<any>();
  const [texture1, texture2, dispTexture] = useTexture([
    '/images/spherical-word.webp',
    '/images/ballpit.webp',
    '/images/hi-key-bubbles.webp'
  ]);

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    ref.current.dispFactor = MathUtils.lerp(
      ref.current.dispFactor,
      hovered ? 1 : 0,
      0.075
    );
  });

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry />
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <imageFadeMaterial
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        toneMapped={false}
      />
    </mesh>
  );
};

const ShaderPictures: React.FC = () => {
  return <FadingImage />;
};

export default ShaderPictures;
