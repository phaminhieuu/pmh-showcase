import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from '../constants/routes';
import { routes } from '../constants/routes';
import type { CustomNextPage } from '../models/common';

const Page: CustomNextPage = () => {
  return (
    <div className='container mx-auto py-20 px-5'>
      <p className='pb-20 text-center text-5xl'>My 3D Showcase</p>

      <div className='grid grid-flow-row grid-cols-auto gap-10'>
        {routes.map((route, index) => (
          <Item {...route} key={index} />
        ))}
      </div>
    </div>
  );
};

const Item: React.FC<Route> = (props) => {
  const { name, path, img } = props;

  return (
    <Link href={path}>
      <div className='group relative grid h-60 place-items-center overflow-hidden rounded-md duration-200 ease-out hover:scale-110'>
        <Image src={img} alt={name} fill className='object-cover' />
        <div
          className={clsx(
            'absolute top-full flex h-24 w-full items-center bg-gradient-to-t from-black/80 to-black/0 px-2 duration-200 ease-out group-hover:-translate-y-full'
          )}
        >
          <p className='text-2xl'>{name}</p>
        </div>
      </div>
    </Link>
  );
};

export async function getStaticProps() {
  return { props: { title: 'NovaEra Showcase' } };
}

export default Page;
