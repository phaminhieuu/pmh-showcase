import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const BouncyWatch = dynamic(() => import('../components/canvas/bouncy-watch'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <div className='fixed inset-0 bg-blue-800'></div>;
};

Page.Canvas = () => <BouncyWatch />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Ballpit',
      canvas: {
        dpr: [1, 2],
        camera: { position: [0, 0, 4] },
        shadows: true
      }
    }
  };
}

export default Page;
