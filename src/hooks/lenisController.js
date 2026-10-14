/**
 * lenisController
 *
 * useSmoothScroll owns the single app-wide Lenis instance, but nothing else
 * could reach it. Lenis continuously drives window scroll via its own
 * requestAnimationFrame loop — any code that scrolls programmatically
 * (anchor nav, "back to top", deep links, etc.) has to go through
 * lenis.scrollTo() rather than native window.scrollTo() / Element.scrollIntoView().
 * Calling the native APIs while Lenis is running makes the two animations
 * fight over window.scrollY each frame, so the page lands close to — but not
 * exactly on — the intended target.
 *
 * This module is just a tiny registry: useSmoothScroll registers/unregisters
 * its instance here, and everyone else reads through scrollTo().
 */

let lenisInstance = null;

export function setLenisInstance(instance) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}

/**
 * Scroll to a target, via Lenis when it's available. Falls back to the
 * native scroll APIs when Lenis isn't running (deferred init window, or
 * prefers-reduced-motion, where useSmoothScroll never starts it).
 *
 * `offset` follows Lenis semantics: it is ADDED to the target position, so a
 * negative value stops above the element (header clearance), positive below.
 *
 * @param {string | HTMLElement | number} target - selector, element, or px value
 * @param {{ offset?: number, immediate?: boolean, force?: boolean }} [options]
 * @returns {boolean} true if Lenis handled it, false if the native fallback was used
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
    return true;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  const top =
    el instanceof Element
      ? el.getBoundingClientRect().top + window.scrollY
      : typeof target === "number"
        ? target
        : null;

  if (top !== null) {
    window.scrollTo({
      top: top + (options.offset ?? 0),
      behavior:
        options.immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
    });
  }

  return false;
}

/**
 * Freeze / release page scrolling for overlays (menu, lightbox).
 * `overflow: hidden` alone is not enough while Lenis runs: it intercepts the
 * wheel and keeps scrolling the page behind the overlay, so stop it too.
 * Ref-counted so stacked overlays don't release each other's lock.
 */
let lockCount = 0;

export function lockScroll(locked) {
  lockCount = Math.max(0, lockCount + (locked ? 1 : -1));
  const isLocked = lockCount > 0;
  document.documentElement.classList.toggle("no-scroll", isLocked);
  if (isLocked) lenisInstance?.stop();
  else lenisInstance?.start();
}
