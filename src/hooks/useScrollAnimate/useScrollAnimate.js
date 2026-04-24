/**
 * useScrollAnimate.js
 *
 * Two hooks, zero dependencies beyond a ref. Import the companion CSS alongside.
 *
 * ── useSA ─────────────────────────────────────────────────────────────────────
 * Bootstraps the animation engine once for the page. Call at the app root.
 *
 * ── useSARouteSync ────────────────────────────────────────────────────────────
 * Pass location.pathname from useLocation() to re-animate on route changes.
 *
 * ── useSAReplay ───────────────────────────────────────────────────────────────
 * Re-animates all [sa] children each time a container becomes visible.
 *
 * ── Counter animation ─────────────────────────────────────────────────────────
 * Add sa="count" to animate a number when the element enters the viewport.
 *
 * Data attributes:
 *   data-sa-to        {number}  Target value (required)
 *   data-sa-from      {number}  Start value (default: 0)
 *   data-sa-duration  {number}  Duration ms (default: 1500)
 *   data-sa-prefix    {string}  Prepended to the number (e.g. "$")
 *   data-sa-suffix    {string}  Appended to the number  (e.g. "%", "+")
 *   data-sa-decimals  {number}  Fixed decimal places (default: 0)
 *   data-sa-separator {string}  Thousands separator (default: "")
 */

import { useEffect } from 'react';
import './useScrollAnimate.css';


// ─────────────────────────────────────────────────────────────────────────────
// § 1 · Constants
// ─────────────────────────────────────────────────────────────────────────────

const SELECTOR = '[sa]';
const COUNTER_DURATION_MS = 1500;

const MAIN_OBSERVER_OPTIONS = {
  threshold: 0.1,
  rootMargin: window.innerWidth < 768 ? '0px 0px 100px 0px' : '0px 0px -50px 0px',
};

const CLS = {
  visible:   'sa-visible',
  prepare:   'sa-prepare',
  enterDown: 'sa-enter-down',
  enterUp:   'sa-enter-up',
  exitDown:  'sa-exit-down',
  exitUp:    'sa-exit-up',
};

const ALL_STATE_CLASSES   = Object.values(CLS);
const DIRECTIONAL_CLASSES = [CLS.enterDown, CLS.enterUp, CLS.exitDown, CLS.exitUp];


// ─────────────────────────────────────────────────────────────────────────────
// § 2 · Module-level singletons
// ─────────────────────────────────────────────────────────────────────────────

let mainObserver        = null;
let replayObserver      = null;
let scrollDirection     = 'down';
let lastScrollY         = 0;
let scrollListenerBound = false;
let saRefCount          = 0;

const counterRAFs = new WeakMap();


// ─────────────────────────────────────────────────────────────────────────────
// § 3 · Helpers
// ─────────────────────────────────────────────────────────────────────────────

const getMods = el =>
  new Set((el.getAttribute('sa') || '').split(/\s+/).filter(Boolean));

const easeOutCubic = t => 1 - (1 - t) ** 3;

function formatCounter(value, el) {
  const { saDecimals = '0', saSeparator = '', saPrefix = '', saSuffix = '' } = el.dataset;
  let str = value.toFixed(parseInt(saDecimals, 10));
  if (saSeparator) {
    const [int, dec] = str.split('.');
    const formatted  = int.replace(/\B(?=(\d{3})+(?!\d))/g, saSeparator);
    str = dec !== undefined ? `${formatted}.${dec}` : formatted;
  }
  return `${saPrefix}${str}${saSuffix}`;
}

const resolveCounterDuration = el =>
  parseInt(el.dataset.saDuration, 10) ||
  parseInt(getComputedStyle(el).getPropertyValue('--sa-duration'), 10) ||
  COUNTER_DURATION_MS;


// ─────────────────────────────────────────────────────────────────────────────
// § 4 · Counter animation
// ─────────────────────────────────────────────────────────────────────────────

const cancelCounter = el => {
  if (counterRAFs.has(el)) { cancelAnimationFrame(counterRAFs.get(el)); counterRAFs.delete(el); }
};

const resetCounter = el => {
  cancelCounter(el);
  el.textContent = formatCounter(parseFloat(el.dataset.saFrom ?? '0'), el);
};

function startCounter(el) {
  cancelCounter(el);
  const from     = parseFloat(el.dataset.saFrom ?? '0');
  const to       = parseFloat(el.dataset.saTo   ?? '0');
  const duration = resolveCounterDuration(el);
  const start    = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = formatCounter(from + (to - from) * easeOutCubic(p), el);
    if (p < 1) {
      counterRAFs.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = formatCounter(to, el);
      counterRAFs.delete(el);
    }
  };

  counterRAFs.set(el, requestAnimationFrame(tick));
}


// ─────────────────────────────────────────────────────────────────────────────
// § 5 · Observer factories
// ─────────────────────────────────────────────────────────────────────────────

function getMainObserver() {
  if (mainObserver) return mainObserver;

  mainObserver = new IntersectionObserver((entries, observer) => {
    for (const { target: el, isIntersecting } of entries) {
      el.classList.remove(...DIRECTIONAL_CLASSES);
      const mods = getMods(el);
      const dir  = scrollDirection;

      if (isIntersecting) {
        if (mods.has('down-only') && dir !== 'down') continue;
        if (mods.has('up-only')   && dir !== 'up')   continue;
        el.classList.add(CLS.prepare, CLS.visible, dir === 'down' ? CLS.enterDown : CLS.enterUp);
        if (mods.has('count')) startCounter(el);
        if (!mods.has('repeat') && !mods.has('mirror')) observer.unobserve(el);
      } else {
        el.classList.add(dir === 'down' ? CLS.exitDown : CLS.exitUp);
        if (mods.has('repeat') || mods.has('mirror')) {
          el.classList.remove(CLS.visible);
          if (mods.has('count')) resetCounter(el);
        }
      }
    }
  }, MAIN_OBSERVER_OPTIONS);

  mainObserver._onTransitionEnd = ({ target }) => {
    if (target?.hasAttribute('sa')) target.classList.remove(CLS.prepare);
  };
  document.addEventListener('transitionend', mainObserver._onTransitionEnd, { passive: true });

  return mainObserver;
}

function getReplayObserver() {
  if (replayObserver) return replayObserver;

  replayObserver = new IntersectionObserver(entries => {
    const observer = getMainObserver();
    for (const { target: container, isIntersecting } of entries) {
      const children = [...container.querySelectorAll(SELECTOR)];
      children.forEach(el => {
        el.classList.remove(...ALL_STATE_CLASSES);
        if (getMods(el).has('count')) resetCounter(el);
        observer.unobserve(el);
      });
      if (isIntersecting) requestAnimationFrame(() => children.forEach(el => observer.observe(el)));
    }
  }, { threshold: 0 });

  return replayObserver;
}


// ─────────────────────────────────────────────────────────────────────────────
// § 6 · Teardown + re-init
// ─────────────────────────────────────────────────────────────────────────────

function teardownMainObserver() {
  if (!mainObserver) return;
  document.removeEventListener('transitionend', mainObserver._onTransitionEnd);
  mainObserver.disconnect();
  mainObserver = null;
}

function reinitializeAnimations() {
  const observer = getMainObserver();
  document.querySelectorAll(SELECTOR).forEach(el => {
    el.classList.remove(...ALL_STATE_CLASSES);
    if (getMods(el).has('count')) resetCounter(el);
    observer.unobserve(el);
    observer.observe(el);
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// § 7 · Public React hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useSA() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.add(CLS.visible));
      return;
    }

    saRefCount++;

    if (!scrollListenerBound) {
      lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
        scrollDirection = window.scrollY >= lastScrollY ? 'down' : 'up';
        lastScrollY = window.scrollY;
      }, { passive: true });
      scrollListenerBound = true;
    }

    document.querySelectorAll(SELECTOR).forEach(el => getMainObserver().observe(el));

    const handlePageShow = e => { if (e.persisted) reinitializeAnimations(); };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if (--saRefCount === 0) teardownMainObserver();
    };
  }, []);
}

/**
 * Re-initializes all [sa] elements on every route change.
 * Call inside <Router> in AppInner, passing location.pathname from useLocation().
 *
 * Usage:
 *   import { useLocation } from 'react-router-dom';
 *   const location = useLocation();
 *   useSARouteSync(location.pathname);
 *
 * @param {string} pathname - current route path
 */
export function useSARouteSync(pathname) {
  useEffect(() => {
    requestAnimationFrame(reinitializeAnimations);
  }, [pathname]);
}

export function useSAReplay(containerRef) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = getReplayObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [containerRef]);
}