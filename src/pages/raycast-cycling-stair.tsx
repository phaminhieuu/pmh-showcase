import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const RaycastCyclingStair = dynamic(
  () => import('../components/canvas/raycast-cycling-stair'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div className='fixed inset-0 bg-white/90'></div>;
};

Page.Canvas = () => <RaycastCyclingStair />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Raycast Cycling Stair',
      canvas: {
        shadows: true,
        camera: { position: [-10, 10, 5], fov: 50 },
        dpr: [1, 1.5]
      }
    }
  };
}

export default Page;
