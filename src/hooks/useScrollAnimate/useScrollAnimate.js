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

// CSS
import './useScrollAnimate.css';


// ─────────────────────────────────────────────────────────────────────────────
// § 1 · Constants
// ─────────────────────────────────────────────────────────────────────────────

const SELECTOR = '[sa]';
const COUNTER_DURATION_MS = 2500;

const MAIN_OBSERVER_OPTIONS = {
  // Two thresholds: 0.1 triggers entry animation, 0 triggers mirror exit only
  // once the element is fully out of the viewport (prevents the reset-while-visible glitch)
  threshold: [0, 0.1],
  rootMargin: window.innerWidth < 768 ? '50px 0px 100px 0px' : '50px 0px 50px 0px',
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
const elementStates = new WeakMap(); // Track animation state per element


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
  const from = el.dataset.saFrom ?? '0';
  if (isNaN(from)) {
    el.textContent = from;
  } else {
    el.textContent = formatCounter(parseFloat(from), el);
  }
};

function startCounter(el) {
  const to = el.dataset.saTo ?? '0';
  const from = el.dataset.saFrom ?? '0';
  
  // Check if it's a character/string animation (not a number)
  if (isNaN(to) || isNaN(from)) {
    startCharacterAnimation(el);
    return;
  }
  
  // Existing number animation logic
  cancelCounter(el);
  const fromNum  = parseFloat(from);
  const toNum    = parseFloat(to);
  const duration = resolveCounterDuration(el);
  const start    = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = formatCounter(fromNum + (toNum - fromNum) * easeOutCubic(p), el);
    if (p < 1) {
      counterRAFs.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = formatCounter(toNum, el);
      counterRAFs.delete(el);
    }
  };

  counterRAFs.set(el, requestAnimationFrame(tick));
}

function startCharacterAnimation(el) {
  cancelCounter(el);
  const from = el.dataset.saFrom ?? '';
  const to = el.dataset.saTo ?? 'A';
  const duration = resolveCounterDuration(el);
  const start = performance.now();

  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const progress = easeOutCubic(p);
    
    if (to.length === 1) {
      // Single character: animate from → to (preserves case, skip spaces)
      if (to === ' ') {
        el.textContent = ' ';
      } else {
        const fromChar = from[0] ?? (to === to.toUpperCase() ? 'A' : 'a');
        const fromCode = fromChar.charCodeAt(0);
        const toCode = to.charCodeAt(0);
        const range = toCode - fromCode;
        const currentCode = Math.round(fromCode + range * progress);
        el.textContent = String.fromCharCode(currentCode);
      }
    } else {
      // Multiple characters: animate only non-space characters, exclude spaces from count
      let result = '';
      let charIndex = 0; // Track position in non-space characters
      for (let i = 0; i < to.length; i++) {
        const toChar = to[i];
        
        // Preserve spaces without animating them
        if (toChar === ' ') {
          result += ' ';
          continue;
        }
        
        // Default each missing from character based on the target's case
        const fromChar = from[charIndex] ?? (toChar === toChar.toUpperCase() ? 'A' : 'a');
        const fromCode = fromChar.charCodeAt(0);
        const toCode = toChar.charCodeAt(0);
        const range = toCode - fromCode;
        const currentCode = Math.round(fromCode + range * progress);
        result += String.fromCharCode(currentCode);
        charIndex++;
      }
      el.textContent = result;
    }
    
    if (p < 1) {
      counterRAFs.set(el, requestAnimationFrame(tick));
    } else {
      el.textContent = to;
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
    for (const { target: el, isIntersecting, boundingClientRect, intersectionRatio } of entries) {
      const mods  = getMods(el);
      const dir   = scrollDirection;
      const state = elementStates.get(el) || { isVisible: false, lastToggle: 0 };
      const now   = performance.now();

      // Tighten hysteresis to 50ms and skip entirely for mirror/repeat
      // so rapid scroll-back does not swallow the re-entry event
      const isRepeating = mods.has('repeat') || mods.has('mirror');
      if (!isRepeating && now - state.lastToggle < 50) continue;

      el.classList.remove(...DIRECTIONAL_CLASSES);

      if (isIntersecting) {
        if (mods.has('down-only') && dir !== 'down') continue;
        if (mods.has('up-only')   && dir !== 'up')   continue;

        // Always animate on re-entry for mirror/repeat regardless of isVisible —
        // sa-visible is stripped on exit and needs to be re-applied cleanly
        if (!state.isVisible || isRepeating) {
          el.classList.add(CLS.prepare, CLS.visible, dir === 'down' ? CLS.enterDown : CLS.enterUp);
          if (mods.has('count')) startCounter(el);
          elementStates.set(el, { isVisible: true, lastToggle: now });
        }

        // Only unobserve one-shot elements; keep mirror/repeat observed
        if (!isRepeating) observer.unobserve(el);

      } else {
        if (state.isVisible || isRepeating) {
          // For mirror, the threshold fires at both 10% (exit start) and 0% (fully gone).
          // Skip the 10% event so the reset never runs while any part of the element is
          // still on screen — that's what causes the glitch/seizure on mobile.
          if (mods.has('mirror') && intersectionRatio > 0) continue;

          // For mirror, derive exit direction from viewport position rather than
          // relying on scrollDirection which can be stale after a fast fling
          let exitCls;
          if (mods.has('mirror')) {
            exitCls = boundingClientRect.top < 0 ? CLS.exitUp : CLS.exitDown;
          } else {
            exitCls = dir === 'down' ? CLS.exitDown : CLS.exitUp;
          }
          el.classList.add(exitCls);

          if (isRepeating) {
            // Strip sa-visible so the enter animation replays on next entry;
            // do NOT unobserve — the element must stay watched
            el.classList.remove(CLS.visible);
            if (mods.has('count')) resetCounter(el);
          }

          elementStates.set(el, { isVisible: false, lastToggle: now });
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
        elementStates.delete(el);
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
  // Clear all tracked element states
  document.querySelectorAll(SELECTOR).forEach(el => elementStates.delete(el));
}

function reinitializeAnimations() {
  const observer = getMainObserver();
  document.querySelectorAll(SELECTOR).forEach(el => {
    el.classList.remove(...ALL_STATE_CLASSES);
    if (getMods(el).has('count')) resetCounter(el);
    elementStates.delete(el); // Clear state tracking
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