import {
  Sparkles,
  OrbitControls,
  useTexture,
  useGLTF
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { AdditiveBlending, Color } from 'three';
// import fragmentShader from '../../shaders/portal/fragment.glsl';
// import vertexShader from '../../shaders/portal/vertex.glsl';

// import glsl from 'babel-plugin-glsl/macro';

const Portal: React.FC = () => {
  const scale = Array.from({ length: 20 }, () => 0.5 + Math.random() * 4);

  console.log(scale);

  return (
    <>
      {scale.map((num, index) => (
        <Sparkles
          key={index}
          count={scale.length}
          size={num}
          position={[0, 0.9, 0]}
          scale={[4, 1.5, 4]}
          speed={0.3}
        />
      ))}
      <Model />
      <OrbitControls />
    </>
  );
};

const Model: React.FC = (props) => {
  const portalMaterial = useRef<any>();

  const bakedTexture = useTexture('/images/baked-02.jpeg');
  const { nodes } = useGLTF('/images/portal-2.glb');

  const model: any = nodes;

  useFrame((delta) => (portalMaterial.current.uTime += delta));

  useLayoutEffect(() => {
    if (!portalMaterial) return;
    const uniforms = portalMaterial.current.uniforms;
    uniforms.uTime = 0;
    uniforms.uColorStart = new Color('hotpink');
    uniforms.uColorEnd = new Color('white');
  }, []);

  return nodes ? (
    <group {...props} dispose={null}>
      <mesh
        geometry={model.portalCircle.geometry}
        position={[0, 0.78, 1.6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <shaderMaterial
          ref={portalMaterial}
          blending={AdditiveBlending}
          // fragmentShader={fragmentShader}
          // vertexShader={vertexShader}
        />
      </mesh>
      <mesh
        geometry={model.lampLightL.geometry}
        material-color='#f0bf94'
        position={[0.89, 1.07, -0.14]}
        scale={[0.07, 0.11, 0.07]}
      />
      <mesh
        geometry={model.lampLightR.geometry}
        material-color='#f0bf94'
        position={[-0.98, 1.07, -0.14]}
        scale={[-0.07, 0.11, 0.07]}
      />
      <mesh
        geometry={model.baked.geometry}
        position={[0.9, 0.34, -1.47]}
        rotation={[0, 0.14, 0]}
      >
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
    </group>
  ) : null;
};

export default Portal;
