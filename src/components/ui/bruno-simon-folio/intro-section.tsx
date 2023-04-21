import Model from './model';

const IntroSection: React.FC = () => {
  return (
    <>
      <Model path='/models/intro/static/base.glb' />
      {/* <Model path='/models/intro/instructions/labels.glb' /> */}
    </>
  );
};

export default IntroSection;
