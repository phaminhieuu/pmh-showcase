import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { CustomNextPage } from '../models/common';

const VideoParticle = dynamic(
  () => import('../components/canvas/video-particle'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
  }, []);

  return (
    <div className='fixed z-[1000] h-screen w-screen opacity-100 duration-200 ease-out'>
      current
      <div className='pointer-events-none absolute top-1/2 left-1/2 box-border h-[68.5vh] w-[40vh] -translate-y-1/2 -translate-x-1/2 overflow-hidden'>
        <video
          className='h-full w-full object-fill'
          autoPlay
          muted
          ref={videoRef}
          id='video'
        >
          <source src='/videos/1.mp4' type='video/mp4' />
        </video>
      </div>
    </div>
  );
};

Page.Canvas = () => <VideoParticle />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Video Particle',
      canvas: {
        camera: { position: [0, 0, 1500], fov: 75, near: 0.001, far: 5000 }
      }
    }
  };
}

export default Page;
