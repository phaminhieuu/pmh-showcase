import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ScrollControlsMinimap = dynamic(
  () => import('../components/canvas/scrollcontrols-minimap'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ScrollControlsMinimap />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Scrollcontrols with minimap',
      canvas: {
        dpr: [1, 1.5],
        gl: { antialias: false }
      }
    }
  };
}

export default Page;
