import { useTexture } from '@react-three/drei';
import { useCallback } from 'react';
import * as THREE from 'three';

import vertexShader from 'shaders/bruno-simon-folio/matcap/vertex.glsl';
import fragmentShader from 'shaders/bruno-simon-folio/matcap/fragment.glsl';

const matcapMaterialColors = [
  'beige',
  'black',
  'blue',
  'brown',
  'emeraldGreen',
  'gold',
  'gray',
  'green',
  'metal',
  'orange',
  'purple',
  'red',
  'white',
  'yellow'
] as const;

export default function useGetMaterial() {
  const matcapTextures = useTexture(useTextureArgument);

  const shaderMaterial = useCallback((matcap: THREE.Texture | undefined) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ...THREE.UniformsLib.common,
        ...THREE.UniformsLib.bumpmap,
        ...THREE.UniformsLib.normalmap,
        ...THREE.UniformsLib.displacementmap,
        ...THREE.UniformsLib.fog,
        matcap: { value: matcap },
        uRevealProgress: { value: 1 },
        uIndirectDistanceAmplitude: { value: 1.75 },
        uIndirectDistanceStrength: { value: 0.5 },
        uIndirectDistancePower: { value: 2.0 },
        uIndirectAngleStrength: { value: 1.5 },
        uIndirectAngleOffset: { value: 0.6 },
        uIndirectAnglePower: { value: 1.0 },
        uIndirectColor: {
          value: new THREE.Color('#d04500').convertLinearToSRGB()
        }
      },
      lights: false,
      vertexShader,
      fragmentShader
    });
  }, []);

  const getMaterial = (childName: string) => {
    const color = getMatcapColor(childName);
    if (color) {
      const matcap = matcapTextures[color];
      return shaderMaterial(matcap);
    }
    return shaderMaterial;
  };

  return getMaterial;
}

const useTextureArgument = Object.fromEntries(
  matcapMaterialColors.map((color) => [color, `./models/matcaps/${color}.png`])
);

function getMatcapColor(meshName: string) {
  const match = meshName.match(/^shade([a-z]+)_?[0-9]{0,3}?/i);
  return toCamelCase(match?.[1]);
}

function toCamelCase(value?: string) {
  return value
    ? `${value.substring(0, 1).toLowerCase()}${value.substring(1)}`
    : undefined;
}
