import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

import useZoom from './useZoom';
// import usePan from './usePan';

export default function useSetCamera() {
  const { camera } = useThree();

  const [target] = useState(new THREE.Vector3(0, 0, 0));
  const [targetEased] = useState(new THREE.Vector3(0, 0, 0));

  const {
    easing,
    invertDirectionX,
    invertDirectionY,
    invertDirectionZ,
    enableControl
  } = useControls('Camera', {
    easing: { value: 0.15, step: 0.0001, min: 0, max: 1 },
    invertDirectionX: { value: 1.135, step: 0.001, min: -2, max: 2 },
    invertDirectionY: { value: -1.45, step: 0.001, min: -2, max: 2 },
    invertDirectionZ: { value: 1.15, step: 0.001, min: -2, max: 2 },
    enableControl: false
  });

  const { distance } = useZoom();

  const angle = useMemo(
    () =>
      new THREE.Vector3(invertDirectionX, invertDirectionY, invertDirectionZ),
    [invertDirectionX, invertDirectionY, invertDirectionZ]
  );

  useEffect(() => {
    camera.lookAt(new THREE.Vector3());

    camera.up.set(0, 0, 1);

    camera.position.copy(angle);
  }, [angle, camera]);

  useFrame(({ camera }) => {
    if (enableControl) return;
    targetEased.x += (target.x - targetEased.x) * easing;
    targetEased.y += (target.y - targetEased.y) * easing;
    targetEased.z += (target.z - targetEased.z) * easing;

    // Apply zoom
    camera.position
      .copy(targetEased)
      .add(angle.clone().normalize().multiplyScalar(distance));

    // Look at target
    camera.lookAt(targetEased);
  });
}
