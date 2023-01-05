import {
  Sparkles,
  OrbitControls,
  useTexture,
  useGLTF
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { AdditiveBlending, Color } from 'three';
// @ts-ignore
import fragmentShader from '../../shaders/portal/fragment.glsl';

// @ts-ignore
import vertexShader from '../../shaders/portal/vertex.glsl';

const Portal: React.FC = () => {
  const scale = Array.from({ length: 10 }, () => 0.5 + Math.random() * 4);

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

  const bakedTexture = useTexture('/images/portal/baked-02.jpeg');
  const { nodes } = useGLTF('/images/portal/portal-2.glb');

  const model: any = nodes;

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    portalMaterial.current.uniforms.uTime.value = elapsedTime;
  });

  useLayoutEffect(() => {
    if (!portalMaterial) return;
    const uniforms = portalMaterial.current.uniforms;
    uniforms.uTime = { value: 0 };
    uniforms.uColorStart = { value: new Color('hotpink') };
    uniforms.uColorEnd = { value: new Color('white') };
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
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
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
