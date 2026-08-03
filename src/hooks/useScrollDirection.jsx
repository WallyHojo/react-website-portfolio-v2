import { useEffect, useRef } from "react";

// Class names applied to <html>. Exported so other JS (tests, edge cases
// that need to check state outside of CSS) can reference them instead of
// re-typing string literals.
export const SCROLL_UP_CLASS = "scrolling-up";
export const SCROLL_DOWN_CLASS = "scrolling-down";

/**
 * useScrollDirection
 *
 * Global scroll-direction manager. Tracks whether the page is being
 * scrolled up or down and reflects that as a single class on the root
 * <html> element:
 *
 *   <html class="scrolling-up">    — scrolling up, or within `topOffset` of the top
 *   <html class="scrolling-down">  — scrolling down, past `topOffset`
 *
 * Only one of the two classes is ever present at a time.
 *
 * Any component anywhere in the app can react to scroll direction with
 * pure CSS — no context, no prop drilling, no extra JS:
 *
 *   html.scrolling-up   .my-component { ... }
 *   html.scrolling-down .my-component { ... }
 *
 * Mount this once near the app root (see App.jsx). It writes straight to
 * classList instead of React state, so it never triggers a re-render and
 * every consumer stays purely CSS-driven.
 *
 * @param {number} topOffset  px from the top treated as "always up" — a grace
 *                             zone so anything hooked to scrolling-up (like the
 *                             navbar) doesn't hide itself right at page load
 *                             or while gently bouncing near the top.
 * @param {number} threshold  minimum px delta before a direction flip is
 *                             registered — filters out sub-pixel/momentum
 *                             jitter so the class doesn't rapidly toggle.
 */
export function useScrollDirection({ topOffset = 96, threshold = 5 } = {}) {
  const lastScrollY = useRef(0);
  const currentDirection = useRef(null); // null until first resolved, then 'up' | 'down'
  const rafId = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const applyDirection = (direction) => {
      if (currentDirection.current === direction) return; // no-op: skip redundant DOM writes
      currentDirection.current = direction;
      const addClass = direction === "up" ? SCROLL_UP_CLASS : SCROLL_DOWN_CLASS;
      const removeClass = direction === "up" ? SCROLL_DOWN_CLASS : SCROLL_UP_CLASS;
      root.classList.remove(removeClass); // previous class is always cleared first —
      root.classList.add(addClass); //   the two classes can never coexist
    };

    const update = () => {
      rafId.current = null;

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      );
      // Clamp out iOS Safari's elastic overscroll (negative at top, past-max at bottom)
      // so a rubber-band bounce can't register as a spurious direction flip.
      const scrollY = Math.min(Math.max(window.scrollY, 0), maxScroll);

      const isFirstRun = currentDirection.current === null;

      // Always "up" near the top — nothing above to hide from yet.
      if (scrollY <= topOffset) {
        applyDirection("up");
        lastScrollY.current = scrollY;
        return;
      }

      if (isFirstRun) {
        // No prior position to diff against (e.g. a mid-page refresh). Default
        // to visible, matching a fresh page load, and use the real current
        // position as the baseline so the next genuine scroll computes a
        // sane delta instead of one measured from zero.
        applyDirection("up");
        lastScrollY.current = scrollY;
        return;
      }

      const delta = scrollY - lastScrollY.current;
      if (Math.abs(delta) < threshold) return; // ignore tiny/noisy movements

      applyDirection(delta > 0 ? "down" : "up");
      lastScrollY.current = scrollY;
    };

    const onScroll = () => {
      if (rafId.current) return; // at most one pending frame — collapses fast-scroll bursts
      rafId.current = requestAnimationFrame(update);
    };

    // Resolve the correct class immediately on mount — covers initial load,
    // a hard refresh mid-page, and route changes that land already scrolled.
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    // Reflow (rotation, devtools, browser chrome show/hide) can shift the
    // effective scroll position without a scroll event — re-check it.
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [topOffset, threshold]);
}
