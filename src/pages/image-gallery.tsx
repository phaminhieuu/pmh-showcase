import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const ImageGallery = dynamic(
  () => import('../components/canvas/image-gallery'),
  {
    ssr: false
  }
);

const Page: CustomNextPage = () => {
  return <div></div>;
};

Page.Canvas = () => <ImageGallery />;

export async function getStaticProps() {
  return {
    props: {
      title: 'Image Gallery',
      canvas: { camera: { position: [0, 2, 15], fov: 70 }, dpr: [1, 1.5] }
    }
  };
}

export default Page;
