import { Sky, OrbitControls } from '@react-three/drei';
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { Water } from 'three-stdlib';
import * as THREE from 'three';

extend({ Water });

const WaterShader: React.FC = () => {
  return (
    <>
      <pointLight position={[100, 100, 100]} />
      <pointLight position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
        <Box />
      </Suspense>
      <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </>
  );
};

const Ocean: React.FC = () => {
  const ref = useRef<any>();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    '/images/water-shader/waternormals.jpeg'
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.outputEncoding
    }),
    // eslint-disable-next-line
    [waterNormals]
  );

  useFrame((_, delta) => {
    ref.current.material.uniforms.time.value += delta;
  });

  // @ts-ignore
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
};

const Box: React.FC = () => {
  const ref = useRef<any>();

  useFrame((state, delta) => {
    ref.current.position.y = 10 + Math.sin(state.clock.elapsedTime) * 20;

    const rotation = ref.current.rotation;
    rotation.x = rotation.y = rotation.z += delta;
  });

  return (
    <mesh ref={ref} scale={20}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

export default WaterShader;
