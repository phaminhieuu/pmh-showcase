import { LEVA_FOLDERS } from 'constants/leva-folder';
import { folder, useControls } from 'leva';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import fragmentShader from 'shaders/bruno-simon-folio/floor/fragment.glsl';
import vertexShader from 'shaders/bruno-simon-folio/floor/vertex.glsl';
import { Plane } from '@react-three/drei';

const Floor: React.FC = () => {
  const shaderMaterial = useRef<any>();

  const { topLeftColor, topRightColor, bottomLeftColor, bottomRightColor } =
    useControls(
      LEVA_FOLDERS.materials.label,
      {
        [LEVA_FOLDERS.floor.label]: folder(
          {
            topLeftColor: { value: '#f5883c', label: 'Top left color' },
            topRightColor: { value: '#ff9043', label: 'Top right color' },
            bottomLeftColor: { value: '#fccf92', label: 'Bottom left color' },
            bottomRightColor: { value: '#f5aa58', label: 'Bottom right color' }
          },
          { collapsed: true, color: LEVA_FOLDERS.floor.color }
        )
      },
      { collapsed: true, color: LEVA_FOLDERS.materials.color }
    );

  useLayoutEffect(() => {
    if (!shaderMaterial.current) return;
    const cTopLeft = new THREE.Color(topLeftColor).convertLinearToSRGB();
    const cTopRight = new THREE.Color(topRightColor).convertLinearToSRGB();
    const cBottomRight = new THREE.Color(
      bottomRightColor
    ).convertLinearToSRGB();
    const cBottomLeft = new THREE.Color(bottomLeftColor).convertLinearToSRGB();

    const data = new Uint8Array([
      Math.round(cBottomLeft.r * 255),
      Math.round(cBottomLeft.g * 255),
      Math.round(cBottomLeft.b * 255),
      255,
      Math.round(cBottomRight.r * 255),
      Math.round(cBottomRight.g * 255),
      Math.round(cBottomRight.b * 255),
      255,
      Math.round(cTopLeft.r * 255),
      Math.round(cTopLeft.g * 255),
      Math.round(cTopLeft.b * 255),
      255,
      Math.round(cTopRight.r * 255),
      Math.round(cTopRight.g * 255),
      Math.round(cTopRight.b * 255),
      255
    ]);

    const backgroundTexture = new THREE.DataTexture(
      data,
      2,
      2,
      THREE.RGBAFormat
    );

    backgroundTexture.magFilter = THREE.LinearFilter;
    backgroundTexture.needsUpdate = true;

    shaderMaterial.current.uniforms.tBackground = { value: backgroundTexture };
  }, [topLeftColor, topRightColor, bottomLeftColor, bottomRightColor]);

  return (
    <Plane args={[2, 2, 10, 10]} frustumCulled={false} matrixAutoUpdate={false}>
      <shaderMaterial
        ref={shaderMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </Plane>
  );
};

export default Floor;
