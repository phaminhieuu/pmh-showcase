import { Canvas } from '@react-three/fiber';
import { Loader, Preload } from '@react-three/drei';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  [key: string]: any;
}

const Scene: React.FC<Props> = ({ children, ...props }) => {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <>
      <Canvas {...props}>
        <directionalLight intensity={0.75} />
        <ambientLight intensity={0.75} />
        {children}
        <Preload all />
      </Canvas>
      <Loader />
    </>
  );
};

export default Scene;
