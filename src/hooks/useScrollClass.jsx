import { useEffect, useRef } from 'react';

/**
 * useScrollClass
 *
 * Adds a class to a target element when the page scrolls past
 * a given offset, and removes it when scrolling back above it.
 *
 * Uses a ref-based approach — no state, no re-renders.
 * Class is applied directly to the DOM element for zero overhead.
 *
 * @param {React.RefObject} ref         — Ref attached to the target element
 * @param {string}          className   — Class to toggle (default: 'scrolled')
 * @param {number}          offset      — Scroll position threshold in px (default: 0)
 *
 * Usage:
 *   const navRef = useRef(null);
 *   useScrollClass(navRef, 'scrolled', 150);
 *   <nav ref={navRef}>...</nav>
 */
export function useScrollClass(ref, className = 'scrolled', offset = 0) {
  // Cache the last known state to avoid redundant classList mutations
  const isActive = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = null;

    const update = () => {
      const shouldBeActive = window.scrollY > offset;

      // Only touch the DOM when state actually changes
      if (shouldBeActive !== isActive.current) {
        isActive.current = shouldBeActive;
        el.classList.toggle(className, shouldBeActive);
      }

      rafId = null;
    };

    const onScroll = () => {
      // RAF-throttle: at most one DOM update per frame
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    // Set correct class on mount without waiting for first scroll
    update();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref, className, offset]);
}