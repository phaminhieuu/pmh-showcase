import {
  ContactShadows,
  Environment,
  Instance,
  Instances
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { Suspense, useRef } from 'react';
import { MathUtils } from 'three';

type BubbleProps = {
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
};

const particles = Array.from({ length: 100 }, () => ({
  factor: MathUtils.randInt(20, 100),
  speed: MathUtils.randFloat(0.01, 1),
  xFactor: MathUtils.randFloatSpread(80),
  yFactor: MathUtils.randFloatSpread(40),
  zFactor: MathUtils.randFloatSpread(40)
}));

const HiKeyBubbles: React.FC = () => {
  return (
    <>
      <color attach='background' args={['#f0f0f0']} />
      <fog attach='fog' args={['white', 60, 100]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[100, 10, -50]} intensity={20} castShadow />
      <pointLight position={[-100, -100, -100]} intensity={10} color='red' />
      <Bubbles />
      <ContactShadows
        position={[0, -30, 0]}
        opacity={0.6}
        scale={130}
        blur={1}
        far={100}
      />
      <EffectComposer multisampling={0}>
        <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.1}
          color='red'
        />
      </EffectComposer>
      <Suspense fallback={null}>
        <Environment preset='city' />
      </Suspense>
    </>
  );
};

const Bubbles: React.FC = () => {
  const ref = useRef<any>();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = MathUtils.damp(
      ref.current.rotation.y,
      (-state.mouse.x * Math.PI) / 2,
      2.75,
      delta
    );
  });

  return (
    <Instances
      limit={particles.length}
      ref={ref}
      castShadow
      receiveShadow
      position={[0, 10, 0]}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={0} color='red' />
      {particles.map((data, index) => (
        <Bubble key={index} {...data} />
      ))}
    </Instances>
  );
};

const Bubble: React.FC<BubbleProps> = (props) => {
  const { factor, speed, xFactor, yFactor, zFactor } = props;
  const ref = useRef<any>();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = factor + clock.elapsedTime * (speed / 2);
    ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 5));
    ref.current.position.set(
      Math.cos(t) +
        Math.sin(t * 1) / 10 +
        xFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        yFactor +
        Math.sin((t / 10) * factor) +
        (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        zFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 3) * factor) / 10
    );
  });

  return <Instance ref={ref} />;
};

export default HiKeyBubbles;
