import { useEffect } from 'react';
import './useDotGrid.css';

/**
 * useDotGrid
 *
 * Observes every .dot-grid on the page and adds `dot-grid--revealed`
 * when it enters the viewport, triggering the CSS transition stagger.
 * Call once at the app root.
 *
 *   useDotGrid();
 *
 * @param {number}  [threshold=0.05] - Fraction of grid visible before triggering.
 * @param {boolean} [replayHero=true] - Re-animate grids inside .hero on re-entry.
 */
export function useDotGrid({ threshold = 0.05, replayHero = true } = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const isHero = replayHero && target.closest('.hero');

        if (isIntersecting) {
          target.classList.add('dot-grid--revealed');
          if (!isHero) observer.unobserve(target);
        } else if (isHero) {
          target.classList.remove('dot-grid--revealed');
        }
      });
    }, { threshold });

    document.querySelectorAll('.dot-grid').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, replayHero]);
}
