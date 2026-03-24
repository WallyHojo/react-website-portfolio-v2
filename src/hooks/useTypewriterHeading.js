import { useState, useRef, useEffect } from 'react';

// ── Module-level constants ────────────────────────────────────────────────────
const TYPING_SPEED   = 80;
const DELETING_SPEED = 40;
const PAUSE_TIME     = 1500;

const DEFAULT_HEADINGS = [];

// ── Hook ──────────────────────────────────────────────────────────────────────
/**
 * useTypewriterHeading
 *
 * Cycles through a headings array with a typewriter effect.
 * Accepts a page-specific headings array — fully reusable across any page.
 * Returns the current display string.
 *
 * @param {string[]} headings — Array of strings to cycle through.
 *                              Falls back to an empty array if not provided.
 *
 * Usage:
 *   const displayHeading = useTypewriterHeading(['Design', 'Build', 'Ship']);
 *   <h1>{displayHeading}</h1>
 */
export function useTypewriterHeading(headings = DEFAULT_HEADINGS) {
  const [displayHeading, setdisplayHeading] = useState('\u00A0');
  const headingIndex = useRef(0);
  const charIndex    = useRef(0);
  const isDeleting   = useRef(false);
  const timeoutId    = useRef(null);

  // Stable ref to the headings array — the effect never needs to re-run
  // when the parent re-renders with a new array reference.
  const headingsRef = useRef(headings);
  useEffect(() => { headingsRef.current = headings; }, [headings]);

  useEffect(() => {
    if (!headingsRef.current.length) return;

    const schedule = (fn, delay) => {
      // Always clear before scheduling — prevents duplicate loops
      // if typeEffect is called more than once (e.g. visibility change).
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(fn, delay);
    };

    const typeEffect = () => {
      const list    = headingsRef.current;
      const current = list[headingIndex.current % list.length];

      if (!isDeleting.current && charIndex.current < current.length) {
        // Still typing
        charIndex.current++;
        setdisplayHeading(current.substring(0, charIndex.current));
        schedule(typeEffect, TYPING_SPEED);

      } else if (!isDeleting.current) {
        // Finished typing — pause then start deleting.
        // No state update needed: text is already fully displayed.
        isDeleting.current = true;
        schedule(typeEffect, PAUSE_TIME);

      } else if (charIndex.current > 0) {
        // Still deleting
        charIndex.current--;
        const text = current.substring(0, charIndex.current);
        setdisplayHeading(text || '\u00A0'); // hold layout when empty
        schedule(typeEffect, DELETING_SPEED);

      } else {
        // Finished deleting — advance to next heading
        isDeleting.current   = false;
        headingIndex.current = (headingIndex.current + 1) % list.length;
        schedule(typeEffect, TYPING_SPEED);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Cancel pending timeout — won't fire while tab is hidden.
        // Restarting on visibility restore picks up from current ref state.
        clearTimeout(timeoutId.current);
      } else {
        typeEffect();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    typeEffect();

    return () => {
      clearTimeout(timeoutId.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return displayHeading;
}