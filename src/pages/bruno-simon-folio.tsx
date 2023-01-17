import dynamic from 'next/dynamic';
import { LinearEncoding, NoToneMapping } from 'three';
import type { CustomNextPage } from '../models/common';

const BrunoSimonFolio = dynamic(
  () => import('../components/canvas/bruno-simon-folio'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <BrunoSimonFolio />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Bruno Simon Folio',
      canvas: {
        camera: { position: [1.135, -1.45, 1.15], fov: 40, near: 1, far: 80 },
        shadows: true
      },
      gl: {
        pixelRatio: 2,
        physicallyCorrectLights: true,
        autoClear: false,
        outputEncoding: LinearEncoding,
        toneMapping: NoToneMapping
      }
    }
  };
}

export default Page;
