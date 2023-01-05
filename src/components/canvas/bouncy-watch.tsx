import {
  ContactShadows,
  Environment,
  Html,
  PresentationControls,
  useGLTF
} from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const BouncyWatch: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-mapSize={[512, 512]}
        castShadow
      />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Watch
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.25, 0]}
          scale={0.003}
        />
      </PresentationControls>
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.75}
        scale={10}
        blur={2.5}
        far={4}
      />
      <Environment preset='city' />
    </>
  );
};

const Watch: React.FC<GroupProps> = (props) => {
  const ref = useRef<any>();
  const { nodes, materials } = useGLTF('/images/bouncy-watch/watch-v1.glb');

  const nodesObj: any = nodes;
  const materialsObj: any = materials;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = -Math.PI / 1.75 + Math.cos(t / 4) / 8;
    ref.current.rotation.y = Math.sin(t / 4) / 8;
    ref.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        geometry={nodesObj.Object005_glass_0.geometry}
        material={materialsObj.glass}
      >
        <Html
          scale={100}
          rotation={[Math.PI / 2, 0, 0]}
          position={[180, -350, 50]}
          transform
          occlude
        >
          <div className='annotation'>
            15.000 $ <span style={{ fontSize: '1.5em' }}>🥲</span>
          </div>
        </Html>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodesObj.Object006_watch_0.geometry}
        material={materialsObj.watch}
      />
    </group>
  );
};

export default BouncyWatch;
