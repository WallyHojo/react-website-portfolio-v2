/**
 * useScrollAnimate.js — v2.2 (React)
 *
 * Drop-in React port of scroll-animate.js v2.2.
 * Two hooks, zero dependencies, no wiring beyond a ref.
 *
 * ── useSA ────────────────────────────────────────────────────────────────────
 * Bootstraps the engine once for the page. Call it once at the app root.
 *
 *   import { useSA } from './useScrollAnimate';
 *   function App() {
 *     useSA();
 *     return <>{...}</>
 *   }
 *
 * ── useSAReplay ──────────────────────────────────────────────────────────────
 * Attach to any container whose [sa] children should re-animate every time
 * the container becomes visible — overlays, drawers, dropdowns, accordions,
 * tabs, dialogs, anything.
 *
 *   import { useRef } from 'react';
 *   import { useSAReplay } from './useScrollAnimate';
 *
 *   function NavOverlay() {
 *     const ref = useRef(null);
 *     useSAReplay(ref);
 *     return (
 *       <div ref={ref}>
 *         <h2 sa="up">Hello</h2>
 *         <p  sa="up delay-100">World</p>
 *       </div>
 *     );
 *   }
 *
 * Works with any show/hide mechanism — class toggles, display, visibility,
 * pointer-events, transforms. No prop threading required.
 */

import { useEffect } from 'react';
import './useScrollAnimate.css';

// ── Constants ─────────────────────────────────────────────────────────────────
const SEL       = '[sa]';
const VISIBLE   = 'sa-visible';
const PREPARE   = 'sa-prepare';
const THRESHOLD = 0.1;
const MARGIN    = '0px 0px -50px 0px';
const STATE     = [VISIBLE, PREPARE, 'sa-enter-down', 'sa-enter-up', 'sa-exit-down', 'sa-exit-up'];

// ── Shared singletons ─────────────────────────────────────────────────────────
// Held at module scope so every hook instance shares one IO + one cache.
let _observer       = null;
let _replayObserver = null;
let _scrollDir      = 'down';
let _lastY          = 0;
let _scrollBound    = false;

// Initialized at declaration — eliminates getCache() wrapper and its
// null-check on every IntersectionObserver callback invocation.
const _cache = new WeakMap();

// Reads [sa] attribute value once per element, caches in WeakMap.
function getMods(el) {
  if (!_cache.has(el)) _cache.set(el, el.getAttribute('sa') || '');
  return _cache.get(el);
}

function bindScroll() {
  if (_scrollBound) return;
  _lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    _scrollDir = window.scrollY >= _lastY ? 'down' : 'up';
    _lastY     = window.scrollY;
  }, { passive: true });
  _scrollBound = true;
}

function getObserver() {
  if (_observer) return _observer;

  _observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target: el, isIntersecting }) => {
      const mods     = getMods(el);
      // isRepeat subsumes isMirror — no need for a separate variable
      const isRepeat = mods.includes('repeat') || mods.includes('mirror');

      el.classList.remove('sa-enter-down', 'sa-enter-up', 'sa-exit-down', 'sa-exit-up');

      if (isIntersecting) {
        if (mods.includes('down-only') && _scrollDir !== 'down') return;
        if (mods.includes('up-only')   && _scrollDir !== 'up')   return;
        el.classList.add(PREPARE, VISIBLE, `sa-enter-${_scrollDir}`);
        if (!isRepeat) _observer.unobserve(el);
      } else {
        el.classList.add(`sa-exit-${_scrollDir}`);
        if (isRepeat) el.classList.remove(VISIBLE);
      }
    });
  }, { threshold: THRESHOLD, rootMargin: MARGIN });

  // Free GPU layer after transition.
  // hasAttribute is always defined on Element — optional chaining removed.
  document.addEventListener('transitionend', (e) => {
    if (e.target.hasAttribute('sa')) e.target.classList.remove(PREPARE);
  }, { passive: true });

  return _observer;
}

function getReplayObserver() {
  if (_replayObserver) return _replayObserver;

  _replayObserver = new IntersectionObserver((entries) => {
    // Resolved once per batch — not inside forEach on every entry
    const obs = getObserver();

    entries.forEach(({ target: container, isIntersecting }) => {
      const children = container.querySelectorAll(SEL);

      // Reset is shared between both branches — done once per child
      children.forEach(el => {
        el.classList.remove(...STATE);
        obs.unobserve(el);
      });

      if (isIntersecting) {
        requestAnimationFrame(() => {
          children.forEach(el => obs.observe(el));
        });
      }
    });
  }, { threshold: 0 });

  return _replayObserver;
}

// ── useSA ─────────────────────────────────────────────────────────────────────
// Bootstraps the engine. Call once at the app root.
// Safe to call in StrictMode — initialisation is idempotent.
export function useSA() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SEL).forEach(el => el.classList.add(VISIBLE));
      return;
    }

    bindScroll();
    const obs = getObserver();
    document.querySelectorAll(SEL).forEach(el => obs.observe(el));
  }, []);
}

// ── useSAReplay ───────────────────────────────────────────────────────────────
// Attach to any container that should replay its [sa] children on every show.
export function useSAReplay(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const replay = getReplayObserver();
    replay.observe(el);
    return () => replay.unobserve(el);
  }, [ref]);
}