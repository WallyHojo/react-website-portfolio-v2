import { useEffect, useRef } from 'react';

/**
 * useMagneticSVG
 *
 * Reads the --mx / --my custom properties that useMagnetic writes to a
 * magnetic element and forwards them as pixel translations to a target
 * SVG element (typically an <image>).
 *
 * This is necessary because SVG elements do not respond to the CSS
 * `transform: translate(calc(var(--mx) * var(--strength)))` pattern that
 * useMagnetic uses for HTML elements — SVG transforms work differently and
 * CSS custom properties inside SVG transforms are unreliable cross-browser.
 *
 * Instead this hook polls --mx / --my on the magnetic source element each
 * frame and applies a pixel translation directly to the SVG target element.
 *
 * @param {React.RefObject} magnetRef  — ref on the .magnetic overlay element
 * @param {React.RefObject} targetRef  — ref on the SVG element to translate
 * @param {number}          [strength] — max pixel shift (default 12)
 *
 * Usage:
 *   const magnetRef = useRef(null);
 *   const imageRef  = useRef(null);
 *   useMagneticSVG(magnetRef, imageRef, 12);
 *
 *   <image ref={imageRef} … />
 *   <rect  ref={magnetRef} className='magnetic magnetic--subtle' … />
 */
export function useMagneticSVG(magnetRefs, targetRefs, strength = 12) {
  const rafId = useRef(null);

  useEffect(() => {
    const pairs = magnetRefs.map((magRef, i) => ({
      mag:    magRef.current,
      target: targetRefs[i].current,
    })).filter(({ mag, target }) => mag && target);

    const tick = () => {
      pairs.forEach(({ mag, target }) => {
        const mx = parseFloat(getComputedStyle(mag).getPropertyValue('--mx')) || 0;
        const my = parseFloat(getComputedStyle(mag).getPropertyValue('--my')) || 0;

        target.style.setProperty('--mag-x', `${mx * strength}px`);
        target.style.setProperty('--mag-y', `${my * strength}px`);
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [magnetRefs, targetRefs, strength]);
}