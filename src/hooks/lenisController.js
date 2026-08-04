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
 * native scroll APIs if Lenis hasn't initialized yet (e.g. a click during
 * useSmoothScroll's brief deferred-init window) — safe to do, since Lenis's
 * animation loop isn't running yet either, so there's nothing to fight.
 *
 * @param {string | HTMLElement | number} target - selector, element, or px value
 * @param {{ offset?: number, immediate?: boolean, duration?: number, easing?: (t:number)=>number }} [options]
 * @returns {boolean} true if Lenis handled it, false if the native fallback was used
 */
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
    return true;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;

  if (el instanceof Element) {
    el.scrollIntoView({
      behavior: options.immediate ? "auto" : "smooth",
      block: "start",
    });
  } else if (typeof target === "number") {
    window.scrollTo({
      top: target,
      behavior: options.immediate ? "auto" : "smooth",
    });
  }

  return false;
}
