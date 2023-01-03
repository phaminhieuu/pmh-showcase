import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const Reflectorplanes = dynamic(
  () => import('../components/canvas/reflectorplanes'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <Reflectorplanes />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Reflectorplanes',
      canvas: {
        dpr: [1, 1.5],
        camera: { position: [0, 0, 15] }
      }
    }
  };
}

export default Page;
