import { useCallback, useEffect, useRef, useState } from 'react';
import { MathUtils } from 'three';
import useAnimationFrame from '../../../hooks/useAnimationFrame';

const t = 0.3;
const MouseStalker = () => {
  const mouseRef = useRef<HTMLDivElement>(null);

  const [target] = useState({ x: 0, y: 0 });
  const [current] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!mouseRef.current) return;
      const mouse = mouseRef.current;
      const rect = mouse.getBoundingClientRect();
      target.x = e.clientX - rect.width / 2;
      target.y = e.clientY - rect.height / 2;
    },
    [target]
  );

  useAnimationFrame(
    useCallback(() => {
      if (!mouseRef.current) return;
      const mouse = mouseRef.current;
      current.x = MathUtils.lerp(current.x, target.x, t);
      current.y = MathUtils.lerp(current.y, target.y, t);
      mouse.style.setProperty('translate', `${current.x}px ${current.y}px`);
    }, [target, current])
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={mouseRef}
      className='pointer-events-none absolute z-[1000] aspect-square w-4 rounded-full bg-[#fff9]'
    />
  );
};

export default MouseStalker;
