import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const Ballpit = dynamic(() => import('../components/canvas/ballpit'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <Ballpit />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Ballpit',
      canvas: {
        camera: { position: [0, 0, 20], fov: 50, near: 17, far: 40 },
        shadows: true,
        gl: { stencil: false, antialias: false }
      }
    }
  };
}

export default Page;
