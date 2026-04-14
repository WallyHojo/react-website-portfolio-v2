import { useState, useRef, useEffect } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPING_SPEED   = 80;   // ms per character typed
const DELETING_SPEED = 40;   // ms per character deleted
const PAUSE_TIME     = 1500; // ms to hold the completed word before deleting
const NBSP           = '\u00A0'; // layout-preserving empty state

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Cycles through `headings` with a typewriter effect.
 * Returns the current display string; re-renders only on character changes.
 *
 * @param {string[]} headings - Strings to cycle through.
 * @returns {string}
 *
 * @example
 *   const text = useTypewriterHeading(['Design', 'Build', 'Ship']);
 *   return <h1>{text}</h1>;
 */
export function useTypewriterHeading(headings = []) {
  const [display, setDisplay] = useState(NBSP);

  // Refs for mutable loop state — no re-renders, no stale closures.
  const headingsRef    = useRef(headings);
  const headingIndex   = useRef(0);
  const charIndex      = useRef(0);
  const isDeleting     = useRef(false);
  const timeoutId      = useRef(null);

  // Keep headingsRef current without restarting the effect.
  useEffect(() => { headingsRef.current = headings; }, [headings]);

  useEffect(() => {
    if (!headings.length) return;

    const schedule = (delay) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(tick, delay);
    };

    const tick = () => {
      const list    = headingsRef.current;
      const current = list[headingIndex.current % list.length];

      if (!isDeleting.current) {
        if (charIndex.current < current.length) {
          // Typing
          setDisplay(current.substring(0, ++charIndex.current));
          schedule(TYPING_SPEED);
        } else {
          // Word complete — pause before deleting
          isDeleting.current = true;
          schedule(PAUSE_TIME);
        }
      } else {
        if (charIndex.current > 0) {
          // Deleting
          setDisplay(current.substring(0, --charIndex.current) || NBSP);
          schedule(DELETING_SPEED);
        } else {
          // Word cleared — advance to next
          isDeleting.current = false;
          headingIndex.current = (headingIndex.current + 1) % list.length;
          schedule(TYPING_SPEED);
        }
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') clearTimeout(timeoutId.current);
      else tick();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    tick();

    return () => {
      clearTimeout(timeoutId.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}