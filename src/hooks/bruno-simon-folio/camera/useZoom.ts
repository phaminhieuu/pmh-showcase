import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';

const zoomConfig = {
  easing: 0.1,
  minDistance: 14,
  amplitude: 15
};

export default function useZoom() {
  const { easing, minDistance, amplitude } = zoomConfig;

  const [value, setValue] = useState(0.5);

  const [targetValue, setTargetValue] = useState(value);

  const [distance, setDistance] = useState(minDistance + amplitude * value);

  const handleZoom = useCallback(
    (e: WheelEvent) => {
      const target = targetValue + e.deltaY * 0.001;

      setTargetValue(Math.min(Math.max(target, 0), 1));
    },
    [targetValue]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleZoom, { passive: true });

    return () => window.removeEventListener('wheel', handleZoom);
  }, [handleZoom]);

  useFrame(() => {
    const val = value + (targetValue - value) * easing;
    setDistance(minDistance + amplitude * val);
    setValue(val);
  });

  return { distance };
}
