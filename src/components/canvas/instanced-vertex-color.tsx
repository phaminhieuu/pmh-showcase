import { Effects } from '@react-three/drei';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { SSAOPass, UnrealBloomPass } from 'three-stdlib';
import colors from 'nice-color-palettes';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

extend({ SSAOPass, UnrealBloomPass });

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const niceColors = colors[17];

const data = Array.from({ length: 1000 }, () => ({
  color: (niceColors as string[])[Math.floor(Math.random() * 5)] as string,
  scale: 1
}));

const InstancedVertexColor: React.FC = () => {
  return (
    <>
      <color attach='background' args={['#f0f0f0']} />
      <Boxes />
      <Post />
    </>
  );
};

const Boxes: React.FC = () => {
  const [hovered, setHovered] = useState<number | undefined>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000).fill(null).flatMap((_, i) => {
          const t = data[i];
          const color = t ? t.color : '';
          const res = tempColor.set(color).toArray();
          return res;
        })
      ),
    []
  );

  const meshRef = useRef<any>();
  const prevRef = useRef<any>();
  useEffect(() => {
    prevRef.current = hovered;
  }, [hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4);
    meshRef.current.rotation.y = Math.sin(time / 2);
    let i = 0;
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++;
          tempObject.position.set(5 - x, 5 - y, 5 - z);
          tempObject.rotation.y =
            Math.sin(x / 4 + time) +
            Math.sin(y / 4 + time) +
            Math.sin(z / 4 + time);
          tempObject.rotation.z = tempObject.rotation.y * 2;
          if (hovered !== prevRef.current) {
            (id === hovered
              ? tempColor.setRGB(10, 10, 10)
              : // eslint-disable-next-line
                // @ts-ignore
                tempColor.set(data[id].color)
            ).toArray(colorArray, id * 3);
            meshRef.current.geometry.attributes.color.needsUpdate = true;
          }

          // eslint-disable-next-line
          // @ts-ignore
          const scale = (data[id].scale = THREE.MathUtils.lerp(
            // eslint-disable-next-line
            // @ts-ignore
            data[id].scale,
            id === hovered ? 2.5 : 1,
            0.1
          ));
          tempObject.scale.setScalar(scale);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(id, tempObject.matrix);
        }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, 1000]}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHovered(e.instanceId);
      }}
      onPointerOut={() => setHovered(undefined)}
    >
      <boxGeometry args={[0.6, 0.6, 0.6]}>
        <instancedBufferAttribute
          attach='attributes-color'
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
};

const Post: React.FC = () => {
  const { scene, camera } = useThree();
  return (
    <Effects disableGamma>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <sSAOPass args={[scene, camera]} kernelRadius={0.5} maxDistance={0.1} />

      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <unrealBloomPass threshold={0.9} strength={1} radius={0.5} />
    </Effects>
  );
};

export default InstancedVertexColor;
