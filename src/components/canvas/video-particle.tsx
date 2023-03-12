import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';

// @ts-ignore
import fragmentShader from '../../shaders/video-particle/fragment.glsl';

// @ts-ignore
import vertexShader from '../../shaders/video-particle/vertex.glsl';
import gsap from 'gsap';

const VideoParticle = () => {
  const shader = useRef<any>();
  const bloom = useRef<any>();

  const { distortion, bloomStrength } = useControls({
    distortion: { value: 0, min: 0, max: 3, step: 0.01 },
    bloomStrength: { value: 0, min: 0, max: 10, step: 0.01 }
  });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    shader.current.uniforms.time.value = elapsedTime;
    shader.current.uniforms.distor = { value: distortion };
  });

  useLayoutEffect(() => {
    if (!shader.current) return;
    const uniforms = shader.current.uniforms;
    uniforms.time = { value: 0 };
    uniforms.t = {
      value: new THREE.TextureLoader().load('/images/video-particle/end.jpeg')
    };

    uniforms.t1 = {
      value: new THREE.TextureLoader().load('/images/video-particle/start.jpeg')
    };
    uniforms.distortion = { value: 0 };
    uniforms.progress = { value: 0 };
  }, [distortion]);

  useEffect(() => {
    const video: HTMLVideoElement | null = document.getElementById(
      'video'
    ) as HTMLVideoElement;
    if (!video || !shader.current || !bloom.current) return;
    video.addEventListener('ended', () => {
      gsap.to(video, { duration: 0.1, opacity: 0 });

      gsap.to(shader.current.uniforms.distortion, {
        duration: 2,
        value: 3,
        ease: 'power2.inOut'
      });
      gsap.to(shader.current.uniforms.distortion, {
        duration: 2,
        value: 0,
        delay: 2,
        ease: 'power2.inOut'
      });

      gsap.to(bloom.current, {
        duration: 2,
        intensity: 20,
        ease: 'power2.in'
      });

      gsap.to(bloom.current, {
        duration: 2,
        intensity: 0,
        delay: 2,
        ease: 'power2.out',
        onComplete: () => {
          video.currentTime = 0;
          video.play();

          gsap.to(video, { duration: 0.1, opacity: 1 });

          gsap.to(shader.current.uniforms.progress, {
            duration: 1,
            delay: 1.5,
            value: 0
          });
        }
      });

      gsap.to(shader.current.uniforms.progress, {
        duration: 1,
        delay: 1.5,
        value: 1
      });
    });
  }, []);

  return (
    <>
      <points>
        <planeGeometry args={[480 * 1.92, 820 * 1.922, 480, 820]} />
        <shaderMaterial
          ref={shader}
          side={THREE.DoubleSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
      <Suspense fallback='null'>
        <EffectComposer>
          <Bloom
            ref={bloom}
            intensity={bloomStrength}
            luminanceThreshold={0}
            luminanceSmoothing={0}
          />
        </EffectComposer>
      </Suspense>
      <OrbitControls />
    </>
  );
};

export default VideoParticle;
