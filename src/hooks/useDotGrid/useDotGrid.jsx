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
 * @param {number}  [threshold=0.05]  - Fraction of grid visible before triggering.
 * @param {boolean} [replayHero=true] - Re-animate grids inside .section on re-entry.
 */
export function useDotGrid({ threshold = 0.05, replayHero = true } = {}) {
  useEffect(() => {
    const grids = document.querySelectorAll('.dot-grid');
    if (!grids.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const isReplayable = replayHero && target.closest('.section');

        if (isIntersecting) {
          // Guard: skip classList write if already revealed to avoid forced style recalc
          if (!target.classList.contains('dot-grid--revealed')) {
            target.classList.add('dot-grid--revealed');
          }
          if (!isReplayable) observer.unobserve(target);
        } else if (isReplayable) {
          target.classList.remove('dot-grid--revealed');
        }
      });
    }, { threshold });

    grids.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, replayHero]);
}