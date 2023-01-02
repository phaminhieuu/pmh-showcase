import Portal from '../components/canvas/portal';
import type { CustomNextPage } from '../models/common';

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
