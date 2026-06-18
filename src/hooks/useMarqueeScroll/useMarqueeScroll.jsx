import { useEffect } from 'react';

// ── Module-level utilities ───────────────────────────────────────────────────
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const WINDOW    = 5;    // rolling-average sample count
const MAX_DELTA = 200;  // ignore scroll jumps larger than this (px)

/**
 * useMarqueeScroll
 *
 * Drives every .marquee-track purely via RAF + CSS transform.
 * No CSS animation is used — this avoids all playbackRate jitter.
 *
 * @param {object} [options]
 * @param {number} [options.baseSpeed=0.5]    px/frame at rest
 * @param {number} [options.boost=2.5]        speed multiplier added while scrolling
 * @param {number} [options.ease=0.06]        lerp rate: current → target speed
 * @param {number} [options.decay=0.12]       lerp rate: boost → 0 after scroll stops
 * @param {number} [options.sensitivity=0.25] scroll px → boost amount
 */
export function useMarqueeScroll({
  baseSpeed   = 1.0,
  boost       = 4.0,
  ease        = 0.06,
  decay       = 0.08,
  sensitivity = 0.4,
} = {}) {
  useEffect(() => {

    // ── Per-track state ────────────────────────────────────────────────────
    let tracks = [];

    const initTracks = () => {
      tracks = Array.from(document.querySelectorAll('.marquee-track')).map(el => {
        // Disable CSS animation entirely — JS owns the transform from here
        el.style.animation  = 'none';
        el.style.willChange = 'transform';

        const rtl  = el.closest('.marquee--rtl') !== null;
        const halfW = el.scrollWidth / 2;
        // RTL starts at -halfW so the seam is off-screen immediately
        const offset = rtl ? -halfW : 0;

        return { el, halfW, offset, rtl };
      });
    };

    // ── Velocity state ─────────────────────────────────────────────────────
    let boostTarget  = 0;
    let scrollBoost  = 0;
    let currentSpeed = baseSpeed;
    let lastY        = window.scrollY;
    let rafId        = null;

    const ring = new Float32Array(WINDOW);
    let rIdx = 0;
    let rSum = 0;

    // ── RAF loop ───────────────────────────────────────────────────────────
    const tick = () => {
      boostTarget = lerp(boostTarget, 0,           decay);
      scrollBoost = lerp(scrollBoost, boostTarget, ease);

      const targetSpeed = baseSpeed + scrollBoost * boost;
      currentSpeed      = lerp(currentSpeed, targetSpeed, ease);

      for (let i = 0; i < tracks.length; i++) {
        const t   = tracks[i];
        const dir = t.rtl ? 1 : -1;

        t.offset += currentSpeed * dir;

        // Seamless loop — reset by exactly one content-copy width
        if (!t.rtl && t.offset <= -t.halfW) t.offset += t.halfW;
        if ( t.rtl && t.offset >=  0)       t.offset -= t.halfW;

        t.el.style.transform = `translate3d(${t.offset}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    // ── Scroll handler ─────────────────────────────────────────────────────
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;

      if (delta > MAX_DELTA) return;

      rSum      -= ring[rIdx];
      ring[rIdx] = delta;
      rSum      += delta;
      rIdx       = (rIdx + 1) % WINDOW;

      boostTarget = clamp((rSum / WINDOW) * sensitivity, 0, 1);
    };

    // ── Visibility guard ───────────────────────────────────────────────────
    const onVisible = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else {
        lastY = window.scrollY;
        if (!rafId) rafId = requestAnimationFrame(tick);
      }
    };

    // ── Init ───────────────────────────────────────────────────────────────
    rafId = requestAnimationFrame(() => {
      initTracks();
      rafId = requestAnimationFrame(tick);
    });

    window.addEventListener('scroll',             onScroll,  { passive: true });
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('scroll',             onScroll);
      document.removeEventListener('visibilitychange', onVisible);
      cancelAnimationFrame(rafId);

      tracks.forEach(t => {
        t.el.style.transform  = '';
        t.el.style.animation  = '';
        t.el.style.willChange = '';
      });
    };
  }, [baseSpeed, boost, ease, decay, sensitivity]);
}