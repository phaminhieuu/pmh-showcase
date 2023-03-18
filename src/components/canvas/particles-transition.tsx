import { OrbitControls, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import * as THREE from 'three';
import { type ShaderMaterial, type BufferGeometry } from 'three';
// @ts-ignore
import fragmentShader from '../../shaders/particles-transition/fragment.glsl';

// @ts-ignore
import vertexShader from '../../shaders/particles-transition/vertex.glsl';
import { randomBetween } from '../../utils/random';

const NUM = 512 * 512;

const ParticlesTransition = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const geoRef = useRef<BufferGeometry>(null);
  const [raycaster] = useState(new THREE.Raycaster());
  const [mouse] = useState(new THREE.Vector2());

  const [t1, t2, mask] = useTexture([
    '/images/particles-transition/t.png',
    '/images/particles-transition/t1.png',
    '/images/particles-transition/mask.png'
  ]);

  const { camera } = useThree();

  const handleScroll = useCallback((e: WheelEvent) => {
    if (!shaderRef.current || !shaderRef.current.uniforms.move) return;
    const move = shaderRef.current.uniforms.move.value;
    shaderRef.current.uniforms.move = { value: move + e.deltaY / 500 };
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);

    return () => window.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const test = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial()
    );
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([test]);
    // console.log(intersects[0]?.point);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useLayoutEffect(() => {
    const geo = geoRef.current;
    if (!geo) return;

    const positions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const coordinates = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const speeds = new THREE.BufferAttribute(new Float32Array(NUM), 1);
    const offset = new THREE.BufferAttribute(new Float32Array(NUM), 1);
    let index = 0;

    for (let i = 0; i < 512; i++) {
      const posX = i - 256;
      for (let j = 0; j < 512; j++) {
        positions.setXYZ(index, posX * 2, (j - 256) * 2, 0);
        coordinates.setXYZ(index, i, j, 0);
        offset.setX(index, randomBetween(-1000, 1000));
        speeds.setX(index, randomBetween(0.4, 1));
        index++;
      }
    }

    geo.setAttribute('position', positions);
    geo.setAttribute('aCoordinates', coordinates);
    geo.setAttribute('aSpeed', speeds);
    geo.setAttribute('aOffset', offset);
  }, []);

  useFrame(({ clock }) => {
    if (!shaderRef.current || !shaderRef.current.uniforms.time) return;
    const elapsedTime = clock.getElapsedTime();
    shaderRef.current.uniforms.time.value = elapsedTime;
  });

  useLayoutEffect(() => {
    const shader = shaderRef.current;
    if (!shader) return;
    const uniforms = shader.uniforms;
    uniforms.progress = { value: 0 };
    uniforms.t1 = { value: t1 };
    uniforms.t2 = { value: t2 };
    uniforms.mask = { value: mask };
    uniforms.move = { value: 0 };
    uniforms.time = { value: 0 };
    uniforms.mouse = { value: mouse };
  }, [t1, t2, mask, mouse]);

  return (
    <>
      <points>
        <bufferGeometry ref={geoRef} />
        <shaderMaterial
          ref={shaderRef}
          side={THREE.DoubleSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </points>
      {/* <OrbitControls /> */}
    </>
  );
};

export default ParticlesTransition;
