import { Environment } from '@react-three/drei';

const ImageGallery: React.FC = () => {
  return (
    <>
      <color attach='background' args={['#191920']} />
      <fog attach='fog' args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Environment preset='city' />
      </group>
    </>
  );
};

export default ImageGallery;
