// hooks/useSmoothScroll.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenisInstance } from './lenisController';

export function useSmoothScroll() {
  useEffect(() => {
    let lenis;
    let rafId;

    // Defer Lenis initialization to after first paint
    const initTimer = setTimeout(() => {
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      setLenisInstance(lenis);

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    }, 100); // Small delay to ensure first paint is prioritized

    return () => {
      // Cancels the pending init if unmounting before it fires; a no-op
      // once it's already fired.
      clearTimeout(initTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        setLenisInstance(null);
      }
    };
  }, []);
}