import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const InfiniteScroll = dynamic(
  () => import('../components/canvas/infinite-scroll'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <></>;
};

Page.Canvas = () => <InfiniteScroll />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Infinite Scroll',
      canvas: {
        dpr: [1, 1.5],
        gl: { antialias: false }
      }
    }
  };
}

export default Page;
