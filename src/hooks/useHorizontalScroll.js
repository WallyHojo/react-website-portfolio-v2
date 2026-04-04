import { useEffect } from 'react';

export function useHorizontalScroll(wrapRef, stageRef) {
  useEffect(() => {
    const wrap  = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const onScroll = () => {
      const { top, height } = wrap.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(1, Math.max(0, -top / scrollable));
      stage.style.setProperty('--p', p.toFixed(4));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial value on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, [wrapRef, stageRef]);
}