import { useMemo } from 'react';

/**
 * DotGrid
 *
 * Renders a dot grid that animates in when it enters the viewport.
 * Requires useDotGrid() at the app root and useDotGrid.css imported there.
 *
 * @param {number}  [cols=24]         - Number of columns.
 * @param {number}  [count]           - Total dots. Defaults to cols × 8.
 * @param {string}  [color='cream']   - 'cream' | 'red' | 'blue' | 'green' | 'amber' | 'violet' | 'dim'
 * @param {string}  [pattern='wave']  - 'wave' | 'rows' | 'scatter' | 'diagonal' | 'snake' | 'ripple'
 * @param {string}  [size]            - 'small' | 'large' (omit for default)
 * @param {string}  [className]       - Extra classes for positioning / opacity.
 * @param {object}  [style]           - Extra inline styles.
 *
 * Usage:
 *   <DotGrid color="cream" pattern="wave" cols={32} className="hero__dots" />
 *   <DotGrid color="violet" pattern="ripple" size="large" className="backdrop-dots" />
 */
export function DotGrid({ cols = 24, count, color = 'cream', pattern = 'wave', size, className, style }) {
  const dotCount = count ?? cols * 8;
  const dots = useMemo(() => Array.from({ length: dotCount }, (_, i) => <span key={i} className='dot' />), [dotCount]);

  const classes = ['dot-grid', `dot-grid--${color}`, `dot-grid--${pattern}`, size && `dot-grid--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, ...style }}>
      {dots}
    </div>
  );
}
