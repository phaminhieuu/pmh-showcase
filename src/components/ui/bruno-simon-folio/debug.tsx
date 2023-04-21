import { Leva } from 'leva';

const Debug = () => {
  const isDebug = window.location.hash === '#debug';
  return <Leva hidden={!isDebug} oneLineLabels />;
};

export default Debug;
