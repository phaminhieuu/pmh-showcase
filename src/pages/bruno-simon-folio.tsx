import dynamic from 'next/dynamic';
import { LinearEncoding, NoToneMapping } from 'three';
import type { CustomNextPage } from '../models/common';

const Debug = dynamic(() => import('components/ui/bruno-simon-folio/debug'), {
  ssr: false
});

const BrunoSimonFolio = dynamic(
  () => import('../components/canvas/bruno-simon-folio'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <Debug />;
};

Page.Canvas = () => <BrunoSimonFolio />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Bruno Simon Folio',
      canvas: {
        camera: { fov: 40, near: 1, far: 80 },
        shadows: true,
        gl: {
          pixelRatio: 2,
          physicallyCorrectLights: true,
          autoClear: false,
          outputEncoding: LinearEncoding,
          toneMapping: NoToneMapping
        }
      }
    }
  };
}

export default Page;
