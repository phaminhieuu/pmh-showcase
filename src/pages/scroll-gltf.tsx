import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ScrollGLTF = dynamic(() => import('../components/canvas/scroll-gltf'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ScrollGLTF />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Scroll GLTF',
      canvas: {
        camera: { position: [0, 0, 10], near: 0.1, far: 1000 },
        shadows: true,
        dpr: [1, 2]
      }
    }
  };
}

export default Page;
