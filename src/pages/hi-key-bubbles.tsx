import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const HiKeyBubbles = dynamic(
  () => import('../components/canvas/hi-key-bubbles'),
  { ssr: false }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <HiKeyBubbles />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Hi-key Bubbles',
      canvas: {
        camera: { position: [0, 0, 60] },
        fov: 75,
        near: 10,
        far: 150,
        gl: { antialias: false },
        shadows: true
      }
    }
  };
}

export default Page;
