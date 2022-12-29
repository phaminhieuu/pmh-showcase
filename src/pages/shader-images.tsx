import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ShaderPictures = dynamic(
  () => import('../components/canvas/shader-images'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ShaderPictures />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Ballpit',
      canvas: {
        camera: { position: [0, 0, 2], fov: 50 }
      }
    }
  };
}

export default Page;
