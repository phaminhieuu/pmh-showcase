import { type NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hieu showcase</title>
        <meta name='description' content='My 3D showcase with threejs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
        <h1 className='text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]'>
          My <span className='text-[hsl(280,100%,70%)]'>3D</span> Showcase
        </h1>
      </main>
    </>
  );
};

export default Home;
