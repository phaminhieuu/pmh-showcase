import { TrackballControls, Text } from '@react-three/drei';
import type { ReactNode } from 'react';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import randomWord from 'random-words';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import type { Vector3 } from 'three';

interface Props {
  children: ReactNode;
  position: Vector3 | undefined;
}

const SphericalWord: React.FC = () => {
  return (
    <>
      <mesh>
        <fog attach='fog' args={['#202025', 0, 80]} />
        <Cloud count={8} radius={20} />
      </mesh>

      <TrackballControls />
    </>
  );
};

const Cloud = ({ count = 4, radius = 20 }) => {
  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push({
          pos: new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j)
          ) as Vector3,
          word: randomWord(1)[0]
        });
    return temp;
  }, [count, radius]);

  return (
    <>
      {words.map((w, index) => (
        <Word key={index} position={w.pos}>
          {w.word}
        </Word>
      ))}
    </>
  );
};

const Word: React.FC<Props> = ({ children, position }) => {
  const color = new THREE.Color();
  const ref = useRef<any>();

  const [hovered, setHovered] = useState(false);

  const over = (e: ThreeEvent<PointerEvent>) => (
    e.stopPropagation(), setHovered(true)
  );

  const out = () => setHovered(false);
  const fontProps = {
    // font: '/fonts/Inter-Bold.woff',
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false
  };

  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Tie component to the render-loop
  useFrame(({ camera }) => {
    if (!ref.current) return;
    // Make text face the camera
    ref.current.quaternion.copy(camera.quaternion);
    // Animate font color
    ref.current.material.color.lerp(
      color.set(hovered ? '#fa2720' : 'white'),
      0.1
    );
  });

  return (
    <Text
      ref={ref}
      onPointerOver={over}
      onPointerOut={out}
      position={position}
      {...fontProps}
    >
      {children}
    </Text>
  );
};

export default SphericalWord;
