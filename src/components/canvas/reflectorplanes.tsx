import {
  CameraShake,
  OrbitControls,
  Reflector,
  useTexture
} from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

const Reflectorplanes: React.FC = () => {
  return (
    <>
      <color attach='background' args={['black']} />
      <ambientLight />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <Suspense fallback={null}>
        <Rig>
          <Triangle
            color='#ff2060'
            scale={0.009}
            rotation={[0, 0, Math.PI / 3]}
          />
          <Triangle
            color='cyan'
            scale={0.009}
            position={[2, 0, -2]}
            rotation={[0, 0, Math.PI / 3]}
          />
          <Triangle
            color='orange'
            scale={0.009}
            position={[-2, 0, -2]}
            rotation={[0, 0, Math.PI / 3]}
          />
          <Triangle
            color='white'
            scale={0.009}
            position={[0, 2, -10]}
            rotation={[0, 0, Math.PI / 3]}
          />
          <Ground />
        </Rig>
        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={0.6}
          />
          <Bloom
            kernelSize={KernelSize.HUGE}
            luminanceThreshold={0}
            luminanceSmoothing={0}
            intensity={0.5}
          />
        </EffectComposer>
        <CameraShake
          yawFrequency={0.2}
          pitchFrequency={0.2}
          rollFrequency={0.2}
        />
      </Suspense>
    </>
  );
};

const Triangle = ({ color, ...props }: any) => {
  const ref = useRef<any>();
  const [r] = useState(() => Math.random() * 10000);
  useFrame(
    (_) =>
      (ref.current.position.y = -1.75 + Math.sin(_.clock.elapsedTime + r) / 10)
  );
  const { paths: [path] } = useLoader(SVGLoader, '/images/reflectorplanes/triangle.svg') // prettier-ignore
  const geom = useMemo(
    () =>
      SVGLoader.pointsToStroke(
        path?.subPaths[0].getPoints(),
        path?.userData?.style
      ),
    // eslint-disable-next-line
    []
  );
  return (
    <group ref={ref}>
      <mesh geometry={geom} {...props}>
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
};

const Rig: React.FC<{ children: ReactNode[] }> = ({ children }) => {
  const ref = useRef<any>();
  const vec = new THREE.Vector3();
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, 0, 3.5), 0.05);
    ref.current.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.1, 0), 0.1);
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      (-mouse.x * Math.PI) / 20,
      0.1
    );
  });

  return <group ref={ref}>{children}</group>;
};

const Ground = () => {
  const [floor, normal] = useTexture([
    '/images/reflectorplanes/SurfaceImperfections003_1K_var1.jpg',
    '/images/reflectorplanes/SurfaceImperfections003_1K_Normal.jpg'
  ]);
  const vec2 = new THREE.Vector2(2, 2);
  return (
    <mesh>
      <Reflector
        resolution={1024}
        args={[8, 8]}
        mirror={1}
        blur={[500, 100]}
        mixBlur={12}
        mixStrength={1.5}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position-y={-0.8}
      >
        {(Material, props) => (
          // eslint-disable-next-line
          // @ts-ignore
          <Material
            color='#f0f0f0'
            metalness={0}
            roughnessMap={floor}
            normalMap={normal}
            normalScale={vec2}
            {...props}
          />
        )}
      </Reflector>
    </mesh>
  );
};

export default Reflectorplanes;
