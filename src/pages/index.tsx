import Link from 'next/link';
import { routes } from '../constants/routes';
import type { CustomNextPage } from '../models/common';

const Page: CustomNextPage = () => {
  return (
    <div className='container mx-auto py-20 px-5'>
      <p className='pb-20 text-center text-5xl'>My 3D Showcase</p>

      <div className='grid grid-flow-row grid-cols-auto gap-10'>
        {routes.map((route, index) => (
          <Link href={route.path} key={index}>
            <div className='grid h-60 place-items-center rounded-md border-2'>
              {route.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return { props: { title: 'NovaEra Showcase' } };
}

export default Page;
