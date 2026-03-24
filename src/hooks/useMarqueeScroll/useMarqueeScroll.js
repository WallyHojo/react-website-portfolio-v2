import { useEffect } from 'react';

// ── Module-level utilities ───────────────────────────────────────────────────
// Defined once per module, not recreated on every useEffect run.
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const WINDOW  = 5;      // rolling average sample count
const EPSILON = 0.0005; // settle threshold
const MAX_DELTA = 200;  // discard jumps larger than this (px)

/**
 * useMarqueeScroll
 *
 * Controls marquee speed via playbackRate on each .marquee-track
 * Web Animation — not by mutating animation-duration, which
 * compounds floating-point drift over time.
 *
 * Mount once above any <Marquee> components in the tree.
 *
 * @param {object} [options]
 * @param {number} [options.boost=1.75]       Peak playbackRate above 1
 * @param {number} [options.ease=0.08]        Lerp rate speed → velTarget
 * @param {number} [options.decay=0.16]       Lerp rate velTarget → 0 per frame
 * @param {number} [options.sensitivity=0.18] Scroll px → velocity (pre-clamp)
 */
export function useMarqueeScroll({
  boost       = 1.75,
  ease        = 0.08,
  decay       = 0.16,
  sensitivity = 0.18,
} = {}) {
  useEffect(() => {
    // ── State ──────────────────────────────────────────────────────────────
    let velTarget = 0;
    let speed     = 0;
    let lastY     = window.scrollY;
    let rafId     = null;
    let anims     = [];

    // Ring buffer — avoids % on unbounded dIdx and keeps sum O(1)
    const ring = new Float32Array(WINDOW); // typed array: faster alloc + access
    let   rIdx = 0;
    let   rSum = 0;

    // ── Animation cache ────────────────────────────────────────────────────
    const getAnims = () => {
      anims = Array.from(document.querySelectorAll('.marquee-track'))
        .reduce((acc, el) => {
          el.getAnimations().forEach(a => {
            if (a.playState !== 'finished') acc.push(a);
          });
          return acc;
        }, []);
    };

    // applyRate is called every RAF frame — keep it lean
    const applyRate = (rate) => {
      for (let i = 0; i < anims.length; i++) anims[i].playbackRate = rate;
    };

    // ── Reset ──────────────────────────────────────────────────────────────
    const reset = () => {
      velTarget = 0;
      speed     = 0;
      lastY     = window.scrollY;
      rSum      = 0;
      ring.fill(0);
      rIdx = 0;
      applyRate(1);
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    };

    // ── RAF tick ───────────────────────────────────────────────────────────
    const tick = () => {
      velTarget = lerp(velTarget, 0,         decay);
      speed     = lerp(speed,     velTarget, ease);

      // Cheapest exit first — avoids applyRate call when already settled
      if (speed < EPSILON && velTarget < EPSILON) {
        speed = velTarget = 0;
        applyRate(1);
        rafId = null;
        return;
      }

      applyRate(1 + speed * boost);
      rafId = requestAnimationFrame(tick);
    };

    // ── Scroll handler ─────────────────────────────────────────────────────
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;

      if (delta > MAX_DELTA) return;

      // O(1) rolling average via running sum — no reduce() per event
      rSum       -= ring[rIdx];
      ring[rIdx]  = delta;
      rSum       += delta;
      rIdx        = (rIdx + 1) % WINDOW;

      velTarget = clamp((rSum / WINDOW) * sensitivity, 0, 1);

      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    // ── Visibility / focus guards ──────────────────────────────────────────
    const onVisible = () => { if (document.visibilityState === 'visible') reset(); };

    // ── Init ───────────────────────────────────────────────────────────────
    // One deferred frame lets React finish painting marquee elements
    rafId = requestAnimationFrame(() => { getAnims(); rafId = null; });

    window.addEventListener('scroll',             onScroll,  { passive: true });
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus',              reset);

    return () => {
      window.removeEventListener('scroll',             onScroll);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus',              reset);
      reset();
    };
  }, [boost, ease, decay, sensitivity]);
}