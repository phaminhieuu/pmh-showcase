import dynamic from 'next/dynamic';
import MouseStalker from '../components/ui/draggable/mouse-stalker';
import { type CustomNextPage } from '../models/common';

const Draggable = dynamic(() => import('../components/canvas/draggable'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <MouseStalker />;
};

Page.Canvas = () => <Draggable />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Draggable',
      canvas: {
        camera: { position: [0, 0, 3], fov: 50, near: 0.01, far: 100 }
      }
    }
  };
}

export default Page;
