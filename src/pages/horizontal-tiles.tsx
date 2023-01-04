import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const HorizontalTiles = dynamic(
  () => import('../components/canvas/horizontal-tiles'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <></>;
};

Page.Canvas = () => <HorizontalTiles />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Horizontal titles',
      canvas: {
        dpr: [1, 1.5],
        gl: { antialias: false }
      }
    }
  };
}

export default Page;
