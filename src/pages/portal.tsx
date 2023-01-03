import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const Portal = dynamic(() => import('../components/canvas/portal'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <Portal />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Portal',
      canvas: { camera: { position: [-4, 2, -4], fov: 45 } }
    }
  };
}

export default Page;
