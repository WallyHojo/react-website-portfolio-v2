import { useEffect } from 'react';

export function useHorizontalScroll(wrapRef, stageRef, itemCount) {
  useEffect(() => {
    const wrap  = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    // Clamp --p so the stage stops just before the last item is fully in view.
    const maxP = 1;

    const onScroll = () => {
      const { top, height } = wrap.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(maxP, Math.max(0, -top / scrollable));
      stage.style.setProperty('--p', p.toFixed(4));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [wrapRef, stageRef, itemCount]);
}