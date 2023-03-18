export function calcCoveredTextureScale(
  aspect: number,
  target?: THREE.Vector2
) {
  const imageAspect = 640 / 960;

  let result: [number, number] = [1, 1];
  if (aspect < imageAspect) result = [aspect / imageAspect, 1];
  else result = [1, imageAspect / aspect];

  target?.set(result[0], result[1]);

  return result;
}
