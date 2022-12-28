import dynamic from 'next/dynamic';
import type { CustomNextPage } from '../models/common';

const Home = dynamic(() => import('../components/canvas/home'), {
  ssr: false
});

const Page: CustomNextPage = () => {
  return <></>;
};

Page.Canvas = () => <Home />;

export async function getStaticProps() {
  return { props: { title: 'NovaEra Showcase' } };
}

export default Page;
