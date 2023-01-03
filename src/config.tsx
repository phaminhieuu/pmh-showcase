import Head from 'next/head';

const titleDefault = 'NovaEra&apos;s showcase';
// const url = 'https://react-three-next.vercel.app/';
const description = 'My 3D showcase';
const author = 'Author';

export default function Header({ title = titleDefault }) {
  return (
    <Head>
      {/* Recommended Meta Tags */}
      <meta charSet='utf-8' />
      <meta name='language' content='english' />
      <meta httpEquiv='content-type' content='text/html' />
      <meta name='author' content={author} />
      <meta name='designer' content={author} />
      <meta name='publisher' content={author} />

      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta
        name='keywords'
        content='Software Engineer,Product Manager,Project Manager,Data Scientist,Computer Scientist'
      />
      <meta name='robots' content='index,follow' />
      <meta name='distribution' content='web' />

      <meta
        name='viewport'
        content='width=device-width, minimum-scale=1, initial-scale=1.0'
      />
      <meta name='theme-color' content='#000' />
      <link rel='shortcut icon' href='/favicon.ico' />
    </Head>
  );
}
