import { Environment, MeshReflectorMaterial } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';

const GOLDENRATIO = 1.61803398875;

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const images: ImageProps[] = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970) },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(327482)
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(325185)
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(358574)
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(227675)
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(911738)
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(1738986)
  }
];

const ImageGallery: React.FC = () => {
  return (
    <>
      <color attach='background' args={['#191920']} />
      <fog attach='fog' args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Frames images={images} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            mirror={0}
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={50}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color='#050505'
            metalness={0.5}
          />
        </mesh>
        <Environment preset='city' />
      </group>
    </>
  );
};

type ImageProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  url: string;
};

const Frames: React.FC<{ images: ImageProps[] }> = ({ images }) => {
  const ref = useRef<any>();
  // const clicked = useRef();

  useEffect(() => {
    // clicked.current = ref.current.getObjectByName(params?.id);
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* {images.map((props) => ( */}
      {/*   <Frame key={props.url} {...props} /> */}
      {/* ))} */}
    </group>
  );
};

// const Frame: React.FC<ImageProps> = ({ position, rotation }) => {
//   console.log(props);
//   const [hovered, setHovered] = useState(false);
//   const [rnd] = useState(() => Math.random());
//   return <></>;
// };

export default ImageGallery;
