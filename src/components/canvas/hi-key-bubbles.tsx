const HiKeyBubbles: React.FC = () => {
  return (
    <>
      <color attach='background' args={['#f0f0f0']} />
      <fog attach='fog' args={['red', 60, 100]} />
      <ambientLight intensity={1.5} />
      <pointLight
        position={[100, 10, -50]}
        intensity={20}
        castShadow
      />
      <pointLight
        position={[-100, -100, -100]}
        intensity={10}
        color='red'
      />
    </>
  );
};

export default HiKeyBubbles;
