import {
  Scroll,
  ScrollControls,
  Image as ImageImpl,
  useScroll
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Vector3 } from 'three';
import { damp } from 'three/src/math/MathUtils';

const InfiniteScroll: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ScrollControls pages={4} horizontal infinite>
        <Scroll>
          <Pages />
        </Scroll>
        <Scroll html>
          <section style={{ fontSize: '30vw' }}>
            <h1
              style={{
                position: 'absolute',
                top: '20vh',
                left: '-75vw'
              }}
            >
              home
            </h1>
            <h1
              style={{
                position: 'absolute',
                top: '20vh',
                left: '25vw'
              }}
            >
              to
            </h1>
            <h1
              style={{
                position: 'absolute',
                top: '20vh',
                left: '125vw'
              }}
            >
              be
            </h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '225vw' }}>
              home
            </h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '325vw' }}>
              to
            </h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '425vw' }}>
              be
            </h1>
          </section>
        </Scroll>
      </ScrollControls>
    </Suspense>
  );
};

const Pages: React.FC = () => {
  const { width: w } = useThree((state) => state.viewport);
  return (
    <>
      <Page
        position={new Vector3(-w * 1, 0, 0)}
        urls={[
          '/images/my-love/7.jpeg',
          '/images/my-love/8.jpeg',
          '/images/my-love/9.jpeg'
        ]}
      />
      <Page
        position={new Vector3(w * 0, 0, 0)}
        urls={[
          '/images/my-love/1.jpeg',
          '/images/my-love/2.jpeg',
          '/images/my-love/3.jpeg'
        ]}
      />
      <Page
        position={new Vector3(w * 1, 0, 0)}
        urls={[
          '/images/my-love/4.jpeg',
          '/images/my-love/5.jpeg',
          '/images/my-love/6.jpeg'
        ]}
      />
      <Page
        position={new Vector3(w * 2, 0, 0)}
        urls={[
          '/images/my-love/7.jpeg',
          '/images/my-love/8.jpeg',
          '/images/my-love/9.jpeg'
        ]}
      />
      <Page
        position={new Vector3(w * 3, 0, 0)}
        urls={[
          '/images/my-love/1.jpeg',
          '/images/my-love/2.jpeg',
          '/images/my-love/3.jpeg'
        ]}
      />
      <Page
        position={new Vector3(w * 4, 0, 0)}
        urls={[
          '/images/my-love/4.jpeg',
          '/images/my-love/5.jpeg',
          '/images/my-love/6.jpeg'
        ]}
      />
    </>
  );
};

const Page: React.FC<{
  urls: [string, string, string];
  m?: number;
  position: Vector3;
}> = ({ urls, m = 0.4, position }) => {
  const { width } = useThree((state) => state.viewport);

  const w = width < 10 ? 1.5 / 3 : 1 / 3;

  const s = width * w - m * 2;

  return (
    <group position={position}>
      <Image
        position={new Vector3(-width * w, 0, -1)}
        scale={[s, 5]}
        url={urls[0]}
      />
      <Image position={new Vector3(0, 0, 0)} scale={[s, 5]} url={urls[1]} />
      <Image
        position={new Vector3(width * w, 0, 1)}
        scale={[s, 5]}
        url={urls[2]}
      />
    </group>
  );
};

const Image: React.FC<{
  position: Vector3;
  scale: [number, number];
  url: string;
}> = (props) => {
  const group = useRef<any>();
  const ref = useRef<any>();
  const data = useScroll();

  useFrame((_, delta) => {
    group.current.position.z = damp(
      group.current.position.z,
      Math.max(0, data.delta * 50),
      4,
      delta
    );
    ref.current.material.grayscale = damp(
      ref.current.material.grayscale,
      Math.max(0, 1 - data.delta * 1000),
      4,
      delta
    );
  });

  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  );
};

export default InfiniteScroll;
