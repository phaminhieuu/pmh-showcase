import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const SimpleAudioAnalyser = dynamic(
  () => import('../components/canvas/simple-audio-analyser'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return (
    <div className='fixed inset-0 bg-gradient-to-t from-gray-500 to-gray-100'></div>
  );
};

Page.Canvas = () => <SimpleAudioAnalyser />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Simple Audio Analyser',
      canvas: {
        shadows: true,
        dpr: [1, 2],
        camera: { position: [-1, 1.5, 2], fov: 25 }
      }
    }
  };
}

export default Page;
