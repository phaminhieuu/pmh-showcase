import { Image, Scroll, ScrollControls, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { damp } from 'three/src/math/MathUtils';
import { useSnapshot } from 'valtio';
import { state } from '../../utils/horizontal-tiles';
import * as THREE from 'three';

const InfiniteScroll: React.FC = () => {
  return <Items />;
};

const Items: React.FC<{ w?: number; gap?: number }> = ({
  w = 0.7,
  gap = 0.15
}) => {
  const { urls } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      horizontal
      damping={10}
      pages={(width - xW + urls.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {urls.map((url, index) => (
          <Item
            key={index}
            index={index}
            position={new Vector3(index * xW, 0, 0)}
            scale={[w, 4]}
            url={url}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
};

interface Props {
  index: number;
  position: Vector3;
  scale: [number, number];
  url: string;
}

const Item: React.FC<Props> = ({ index, position, scale, url }) => {
  const ref = useRef<any>();
  const scroll = useScroll();

  const { clicked, urls } = useSnapshot(state);

  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    state.clicked = index === clicked ? null : index;
  };

  const handleOver = () => {
    setHovered(true);
  };

  const handleOut = () => {
    setHovered(false);
  };

  useFrame((_, delta) => {
    const y = scroll.curve(
      index / urls.length - 1.5 / urls.length,
      4 / urls.length
    );
    const mesh = ref.current;
    const material = mesh.material;
    material.scale[1] = mesh.scale.y = damp(
      mesh.scale.y,
      clicked === index ? 5 : 4 + y,
      8,
      delta
    );

    material.scale[0] = mesh.scale.x = damp(
      mesh.scale.x,
      clicked === index ? 4.7 : scale[0],
      6,
      delta
    );

    if (clicked !== null && index < clicked)
      mesh.position.x = damp(mesh.position.x, position.x - 2, 6, delta);

    if (clicked !== null && index > clicked)
      mesh.position.x = damp(mesh.position.x, position.x + 2, 6, delta);

    if (clicked === null || clicked === index)
      mesh.position.x = damp(mesh.position.x, position.x, 6, delta);

    material.grayscale = damp(
      mesh.material.grayscale,
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      6,
      delta
    );

    material.color.lerp(
      new THREE.Color().set(hovered || clicked === index ? 'white' : '#aaa'),
      hovered ? 0.3 : 0.1
    );
  });

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      url={url}
      ref={ref}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    />
  );
};

const Minimap: React.FC = () => {
  const [material] = useState(
    () => new THREE.LineBasicMaterial({ color: 'white' })
  );

  const [geometry] = useState(() =>
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0.5, 0)
    ])
  );

  const ref = useRef<any>();
  const scroll = useScroll();
  const { urls } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);

  useFrame((_, delta) => {
    ref.current.children.forEach((child: any, index: number) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(
        index / urls.length - 1.5 / urls.length,
        4 / urls.length
      );
      child.scale.y = damp(child.scale.y, 0.1 + y / 6, 8, delta);
    });
  });

  return (
    <group ref={ref}>
      {urls.map((_, index) => (
        <line
          key={index}
          // @ts-ignore
          geometry={geometry}
          material={material}
          position={[index * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
};

export default InfiniteScroll;
