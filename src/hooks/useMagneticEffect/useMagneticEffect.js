import { useEffect, useRef, useCallback } from 'react';
import './useMagneticEffect.css';

/**
 * useMagnetic
 *
 * Initialises the custom cursor and magnetic-pull system.
 * Compatible with useSA / useScrollAnimate — magnetic listeners are deferred
 * on [sa] elements until they receive the `sa-visible` class, preventing
 * phantom cursor interactions on elements that are mid-animation or still
 * hidden below the fold.
 *
 * @param {React.RefObject|null} [sectionRef]
 *   Optional ref attached to the element that defines the active zone.
 *   - When provided  → cursor only appears and magnetic elements only activate
 *     while the mouse is inside that element (scoped behaviour).
 *   - When omitted (or null/undefined) → the entire page is treated as the
 *     active zone; the cursor is always visible and every .magnetic element
 *     on the site responds.
 *
 * Usage – site-wide:
 *   useMagnetic();
 *
 * Usage – scoped to one element:
 *   const magRef = useRef(null);
 *   useMagnetic(magRef);
 *   <section ref={magRef}> … </section>
 *
 * Usage – alongside useSA (elements can have both):
 *   useSA();
 *   useMagnetic();
 *   <button class="magnetic" sa="up">Click me</button>
 */
export function useMagnetic(sectionRef) {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const ring     = useRef({ x: 0, y: 0 });
  const rafId    = useRef(null);
  const isInZone = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  const loop = useCallback(() => {
    ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
    ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

    if (ringRef.current) {
      ringRef.current.style.left = `${ring.current.x}px`;
      ringRef.current.style.top  = `${ring.current.y}px`;
    }

    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return; // Don't initialise the cursor or magnetic system on touch devices

    const dot = document.createElement('div');
    dot.className = 'cursor';
    dotRef.current = dot;

    const ringEl = document.createElement('div');
    ringEl.className = 'cursor-ring';
    ringRef.current = ringEl;

    document.body.appendChild(dot);
    document.body.appendChild(ringEl);
    rafId.current = requestAnimationFrame(loop);

    return () => {
      dot.remove();
      ringEl.remove();
      cancelAnimationFrame(rafId.current);
    };
  }, [loop]);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return; // Don't initialise the cursor or magnetic system on touch devices

    const isGlobal = !sectionRef?.current;
    const zone     = sectionRef?.current ?? document.documentElement;   

    // ── Cursor visibility ─────────────────────────────────────────────────
    const activateCursor = () => {
      isInZone.current = true;
      dotRef.current?.classList.add('cursor--active');
      ringRef.current?.classList.add('cursor-ring--active');
    };

    const deactivateCursor = () => {
      isInZone.current = false;
      dotRef.current?.classList.remove('cursor--active', 'cursor--hovering');
      ringRef.current?.classList.remove('cursor-ring--active', 'cursor-ring--hovering');

      zone.querySelectorAll('.magnetic').forEach(el => {
        el.style.setProperty('--mx', '0');
        el.style.setProperty('--my', '0');
      });
    };

    if (isGlobal) activateCursor();

    // ── Mouse tracking ────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    // ── Magnetic pull handlers ────────────────────────────────────────────
    const onMagneticMove = (e) => {
      const el = e.currentTarget;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;

      el.style.setProperty('--mx', ((e.clientX - cx) / (r.width  / 2)).toFixed(3));
      el.style.setProperty('--my', ((e.clientY - cy) / (r.height / 2)).toFixed(3));

      dotRef.current?.classList.add('cursor--hovering');
      ringRef.current?.classList.add('cursor-ring--hovering');
    };

    const onMagneticLeave = (e) => {
      const el = e.currentTarget;
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');

      dotRef.current?.classList.remove('cursor--hovering');
      ringRef.current?.classList.remove('cursor-ring--hovering');
    };

    // ── Attach color-change listeners ────────────────────────────────────────────
    // even if it doesn't have the magnetic class
    const cursorEls = zone.querySelectorAll('[data-cursor]');

    const onCursorEnter = (e) => {
      const cursorColor = e.currentTarget.dataset.cursor;
      if (dotRef.current) dotRef.current.dataset.cursor = cursorColor;
      if (ringRef.current) ringRef.current.dataset.cursor = cursorColor;
    };

    const onCursorLeave = () => {
      if (dotRef.current) delete dotRef.current.dataset.cursor;
      if (ringRef.current) delete ringRef.current.dataset.cursor;
    };

    cursorEls.forEach(el => {
      el.addEventListener('mouseenter', onCursorEnter);
      el.addEventListener('mouseleave', onCursorLeave);
    });    

    // ── SA-aware bind / unbind ────────────────────────────────────────────
    // WeakSet tracks which elements currently have listeners attached,
    // preventing double-binds regardless of how many times sa-visible toggles.
    const bound = new WeakSet();

    const bindListeners = (el) => {
      if (bound.has(el)) return;
      bound.add(el);
      el.addEventListener('mousemove',  onMagneticMove);
      el.addEventListener('mouseleave', onMagneticLeave);
    };

    const unbindListeners = (el) => {
      if (!bound.has(el)) return;
      bound.delete(el);
      el.removeEventListener('mousemove',  onMagneticMove);
      el.removeEventListener('mouseleave', onMagneticLeave);
    };

    // Sync a .magnetic element's listeners with its current SA visibility state.
    // Called on initial scan, on DOM insertion, and from saObserver on class change.
    const syncMagnetic = (el) => {
      if (!el.hasAttribute('sa')) {
        // Not scroll-animated — always active.
        bindListeners(el);
        return;
      }
      if (el.classList.contains('sa-visible')) {
        bindListeners(el);
      } else {
        unbindListeners(el);
        el.style.setProperty('--mx', '0');
        el.style.setProperty('--my', '0');
      }
    };

    const fullDetach = (el) => {
      unbindListeners(el);
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };

    // Watches class changes on .magnetic[sa] elements.
    // MutationObserver has no per-element unobserve — we observe the zone once
    // and filter by whether the target is still a tracked .magnetic[sa] node.
    const saObserver = new MutationObserver((mutations) => {
      for (const { target } of mutations) {
        if (!(target instanceof Element)) continue;
        if (!target.classList.contains('magnetic') || !target.hasAttribute('sa')) continue;
        syncMagnetic(target);
      }
    });

    // Watches for .magnetic elements being added or removed from the zone.
    const domObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains('magnetic')) syncMagnetic(node);
          node.querySelectorAll?.('.magnetic').forEach(syncMagnetic);
        });
        mutation.removedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.classList.contains('magnetic')) fullDetach(node);
          node.querySelectorAll?.('.magnetic').forEach(fullDetach);
        });
      }
    });

    // Initial scan
    zone.querySelectorAll('.magnetic').forEach(syncMagnetic);

    // One saObserver covers the entire zone for class changes — no per-element
    // observe/unobserve needed, and no unobserve call on detach.
    saObserver.observe(zone, { attributes: true, attributeFilter: ['class'], subtree: true });
    domObserver.observe(zone, { childList: true, subtree: true });

    // ── Zone-boundary listeners ───────────────────────────────────────────
    document.addEventListener('mousemove', onMouseMove);

    if (!isGlobal) {
      zone.addEventListener('mouseenter', activateCursor);
      zone.addEventListener('mouseleave', deactivateCursor);
    }

    return () => {
      domObserver.disconnect();
      saObserver.disconnect();
      document.removeEventListener('mousemove', onMouseMove);

      if (!isGlobal) {
        zone.removeEventListener('mouseenter', activateCursor);
        zone.removeEventListener('mouseleave', deactivateCursor);
      }

      zone.querySelectorAll('.magnetic').forEach(fullDetach);
    };
  }, [sectionRef]);
}