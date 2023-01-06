import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const WaterShader = dynamic(() => import('../components/canvas/water-shader'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <WaterShader />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Water Shader',
      canvas: {
        camera: { position: [0, 5, 100], fov: 55, far: 20000 }
      }
    }
  };
}

export default Page;
