import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ShaderPattern = dynamic(
  () => import('../components/canvas/shader-pattern'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ShaderPattern />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Ballpit',
      canvas: {
        dpr: [1, 2],
        camera: { position: [1, 1, 2], fov: 75, near: 0.1, far: 100 },
        linear: true,
        flat: true
      }
    }
  };
}

export default Page;
