import {
  Scroll,
  ScrollControls,
  useScroll,
  Image as ImageImpl
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { Color, Vector3 } from 'three';

const ScrollControlsMinimap: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ScrollControls damping={4} pages={3}>
        <Scroll>
          <Images />
        </Scroll>
        <Html />
      </ScrollControls>
    </Suspense>
  );
};

const Images: React.FC = () => {
  const { width: w, height: h } = useThree((state) => state.viewport);
  const data = useScroll();

  const ref = useRef<any>();

  useFrame(() => {
    const group = ref.current;
    group.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 3;
    group.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.children[4].material.zoom = 1 + data.range(1.25 / 3, 1 / 3) / 1;
    group.children[5].material.zoom = 1 + data.range(1.8 / 3, 1 / 3) / 3;
    group.children[5].material.grayscale = 1 - data.range(1.6 / 3, 1 / 3);
    group.children[6].material.zoom = 1 + (1 - data.range(2 / 3, 1 / 3)) / 3;
  });

  return (
    <group ref={ref}>
      <Image
        position={new Vector3(-2, 0, 0)}
        scale={[4, h]}
        url='/images/my-love/1.jpeg'
      />
      <Image
        position={new Vector3(2, 0, 1)}
        scale={3}
        url='/images/my-love/6.jpeg'
      />
      <Image
        position={new Vector3(-2.3, -h, 2)}
        scale={[1, 3]}
        url='/images/my-love/2.jpeg'
      />
      <Image
        position={new Vector3(-0.6, -h, 3)}
        scale={[1, 2]}
        url='/images/my-love/8.jpeg'
      />
      <Image
        position={new Vector3(0.75, -h, 3.5)}
        scale={1.5}
        url='/images/my-love/4.jpeg'
      />
      <Image
        position={new Vector3(0, -h * 1.5, 2.5)}
        scale={[1.5, 3]}
        url='/images/my-love/3.jpeg'
      />
      <Image
        position={new Vector3(0, -h * 2 - h / 4, 0)}
        scale={[w, h / 2]}
        url='/images/my-love/14.jpeg'
      />
    </group>
  );
};

interface Props {
  url: string;
  position: Vector3;
  scale: [number, number] | number;
}

const Image: React.FC<Props> = ({ position, scale, url }) => {
  const ref = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    ref.current.material.color.lerp(
      new Color(hovered ? 'white' : '#ccc'),
      hovered ? 0.4 : 0.05
    );
  });

  return (
    <ImageImpl
      url={url}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={position}
      scale={scale}
    />
  );
};

const Html: React.FC = () => {
  return (
    <Scroll html>
      <h1
        style={{
          position: 'absolute',
          top: '60vh',
          left: '0.5em',
          fontSize: '20em'
        }}
      >
        home
      </h1>
      <h1
        style={{
          position: 'absolute',
          top: '120vh',
          left: '40vw',
          fontSize: '20em'
        }}
      >
        sweet
      </h1>
      <h1
        style={{
          position: 'absolute',
          top: '198.5vh',
          left: '0.5vw',
          fontSize: '40vw'
        }}
      >
        home
      </h1>
    </Scroll>
  );
};

export default ScrollControlsMinimap;
