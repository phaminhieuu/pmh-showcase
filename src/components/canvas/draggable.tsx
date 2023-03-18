import { cardParams } from 'constants/draggable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Camera, type Group } from 'three';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import vertexShader from '../../shaders/draggable/vertex.glsl';
import fragmentShader from '../../shaders/draggable/fragment.glsl';
import { calcCoveredTextureScale } from 'utils/coveredTexture';

const Draggable = () => {
  const { width, height, row, col, gap } = cardParams;

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });

  const groupRef = useRef<Group>(null);

  const [centerTarget] = useState(new THREE.Vector3());
  const [edgeTarget] = useState(new THREE.Vector3());
  const [frustum] = useState(new THREE.Frustum());

  const [geometry] = useState(
    () => new THREE.PlaneGeometry(width, height, 50, 50)
  );
  const [material] = useState(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tImage: {
            value: null
          },
          uUvScale: { value: new THREE.Vector2() },
          uSpeed: { value: new THREE.Vector2() },
          uAspect: { value: width / height }
        },
        vertexShader,
        fragmentShader
      })
  );

  const textures = useMemo(
    () =>
      new Array(18).fill(null).map((_, index) => {
        const texture = new THREE.TextureLoader().load(
          `/images/draggable/${index + 1}.jpg`
        );
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        return texture;
      }),
    []
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsMouseDown(true);
    setPrevPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown || !groupRef.current) return;
      const group = groupRef.current;
      group.userData.target.position.x += (e.clientX - prevPosition.x) * 0.005;
      group.userData.target.position.y -= (e.clientY - prevPosition.y) * 0.005;

      setPrevPosition({ x: e.clientX, y: e.clientY });
    },
    [isMouseDown, prevPosition]
  );

  const handleMouseLeave = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);

    window.addEventListener('mousemove', handleMouseMove);

    window.addEventListener('mouseleave', handleMouseLeave);

    window.addEventListener('mouseup', handleMouseLeave);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseLeave);
    };
  }, [isMouseDown, handleMouseMove, handleMouseDown, handleMouseLeave]);

  const updateCardPosition = useCallback(
    (camera: Camera, group: Group) => {
      camera.updateMatrix();
      camera.updateMatrixWorld();
      const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(matrix);

      const { width, height, row, col, gap } = cardParams;

      const screenHeight = (height + gap) * (row - 1);
      const screenWidth = (width + gap) * (col - 1);

      for (let i = 0; i < group.children.length; i++) {
        const card = group.children[i] as THREE.Mesh<
          THREE.PlaneGeometry,
          THREE.ShaderMaterial
        >;

        card.getWorldPosition(centerTarget);

        if (centerTarget.y < 0) {
          edgeTarget.copy(centerTarget).y += height / 2 + gap;
          edgeTarget.x = 0;
          if (!frustum.containsPoint(edgeTarget)) {
            card.position.y += screenHeight + height + gap;
          }
        } else {
          edgeTarget.copy(centerTarget).y -= height / 2 + gap;
          edgeTarget.x = 0;
          if (!frustum.containsPoint(edgeTarget)) {
            card.position.y -= screenHeight + height + gap;
          }
        }

        if (centerTarget.x < 0) {
          edgeTarget.copy(centerTarget).x += width / 2 + gap;
          edgeTarget.y = 0;
          if (!frustum.containsPoint(edgeTarget)) {
            card.position.x += screenWidth + width + gap;
          }
        } else {
          edgeTarget.copy(centerTarget).x -= width / 2 + gap;
          edgeTarget.y = 0;
          if (!frustum.containsPoint(edgeTarget)) {
            card.position.x -= screenWidth + width + gap;
          }
        }
      }
    },
    [frustum, centerTarget, edgeTarget]
  );

  useFrame(({ camera, clock }) => {
    const a = clock.elapsedTime;
    if (!groupRef.current) return;

    const group = groupRef.current;

    group.position.y += Math.sin(a + 2) * 0.05;
    group.position.x += Math.cos(a + 1) * 0.05;

    updateCardPosition(camera, group);

    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      group.userData.target.position.x,
      0.1
    );

    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      group.userData.target.position.y,
      0.1
    );

    const speedX = group.userData.target.position.x - group.position.x;
    const speedY = group.userData.target.position.y - group.position.y;

    group.children.forEach((child) => {
      const card = child as THREE.Mesh<
        THREE.PlaneGeometry,
        THREE.ShaderMaterial
      >;
      if (!card.material.uniforms.uSpeed) return;
      card.material.uniforms.uSpeed.value.x = THREE.MathUtils.lerp(
        card.material.uniforms.uSpeed.value.x,
        speedX,
        0.1
      );

      card.material.uniforms.uSpeed.value.y = THREE.MathUtils.lerp(
        card.material.uniforms.uSpeed.value.y,
        speedY,
        0.1
      );
    });
  });

  const centerX = useMemo(
    () => ((width + gap) * (col - 1)) / 2,
    [width, gap, col]
  );

  const centerY = useMemo(
    () => ((height + gap) * (row - 1)) / 2,
    [height, gap, row]
  );

  const halfY = useMemo(() => (height + gap) / 2, [height, gap]);

  // Initial create object
  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    let i = 0;

    for (let x = 0; x < col; x++) {
      for (let y = 0; y < row; y++) {
        const mat = material.clone();
        if (mat.uniforms.tImage) mat.uniforms.tImage.value = textures[i++];
        if (mat.uniforms.tImage && mat.uniforms.uUvScale)
          calcCoveredTextureScale(width / height, mat.uniforms.uUvScale.value);

        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.set(
          width * x + gap * x - centerX,
          height * y + gap * y - centerY,
          0
        );

        if (x % 2 === 0) {
          mesh.position.y += halfY;
        }

        group.userData.target = { position: { x: 0, y: 0, z: 0 } };

        group.add(mesh);
      }
    }
  }, [
    width,
    height,
    gap,
    col,
    row,
    geometry,
    material,
    centerX,
    centerY,
    halfY,
    textures
  ]);

  return <group ref={groupRef} />;
};

export default Draggable;
