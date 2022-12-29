import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const InstancedVertexColor = dynamic(
  () => import('../components/canvas/instanced-vertex-color'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <></>;
};

Page.Canvas = () => <InstancedVertexColor />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Instanced vertex color',
      canvas: {
        camera: { position: [0, 0, 15], near: 5, far: 20 },
        gl: { antialias: false }
      }
    }
  };
}

export default Page;
