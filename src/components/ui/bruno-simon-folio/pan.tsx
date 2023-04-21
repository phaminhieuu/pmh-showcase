import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type Mesh } from 'three';
import * as THREE from 'three';

const Pan = () => {
  const pan = useRef<Mesh>(null);

  const { scene, viewport } = useThree();

  const [active, setActive] = useState(false);
  const [start] = useState({ x: 0, y: 0 });
  const [value] = useState({ x: 0, y: 0 });
  const [targetValue] = useState({ x: value.x, y: value.y });

  const [mouse] = useState(new THREE.Vector2());

  const handlePanDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      start.x = e.point.x;
      start.y = e.point.y;
    },
    [start]
  );

  const handlePanMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    console.log('');
  }, []);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      setActive(true);
      mouse.x = (e.clientX / viewport.width) * 2 - 1;
      mouse.y = -(e.clientX / viewport.height) * 2 + 1;
    },
    [mouse, viewport]
  );

  const onMouseUp = useCallback(() => {
    setActive(false);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!active) return;

      mouse.x = (e.clientX / viewport.width) * 2 - 1;
      mouse.y = -(e.clientX / viewport.height) * 2 + 1;
    },
    [active, mouse, viewport]
  );

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);

    window.addEventListener('mouseup', onMouseUp);

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseDown, onMouseUp, onMouseMove]);

  return (
    <mesh ref={pan} onPointerDown={handlePanDown} onPointerMove={handlePanMove}>
      <planeGeometry args={[500, 500, 1, 1]} />
      <meshBasicMaterial />
    </mesh>
  );
};

export default Pan;
