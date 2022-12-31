import {
  BakeShadows,
  CycleRaycast,
  softShadows,
  useCursor
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

interface Props {
  name: string;
  index: number;
}

const RaycastCyclingStair: React.FC = () => {
  const [{ objects, cycle }, set] = useState({ objects: [], cycle: 0 });

  return (
    <>
      <Stage />
      {Array.from({ length: 12 }, (_, i) => (
        <Stair key={i} name={'stair-' + (i + 1)} index={i} />
      ))}

      {/* This component cycles through the raycast intersections, combine it with event.stopPropagation! */}
      <CycleRaycast
        // eslint-disable-next-line
        // @ts-ignore
        onChanged={(objects, cycle) => {
          // eslint-disable-next-line
          // @ts-ignore
          set({ objects, cycle });
        }}
      />
    </>
  );
};

const Stair: React.FC<Props> = ({ index }) => {
  const ref = useRef<any>();

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(
      hovered ? 1 + Math.sin(clock.elapsedTime * 10) / 50 : 1
    );
  });

  // Sets document.body.style.cursor: useCursor(flag, onPointerOver = 'pointer', onPointerOut = 'auto')
  useCursor(hovered);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, index / Math.PI / 2]}
      position={[
        2 - Math.sin(index / 5) * 5,
        index * 0.5,
        2 - Math.cos(index / 5) * 5
      ]}
      ref={ref}
      receiveShadow
      castShadow
      onClick={(e) => {
        e.stopPropagation();
        setClicked(!clicked);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 6, 0.075]} />
      <meshStandardMaterial
        roughness={1}
        transparent
        opacity={0.6}
        color={clicked ? 'violet' : hovered ? 'aquamarine' : 'white'}
      />
    </mesh>
  );
};

const Stage: React.FC = () => {
  return (
    <>
      {/* Fill */}
      <ambientLight intensity={0.5} />

      {/* Main */}
      <directionalLight
        position={[1, 10, -2]}
        intensity={1}
        shadow-camera-far={70}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize={[512, 512]}
        castShadow
      />

      {/* Strip */}
      <directionalLight position={[-10, -10, 2]} intensity={3} />

      {/* Ground */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.75, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* This freezes the shadow map, which is fast, but the model has to be static  */}
      <BakeShadows />
    </>
  );
};

softShadows();

export default RaycastCyclingStair;
