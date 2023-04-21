import { MapControls, OrbitControls } from '@react-three/drei';
import Floor from 'components/ui/bruno-simon-folio/floor';
import IntroSection from 'components/ui/bruno-simon-folio/intro-section';
import Pan from 'components/ui/bruno-simon-folio/pan';
import useSetCamera from 'hooks/bruno-simon-folio/camera/useSetCamera';
import { useControls } from 'leva';
export default function BrunoSimonFolio() {
  useSetCamera();

  const { enableControl } = useControls('Camera', { enableControl: false });

  return (
    <>
      <OrbitControls enabled={enableControl} zoomSpeed={0.5} />
      <Floor />
      <IntroSection />
      {/* <mesh> */}
      {/*   <boxGeometry /> */}
      {/*   <meshNormalMaterial /> */}
      {/* </mesh> */}
      <MapControls />
      <Pan />
    </>
  );
}
