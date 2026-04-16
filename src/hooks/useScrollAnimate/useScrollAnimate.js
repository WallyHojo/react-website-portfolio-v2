/**
 * useScrollAnimate.js
 *
 * Two hooks, zero dependencies beyond a ref. Import the companion CSS alongside.
 *
 * ── useSA ────────────────────────────────────────────────────────────────────
 * Bootstraps the animation engine once for the page. Call at the app root.
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

/** @enum {string} */
const CLS = {
  visible:   'sa-visible',
  prepare:   'sa-prepare',
  enterDown: 'sa-enter-down',
  enterUp:   'sa-enter-up',
  exitDown:  'sa-exit-down',
  exitUp:    'sa-exit-up',
};

const ALL_STATE_CLASSES    = Object.values(CLS);
const DIRECTIONAL_CLASSES  = [CLS.enterDown, CLS.enterUp, CLS.exitDown, CLS.exitUp];


// ─────────────────────────────────────────────────────────────────────────────
// § 2 · Module-level singletons
// ─────────────────────────────────────────────────────────────────────────────

/** @type {IntersectionObserver|null} */
let mainObserver = null;

/** @type {IntersectionObserver|null} */
let replayObserver = null;

/** @type {'down'|'up'} */
let scrollDirection = 'down';
let lastScrollY = 0;
let scrollListenerBound = false;

// ✅ Fix: track how many useSA() instances are active so we can tear down the
//    singleton when the last consumer unmounts (important for HMR / StrictMode)
let saRefCount = 0;

const modifierCache = new WeakMap();
const counterRAFs   = new WeakMap();


// ─────────────────────────────────────────────────────────────────────────────
// § 3 · Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

function getMods(el) {
  if (!modifierCache.has(el)) {
    modifierCache.set(el, new Set((el.getAttribute('sa') || '').split(/\s+/).filter(Boolean)));
  }
  return modifierCache.get(el);
}

const easeOutCubic = t => 1 - (1 - t) ** 3;

function formatCounter(value, el) {
  const { saDecimals = '0', saSeparator = '', saPrefix = '', saSuffix = '' } = el.dataset;
  const decimals = parseInt(saDecimals, 10);
  let str = value.toFixed(decimals);

  if (saSeparator) {
    const [int, dec] = str.split('.');
    const formatted  = int.replace(/\B(?=(\d{3})+(?!\d))/g, saSeparator);
    str = dec !== undefined ? `${formatted}.${dec}` : formatted;
  }

  return `${saPrefix}${str}${saSuffix}`;
}

function resolveCounterDuration(el) {
  if (el.dataset.saDuration) return parseInt(el.dataset.saDuration, 10);
  const cssVar = parseInt(getComputedStyle(el).getPropertyValue('--sa-duration') || '0', 10);
  return cssVar || COUNTER_DURATION_MS;
}


// ─────────────────────────────────────────────────────────────────────────────
// § 4 · Counter animation
// ─────────────────────────────────────────────────────────────────────────────

function cancelCounter(el) {
  if (counterRAFs.has(el)) {
    cancelAnimationFrame(counterRAFs.get(el));
    counterRAFs.delete(el);
  }
}

function resetCounter(el) {
  cancelCounter(el);
  el.textContent = formatCounter(parseFloat(el.dataset.saFrom ?? '0'), el);
}

function startCounter(el) {
  cancelCounter(el);
  const from      = parseFloat(el.dataset.saFrom ?? '0');
  const to        = parseFloat(el.dataset.saTo   ?? '0');
  const duration  = resolveCounterDuration(el);
  const startTime = performance.now();

  const tick = now => {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = formatCounter(from + (to - from) * easeOutCubic(progress), el);
    if (progress < 1) {
      counterRAFs.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = formatCounter(to, el);
      counterRAFs.delete(el);
    }
  };

  counterRAFs.set(el, requestAnimationFrame(tick));
}


// ─────────────────────────────────────────────────────────────────────────────
// § 5 · Scroll direction tracking
// ─────────────────────────────────────────────────────────────────────────────

function ensureScrollListener() {
  if (scrollListenerBound) return;
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollDirection = window.scrollY >= lastScrollY ? 'down' : 'up';
    lastScrollY = window.scrollY;
  }, { passive: true });
  scrollListenerBound = true;
}


// ─────────────────────────────────────────────────────────────────────────────
// § 6 · Intersection callbacks
// ─────────────────────────────────────────────────────────────────────────────

function onEnter(el, mods, observer) {
  if (mods.has('down-only') && scrollDirection !== 'down') return;
  if (mods.has('up-only')   && scrollDirection !== 'up')   return;

  el.classList.add(CLS.prepare, CLS.visible, scrollDirection === 'down' ? CLS.enterDown : CLS.enterUp);

  if (mods.has('count')) startCounter(el);
  if (!mods.has('repeat') && !mods.has('mirror')) observer.unobserve(el);
}

function onExit(el, mods) {
  el.classList.add(scrollDirection === 'down' ? CLS.exitDown : CLS.exitUp);
  if (!mods.has('repeat') && !mods.has('mirror')) return;
  el.classList.remove(CLS.visible);
  if (mods.has('count')) resetCounter(el);
}

function mainCallback(entries, observer) {
  for (const { target: el, isIntersecting } of entries) {
    el.classList.remove(...DIRECTIONAL_CLASSES);
    const mods = getMods(el);
    if (isIntersecting) onEnter(el, mods, observer); else onExit(el, mods);
  }
}

function replayCallback(entries) {
  const observer = getMainObserver();

  for (const { target: container, isIntersecting } of entries) {
    const children = container.querySelectorAll(SELECTOR);

    for (const el of children) {
      el.classList.remove(...ALL_STATE_CLASSES);
      if (getMods(el).has('count')) resetCounter(el);
      observer.unobserve(el);
    }

    if (isIntersecting) {
      requestAnimationFrame(() => { for (const el of children) observer.observe(el); });
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// § 7 · Observer factories (singletons)
// ─────────────────────────────────────────────────────────────────────────────

function getMainObserver() {
  if (mainObserver) return mainObserver;

  mainObserver = new IntersectionObserver(mainCallback, MAIN_OBSERVER_OPTIONS);

  // ✅ Fix: scope transitionend to the observer's own elements only, and use
  //    a named handler so it can be removed when the observer is torn down.
  //    Previously this added an irremovable anonymous listener to document.
  mainObserver._onTransitionEnd = ({ target }) => {
    if (target?.hasAttribute('sa')) target.classList.remove(CLS.prepare);
  };
  document.addEventListener('transitionend', mainObserver._onTransitionEnd, { passive: true });

  return mainObserver;
}

// ✅ Fix: teardown helper so HMR / StrictMode unmount doesn't leave stale observers
function teardownMainObserver() {
  if (!mainObserver) return;
  if (mainObserver._onTransitionEnd) {
    document.removeEventListener('transitionend', mainObserver._onTransitionEnd);
  }
  mainObserver.disconnect();
  mainObserver = null;
}

function getReplayObserver() {
  if (!replayObserver) {
    replayObserver = new IntersectionObserver(replayCallback, { threshold: 0 });
  }
  return replayObserver;
}


// ─────────────────────────────────────────────────────────────────────────────
// § 8 · Public React hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bootstraps the scroll-animate engine for the page.
 * Call once at the application root. Safe in React StrictMode.
 */
export function useSA() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.add(CLS.visible));
      return;
    }

    // ✅ Fix: ref-count so the singleton is rebuilt cleanly after HMR teardown
    saRefCount++;
    ensureScrollListener();
    const observer = getMainObserver();
    document.querySelectorAll(SELECTOR).forEach(el => observer.observe(el));

    return () => {
      saRefCount--;
      if (saRefCount === 0) {
        // Last consumer unmounted — safe to tear down (happens in dev HMR / StrictMode)
        teardownMainObserver();
      }
    };
  }, []);
}

/**
 * Re-animates all [sa] children every time the container comes into view.
 *
 * @param {React.RefObject<Element>} containerRef
 */
export function useSAReplay(containerRef) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const observer = getReplayObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [containerRef]);
}