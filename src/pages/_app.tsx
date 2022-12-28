import { type AppType } from 'next/dist/shared/lib/utils';
import dynamic from 'next/dynamic';
import Layout from '../components/layout';
import Header from '../config';
import type { CustomAppProps } from '../models/common';

const Scene = dynamic(() => import('../components/canvas/scene'));

import '../styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <>
      <Header title={pageProps.title} />
      <Layout>
        <Component {...pageProps} />
        {Component?.Canvas && (
          <Scene className='pointer-events-none' {...pageProps.canvas}>
            {Component.Canvas(pageProps)}
          </Scene>
        )}
      </Layout>
    </>
  );
};

export default MyApp;
