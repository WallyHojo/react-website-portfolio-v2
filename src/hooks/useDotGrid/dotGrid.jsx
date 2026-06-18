import { useMemo, useRef, useState, useEffect, memo } from 'react';

/**
 * DotGrid
 *
 * Renders a dot grid that animates in when it enters the viewport.
 * Requires useDotGrid() at the app root and useDotGrid.css imported there.
 *
 * Performance strategy: dots are not rendered until the grid is near the
 * viewport (rootMargin: 200px). Off-screen grids render a cheap placeholder
 * div at the same dimensions, so layout is stable and scroll is smooth.
 * Once revealed, dots stay in the DOM so the CSS stagger animation plays
 * correctly and re-entry replay works as before.
 *
 * @param {number}   [cols=24]        - Number of columns.
 * @param {number}   [count]          - Total dots. Defaults to cols × 8.
 * @param {string}   [color='cream']  - 'cream' | 'red' | 'blue' | 'green' | 'amber' | 'violet' | 'dim'
 * @param {string}   [pattern='wave'] - 'wave' | 'rows' | 'scatter' | 'diagonal' | 'snake' | 'ripple'
 * @param {string}   [size]           - 'small' | 'large' (omit for default)
 * @param {boolean}  [magnetic=false] - Apply magnetic styles to dots
 * @param {string}   [className]      - Extra classes for positioning / opacity.
 * @param {object}   [style]          - Extra inline styles.
 *
 * Usage:
 *   <DotGrid color="cream" pattern="wave" cols={32} className="hero__dots" />
 *   <DotGrid color="violet" pattern="ripple" size="large" className="backdrop-dots" />
 *   <DotGrid color="surface" pattern="scatter" size="small" cols={30} count={500} className="backdrop-dots hidden-mobile" magnetic />
 */
export const DotGrid = memo(function DotGrid({
  cols = 24,
  count,
  color = 'cream',
  pattern = 'wave',
  size,
  magnetic = false,
  className,
  style,
}) {
  const dotCount = count ?? cols * 8;
  const wrapperRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Defer dot rendering until the grid is within 200px of the viewport.
  // Off-screen grids cost almost nothing — no spans, no style recalc, no
  // paint — until the user is actually about to scroll to them.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // If already in view on mount (e.g. above-the-fold hero), render immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect(); // dots stay rendered once created — no need to keep watching
        }
      },
      { rootMargin: '200px' } // pre-render 200px before entering viewport so there's no pop-in
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Memoize dot array — only recreates if dotCount or magnetic changes
  const dots = useMemo(() => {
    if (!shouldRender) return null;
    const dotClass = magnetic ? 'dot magnetic magnetic--subtle' : 'dot';
    return Array.from({ length: dotCount }, (_, i) => (
      <span key={i} className={dotClass} />
    ));
  }, [shouldRender, dotCount, magnetic]);

  const classes = [
    'dot-grid',
    `dot-grid--${color}`,
    `dot-grid--${pattern}`,
    size && `dot-grid--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={wrapperRef}
      className={classes}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, ...style }}
    >
      {dots}
    </div>
  );
});