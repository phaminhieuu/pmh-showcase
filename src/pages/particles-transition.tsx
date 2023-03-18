import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ParticlesTransition = dynamic(
  () => import('../components/canvas/particles-transition'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ParticlesTransition />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Particles transition',
      canvas: {
        camera: { position: [0, 0, 1000], fov: 70, near: 0.1, far: 3000 }
      }
    }
  };
}

export default Page;
