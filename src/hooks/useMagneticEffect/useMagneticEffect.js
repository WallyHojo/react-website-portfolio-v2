/**
 * useMagnetic
 *
 * Custom cursor + magnetic-pull system with 5 cursor states:
 *   1. Hidden  — outside any active zone
 *   2. Idle    — inside zone, no movement (after ~1.2 s)
 *   3. Default — inside zone, moving
 *   4. Hover   — over a .magnetic element
 *   5. Click   — mousedown (scales dot down, ring contracts)
 *
 * Also supports:
 *   - Velocity-based ring scaling (fast movement = larger ring)
 *   - Contextual color via data-cursor="light|dark|accent"
 *   - SA-awareness: defers magnetic listeners on [sa] elements
 *     until they receive the `sa-visible` class
 *
 * @param {React.RefObject<Element>|null} [sectionRef]
 *   Scopes the active zone to one element. Omit for site-wide behaviour.
 *
 * @example
 *   useMagnetic();                    // site-wide
 *   useMagnetic(useRef(sectionEl));   // scoped
 */

import { useEffect, useRef } from 'react';
import './useMagneticEffect.css';


// ─────────────────────────────────────────────────────────────────────────────
// § 1 · Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/** Resets magnetic CSS vars on an element. */
const resetMagVars = el => {
  el.style.setProperty('--mx', '0');
  el.style.setProperty('--my', '0');
};

/** Returns true when the primary input device supports hover (non-touch). */
const hasHoverPointer = () => !window.matchMedia('(hover: none)').matches;


// ─────────────────────────────────────────────────────────────────────────────
// § 2 · Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useMagnetic(sectionRef) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  // Mutable state stored in refs to avoid triggering re-renders.
  const mouse     = useRef({ x: 0, y: 0 });
  const ringPos   = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const rafId     = useRef(null);
  const idleTimer = useRef(null);
  const state     = useRef({ inZone: false, hovering: false, clicking: false });


  // ── rAF animation loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (!hasHoverPointer()) return;

    const dot    = Object.assign(document.createElement('div'), { className: 'cursor' });
    const ringEl = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
    dotRef.current  = dot;
    ringRef.current = ringEl;
    document.body.append(dot, ringEl);

    const loop = () => {
      const { x: mx, y: my } = mouse.current;
      const speed = Math.hypot(mx - prevMouse.current.x, my - prevMouse.current.y);
      prevMouse.current = { x: mx, y: my };

      ringPos.current.x = lerp(ringPos.current.x, mx, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, my, 0.12);

      ringEl.style.left = `${ringPos.current.x}px`;
      ringEl.style.top  = `${ringPos.current.y}px`;

      const { hovering, clicking, inZone } = state.current;
      if (!hovering && !clicking && inZone) {
        ringEl.style.setProperty('--velocity-scale', (1 + clamp(speed * 0.012, 0, 0.45)).toFixed(3));
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      dot.remove();
      ringEl.remove();
      cancelAnimationFrame(rafId.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // ── Event listeners & observers ─────────────────────────────────────────
  useEffect(() => {
    if (!hasHoverPointer()) return;

    const isGlobal = !sectionRef?.current;
    const zone     = sectionRef?.current ?? document.documentElement;
    const dot      = dotRef.current;
    const ring     = ringRef.current;
    const s        = state.current;

    // ── Cursor class helpers ────────────────────────────────────────────────

    const cursorCls   = (...names) => ({ add: () => names.forEach(n => { dot?.classList.add(n);    ring?.classList.add(n.replace('cursor', 'cursor-ring')); }),
                                         remove: () => names.forEach(n => { dot?.classList.remove(n); ring?.classList.remove(n.replace('cursor', 'cursor-ring')); }) });

    const activeCls   = cursorCls('cursor--active');
    const idleCls     = cursorCls('cursor--idle');
    const hoverCls    = cursorCls('cursor--hovering');
    const clickCls    = cursorCls('cursor--clicking');

    // ── Idle management ─────────────────────────────────────────────────────

    const clearIdle = () => { s.idle = false; idleCls.remove(); };

    const scheduleIdle = () => {
      clearTimeout(idleTimer.current);
      clearIdle();
      idleTimer.current = setTimeout(() => {
        if (!s.hovering && !s.clicking) { s.idle = true; idleCls.add(); }
      }, 1200);
    };

    // ── Zone activation ─────────────────────────────────────────────────────

    const activate = () => {
      s.inZone = true;
      activeCls.add();
      scheduleIdle();
    };

    const deactivate = () => {
      s.inZone = s.hovering = s.clicking = false;
      clearTimeout(idleTimer.current);
      clearIdle();
      activeCls.remove(); hoverCls.remove(); clickCls.remove();
      zone.querySelectorAll('.magnetic').forEach(resetMagVars);
    };

    if (isGlobal) activate();

    // ── Mouse tracking ──────────────────────────────────────────────────────

    const onMouseMove = ({ clientX, clientY }) => {
      mouse.current.x = clientX;
      mouse.current.y = clientY;
      if (dot) { dot.style.left = `${clientX}px`; dot.style.top = `${clientY}px`; }
      scheduleIdle();
    };

    // ── Click state ─────────────────────────────────────────────────────────

    const onMouseDown = () => {
      if (!s.inZone) return;
      s.clicking = true;
      clickCls.add();
    };

    const onMouseUp = () => {
      s.clicking = false;
      clickCls.remove();
    };

    // ── Magnetic pull ───────────────────────────────────────────────────────

    const onMagneticMove = ({ currentTarget: el, clientX, clientY }) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((clientX - (r.left + r.width  / 2)) / (r.width  / 2)).toFixed(3));
      el.style.setProperty('--my', ((clientY - (r.top  + r.height / 2)) / (r.height / 2)).toFixed(3));

      if (!s.hovering) {
        s.hovering = true;
        hoverCls.add();
        ring?.style.setProperty('--velocity-scale', '1');
      }
    };

    const onMagneticLeave = ({ currentTarget: el }) => {
      resetMagVars(el);
      s.hovering = false;
      hoverCls.remove();
    };

    // ── Contextual color ────────────────────────────────────────────────────

    const onCursorEnter = ({ currentTarget: el }) => {
      if (dot)  dot.dataset.cursor  = el.dataset.cursor;
      if (ring) ring.dataset.cursor = el.dataset.cursor;
    };

    const onCursorLeave = () => {
      if (dot)  delete dot.dataset.cursor;
      if (ring) delete ring.dataset.cursor;
    };

    const cursorEls = zone.querySelectorAll('[data-cursor]');
    cursorEls.forEach(el => {
      el.addEventListener('mouseenter', onCursorEnter);
      el.addEventListener('mouseleave', onCursorLeave);
    });

    // ── SA-aware magnetic bind / unbind ─────────────────────────────────────

    const bound = new WeakSet();

    const bind = el => {
      if (bound.has(el)) return;
      bound.add(el);
      el.addEventListener('mousemove',  onMagneticMove);
      el.addEventListener('mouseleave', onMagneticLeave);
    };

    const unbind = el => {
      if (!bound.has(el)) return;
      bound.delete(el);
      el.removeEventListener('mousemove',  onMagneticMove);
      el.removeEventListener('mouseleave', onMagneticLeave);
    };

    const detach = el => { unbind(el); resetMagVars(el); };

    /** Bind immediately, or wait for sa-visible if the element is SA-animated. */
    const sync = el => {
      const ready = !el.hasAttribute('sa') || el.classList.contains('sa-visible');
      if (ready) bind(el); else detach(el);
    };

    // Watch for sa-visible class changes on .magnetic[sa] elements.
    const saObserver = new MutationObserver(mutations => {
      for (const { target } of mutations) {
        if (target instanceof Element && target.classList.contains('magnetic') && target.hasAttribute('sa')) {
          sync(target);
        }
      }
    });

    // Watch for .magnetic elements being added/removed from the DOM.
    const domObserver = new MutationObserver(mutations => {
      for (const { addedNodes, removedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains('magnetic')) sync(node);
          node.querySelectorAll('.magnetic').forEach(sync);
        }
        for (const node of removedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains('magnetic')) detach(node);
          node.querySelectorAll('.magnetic').forEach(detach);
        }
      }
    });

    zone.querySelectorAll('.magnetic').forEach(sync);
    saObserver.observe(zone,  { attributes: true, attributeFilter: ['class'], subtree: true });
    domObserver.observe(zone, { childList: true, subtree: true });

    // ── Global listeners ────────────────────────────────────────────────────

    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);

    if (!isGlobal) {
      zone.addEventListener('mouseenter', activate);
      zone.addEventListener('mouseleave', deactivate);
    }

    return () => {
      clearTimeout(idleTimer.current);
      saObserver.disconnect();
      domObserver.disconnect();
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      if (!isGlobal) {
        zone.removeEventListener('mouseenter', activate);
        zone.removeEventListener('mouseleave', deactivate);
      }
      zone.querySelectorAll('.magnetic').forEach(detach);
      cursorEls.forEach(el => {
        el.removeEventListener('mouseenter', onCursorEnter);
        el.removeEventListener('mouseleave', onCursorLeave);
      });
    };
  }, [sectionRef]); // eslint-disable-line react-hooks/exhaustive-deps
}