import { Scroll, ScrollControls, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

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
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[4, height, 1]} url='/img1.jpg' />
      <Image position={[2, 0, 1]} scale={3} url='/img6.jpg' />
      <Image position={[-2.3, -height, 2]} scale={[1, 3, 1]} url='/trip2.jpg' />
      <Image position={[-0.6, -height, 3]} scale={[1, 2, 1]} url='/img8.jpg' />
      <Image position={[0.75, -height, 3.5]} scale={1.5} url='/trip4.jpg' />
      <Image
        position={[0, -height * 1.5, 2.5]}
        scale={[1.5, 3, 1]}
        url='/img3.jpg'
      />
      <Image
        position={[0, -height * 2 - height / 4, 0]}
        scale={[width, height / 2, 1]}
        url='/img7.jpg'
      />
    </group>
  );
};

const Image: React.FC<Props> = () => {};

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
        to
      </h1>
      <h1
        style={{
          position: 'absolute',
          top: '120vh',
          left: '60vw',
          fontSize: '20em'
        }}
      >
        be
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
