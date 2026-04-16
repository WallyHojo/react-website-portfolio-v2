import { useMemo, memo } from 'react';
import './useMarqueeScroll.css';

/**
 * Marquee
 *
 * Renders a seamless looping marquee. Pass content as children — the component
 * duplicates it internally for the seamless-loop trick.
 *
 * Scroll-speed reactivity is provided by useMarqueeScroll(), which must be
 * mounted once above this component in the tree. This component owns no
 * scroll logic — it just renders the correct DOM structure and exposes the
 * right CSS custom properties for the animation to target.
 *
 * ─── CSS contract (useMarqueeScroll.css must define these) ───────────────────
 *
 *   .marquee-track
 *     animation: marquee var(--speed) linear infinite
 *     will-change: transform          ← MUST be in CSS, not inline style
 *                                        (promotes the layer before first paint)
 *
 *   .marquee--rtl .marquee-track
 *     animation-direction: reverse
 *
 *   .marquee--pausable:hover .marquee-track
 *     animation-play-state: paused
 *
 *   .marquee--faded
 *     mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Performance notes:
 *   • This component is wrapped in React.memo. Re-renders only happen when
 *     props change. To fully benefit, pass stable children (useMemo / static
 *     JSX at module scope) from the parent.
 *   • `--speed` and `--gap` are applied as CSS custom properties on the outer
 *     wrapper, not as Web Animations parameters, so changing them at runtime
 *     causes a CSS transition — not a JavaScript animation restart.
 *
 * @param {React.ReactNode} children    Marquee content (rendered twice internally)
 * @param {string}  [speed="20s"]       CSS duration for one full pass, e.g. "25s"
 * @param {boolean} [rtl=false]         Scroll right-to-left instead of left-to-right
 * @param {boolean} [pauseOnHover=false] Pause animation on mouse hover
 * @param {boolean} [faded=false]       Apply gradient fade on left/right edges
 * @param {string}  [gap="2rem"]        CSS gap between items, e.g. "3rem"
 * @param {string}  [className=""]      Extra classes on the outer wrapper
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
  // Recompute the class string only when modifier props change.
  // Stable on children/speed/gap changes — those are handled below.
  const wrapperClasses = useMemo(() => {
    let c = 'marquee';
    if (rtl)          c += ' marquee--rtl';
    if (pauseOnHover) c += ' marquee--pausable';
    if (faded)        c += ' marquee--faded';
    if (className)    c += ` ${className}`;
    return c;
  }, [rtl, pauseOnHover, faded, className]);

  // Stable style object — avoids React's style reconciler re-applying identical
  // inline styles on every parent render, which causes unnecessary repaints.
  const style = useMemo(
    () => ({ '--speed': speed, '--gap': gap }),
    [speed, gap],
  );

  return (
    <div className={wrapperClasses} style={style}>
      {/*
        .marquee-track is the element useMarqueeScroll targets via
        getAnimations(). Keep this class name stable — renaming it here
        without updating the hook will silently break scroll reactivity.
      */}
      <div className="marquee-track">
        <div className="marquee-content">{children}</div>
        {/* aria-hidden prevents screen readers traversing duplicated content */}
        <div className="marquee-content" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
});