import { useGLTF } from '@react-three/drei';
import { type PrimitiveProps } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';
import useGetMaterial from 'hooks/bruno-simon-folio/material/useGetMaterial';

interface Props {
  path: string;
}

const Model: React.FC<Props> = ({ path }) => {
  const model = useRef<PrimitiveProps>(null);
  const gltf = useGLTF(path);

  const getMaterial = useGetMaterial();

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      child.material = getMaterial(child.name);
    });
  }, [gltf, getMaterial]);

  return <primitive object={gltf.scene} ref={model} />;
};

export default Model;
