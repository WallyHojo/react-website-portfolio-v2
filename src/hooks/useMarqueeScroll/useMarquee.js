import { useMemo, memo } from 'react';
import './useMarqueeScroll.css';

/**
 * Marquee
 *
 * Renders a seamless looping marquee. Drop items as children —
 * the component duplicates them automatically for the loop trick.
 *
 * The scroll-speed reactivity comes from useMarqueeScroll(), which
 * must be mounted once somewhere above this component in the tree.
 * This component owns no scroll logic of its own.
 *
 * @param {React.ReactNode} children   — Marquee content (rendered twice)
 * @param {string}  speed              — CSS time value for one full pass, e.g. "25s"
 * @param {boolean} rtl                — Scroll right-to-left instead
 * @param {boolean} pauseOnHover       — Pause animation on mouse hover
 * @param {boolean} faded              — Apply gradient fade on left/right edges
 * @param {string}  gap                — CSS gap between items, e.g. "3rem"
 * @param {string}  className          — Extra classes on the outer wrapper
 */
export const Marquee = memo(function Marquee({
  children,
  speed        = '20s',
  rtl          = false,
  pauseOnHover = false,
  faded        = false,
  gap          = '2rem',
  className    = '',
}) {
  // Recompute only when the relevant props change — not on every render
  const wrapperClasses = useMemo(() => {
    let c = 'marquee';
    if (rtl)          c += ' marquee--rtl';
    if (pauseOnHover) c += ' marquee--pausable';
    if (faded)        c += ' marquee--faded';
    if (className)    c += ` ${className}`;
    return c;
  }, [rtl, pauseOnHover, faded, className]);

  // Stable object reference — avoids unnecessary style reconciliation
  const style = useMemo(
    () => ({ '--speed': speed, '--gap': gap }),
    [speed, gap]
  );

  return (
    <div className={wrapperClasses} style={style}>
      <div className="marquee-track">
        <div className="marquee-content">{children}</div>
        <div className="marquee-content" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
});