import { OrbitControls } from '@react-three/drei';
import type { InstancedMeshProps } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { suspend } from 'suspend-react';
import * as THREE from 'three';

const SimpleAudioAnalyser: React.FC = () => {
  return (
    <>
      <OrbitControls />
      <spotLight
        position={[-4, 4, -4]}
        angle={0.06}
        penumbra={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Suspense fallback={null}>
        <Track position-z={-0.25} url='/images/audio-analyser/synth.mp3' />
        <Track position-z={0} url='/images/audio-analyser/snare.mp3' />
        <Track position-z={0.25} url='/images/audio-analyser/drums.mp3' />

        <Zoom url='/images/audio-analyser/drums.mp3' />
      </Suspense>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.025, 0]}
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
    </>
  );
};

interface TrackProps extends InstancedMeshProps {
  url: string;
  y?: number;
  space?: number;
  width?: number;
  height?: number;
}

const Track: React.FC<TrackProps> = ({
  url,
  y = 2500,
  space = 1.8,
  width = 0.01,
  height = 0.05,
  ...props
}) => {
  const ref = useRef<any>();
  const [obj] = useState(() => new THREE.Object3D());

  // suspend-react is the library that r3f uses internally for useLoader. It caches promises and
  // integrates them with React suspense. You can use it as-is with or without r3f.
  const { gain, context, update, data } = suspend(
    () => createAudio(url),
    [url]
  );

  useEffect(() => {
    //Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on unmount
    return () => gain.disconnect();
  }, [gain, context]);

  useFrame(() => {
    const avg = update();

    // Distribute the instanced planes according to the frequency daza
    for (let i = 0; i < data.length; i++) {
      obj.position.set(
        i * width * space - (data.length * width * space) / 2,
        data[i] / y,
        0
      );
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }

    // Set the hue according to the frequency average
    ref.current.material.color.setHSL(avg / 500, 0.75, 0.75);
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      castShadow
      ref={ref}
      args={[undefined, undefined, data.length]}
      {...props}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

const Zoom: React.FC<{ url: string }> = ({ url }) => {
  // This will *not* re-create a new audio source, suspense is always cached,
  // so this will just access (or create and then cache) the source according to the url
  const { data } = suspend(() => createAudio(url), [url]);

  return useFrame((state) => {
    const camera = state.camera;
    // Set the cameras field of view according to the frequency average
    // @ts-ignore
    camera.fov = 25 - data.avg / 15;
    camera.updateProjectionMatrix();
  });
};

async function createAudio(url: string) {
  // Fetch audio data and create a buffer source
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new window.AudioContext();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) =>
    context.decodeAudioData(buffer, res)
  );
  source.loop = true;

  source.start(0);

  // Create gain node and an analyser
  const gain = context.createGain();
  const analyser = context.createAnalyser();

  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(gain);

  // The data array receive the audio frequencies
  const data: any = new Uint8Array(analyser.frequencyBinCount);

  return {
    context,
    source,
    gain,
    data, // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(data);
      // Calculate a frequency average
      return (data.avg = data.reduce(
        (prev: any, cur: any) => prev + cur / data.length,
        0
      ));
    }
  };
}

export default SimpleAudioAnalyser;
