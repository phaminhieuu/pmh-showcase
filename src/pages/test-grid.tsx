import Image from 'next/image';

const TestGrid = () => {
  return (
    <div className='mx-auto flex gap-5 px-10'>
      <div className='grid w-full grid-cols-2 gap-5 px-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
        {new Array(11).fill(null).map((_, index) => (
          <div key={index} className='relative'>
            <div className='relative aspect-[3/4] w-full'>
              <Image
                src={`/images/furniture/${index + 1}.jpg`}
                alt={index.toString()}
                fill
                className='object-cover'
              />
            </div>
          </div>
        ))}
      </div>
      <div className='hidden w-[500px] place-items-center lg:grid'>
        <div className='relative grid aspect-[3/4] w-full place-items-center '>
          <Image src='/images/furniture/2.jpg' alt='main' fill />
        </div>
      </div>
    </div>
  );
};

export default TestGrid;
