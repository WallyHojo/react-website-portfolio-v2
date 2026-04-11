import { useEffect, useRef, useCallback } from 'react';
import './useMagneticEffect.css';

/**
 * useMagnetic
 *
 * Custom cursor + magnetic-pull system with 5 cursor states:
 *   1. Hidden  — outside any active zone
 *   2. Idle    — inside zone, no movement (after ~1.2 s)
 *   3. Default — inside zone, moving
 *   4. Hover   — over a .magnetic or interactive element
 *   5. Click   — mousedown (scales dot down, ring contracts)
 *
 * Also supports:
 *   - Velocity-based ring scaling (fast movement = larger ring)
 *   - Contextual color via data-cursor="light|dark|accent"
 *   - SA-awareness: defers magnetic listeners on [sa] elements
 *     until they receive the `sa-visible` class
 *
 * @param {React.RefObject|null} [sectionRef]
 *   Optional ref scoping the active zone to one element.
 *   Omit (or pass null) for site-wide behaviour.
 *
 * Usage – site-wide:
 *   useMagnetic();
 *
 * Usage – scoped:
 *   const ref = useRef(null);
 *   useMagnetic(ref);
 *   <section ref={ref}> … </section>
 */
export function useMagnetic(sectionRef) {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const ring     = useRef({ x: 0, y: 0 });
  const prev     = useRef({ x: 0, y: 0 });
  const rafId    = useRef(null);
  const isInZone = useRef(false);
  const idleTimer = useRef(null);
  const isIdle    = useRef(false);
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const loop = useCallback(() => {
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Velocity-based ring scale
    const vx = mx - prev.current.x;
    const vy = my - prev.current.y;
    const speed = Math.sqrt(vx * vx + vy * vy);
    prev.current = { x: mx, y: my };

    ring.current.x = lerp(ring.current.x, mx, 0.12);
    ring.current.y = lerp(ring.current.y, my, 0.12);

    if (ringRef.current) {
      ringRef.current.style.left = `${ring.current.x}px`;
      ringRef.current.style.top  = `${ring.current.y}px`;

      // Only apply velocity scale when in default state (not clicking/hovering)
      if (!isHovering.current && !isClicking.current && isInZone.current) {
        const velocityScale = 1 + clamp(speed * 0.012, 0, 0.45);
        ringRef.current.style.setProperty('--velocity-scale', velocityScale.toFixed(3));
      }
    }

    rafId.current = requestAnimationFrame(loop);
  }, []);

  // ── DOM creation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

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

  // ── Event listeners & logic ─────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const isGlobal = !sectionRef?.current;
    const zone     = sectionRef?.current ?? document.documentElement;

    // ── State helpers ─────────────────────────────────────────────────────
    const setIdle = () => {
      if (isHovering.current || isClicking.current) return;
      isIdle.current = true;
      dotRef.current?.classList.add('cursor--idle');
      ringRef.current?.classList.add('cursor-ring--idle');
    };

    const clearIdle = () => {
      isIdle.current = false;
      dotRef.current?.classList.remove('cursor--idle');
      ringRef.current?.classList.remove('cursor-ring--idle');
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer.current);
      clearIdle();
      idleTimer.current = setTimeout(setIdle, 1200);
    };

    const activateCursor = () => {
      isInZone.current = true;
      dotRef.current?.classList.add('cursor--active');
      ringRef.current?.classList.add('cursor-ring--active');
      resetIdleTimer();
    };

    const deactivateCursor = () => {
      isInZone.current = false;
      clearTimeout(idleTimer.current);
      clearIdle();
      isHovering.current = false;
      isClicking.current = false;
      dotRef.current?.classList.remove(
        'cursor--active', 'cursor--hovering',
        'cursor--clicking', 'cursor--idle'
      );
      ringRef.current?.classList.remove(
        'cursor-ring--active', 'cursor-ring--hovering',
        'cursor-ring--clicking', 'cursor-ring--idle'
      );
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

      resetIdleTimer();
    };

    // ── Click state ───────────────────────────────────────────────────────
    const onMouseDown = () => {
      if (!isInZone.current) return;
      isClicking.current = true;
      dotRef.current?.classList.add('cursor--clicking');
      ringRef.current?.classList.add('cursor-ring--clicking');
    };

    const onMouseUp = () => {
      isClicking.current = false;
      dotRef.current?.classList.remove('cursor--clicking');
      ringRef.current?.classList.remove('cursor-ring--clicking');
    };

    // ── Magnetic pull handlers ────────────────────────────────────────────
    const onMagneticMove = (e) => {
      const el = e.currentTarget;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;

      el.style.setProperty('--mx', ((e.clientX - cx) / (r.width  / 2)).toFixed(3));
      el.style.setProperty('--my', ((e.clientY - cy) / (r.height / 2)).toFixed(3));

      if (!isHovering.current) {
        isHovering.current = true;
        dotRef.current?.classList.add('cursor--hovering');
        ringRef.current?.classList.add('cursor-ring--hovering');
        ringRef.current?.style.setProperty('--velocity-scale', '1');
      }
    };

    const onMagneticLeave = (e) => {
      const el = e.currentTarget;
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');

      isHovering.current = false;
      dotRef.current?.classList.remove('cursor--hovering');
      ringRef.current?.classList.remove('cursor-ring--hovering');
    };

    // ── Contextual color ──────────────────────────────────────────────────
    const cursorEls = zone.querySelectorAll('[data-cursor]');

    const onCursorEnter = (e) => {
      const color = e.currentTarget.dataset.cursor;
      if (dotRef.current)  dotRef.current.dataset.cursor  = color;
      if (ringRef.current) ringRef.current.dataset.cursor = color;
    };

    const onCursorLeave = () => {
      if (dotRef.current)  delete dotRef.current.dataset.cursor;
      if (ringRef.current) delete ringRef.current.dataset.cursor;
    };

    cursorEls.forEach(el => {
      el.addEventListener('mouseenter', onCursorEnter);
      el.addEventListener('mouseleave', onCursorLeave);
    });

    // ── SA-aware bind / unbind ────────────────────────────────────────────
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

    const syncMagnetic = (el) => {
      if (!el.hasAttribute('sa')) {
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

    const saObserver = new MutationObserver((mutations) => {
      for (const { target } of mutations) {
        if (!(target instanceof Element)) continue;
        if (!target.classList.contains('magnetic') || !target.hasAttribute('sa')) continue;
        syncMagnetic(target);
      }
    });

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

    zone.querySelectorAll('.magnetic').forEach(syncMagnetic);
    saObserver.observe(zone,  { attributes: true, attributeFilter: ['class'], subtree: true });
    domObserver.observe(zone, { childList: true, subtree: true });

    // ── Zone & global listeners ───────────────────────────────────────────
    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);

    if (!isGlobal) {
      zone.addEventListener('mouseenter', activateCursor);
      zone.addEventListener('mouseleave', deactivateCursor);
    }

    return () => {
      clearTimeout(idleTimer.current);
      domObserver.disconnect();
      saObserver.disconnect();
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);

      if (!isGlobal) {
        zone.removeEventListener('mouseenter', activateCursor);
        zone.removeEventListener('mouseleave', deactivateCursor);
      }

      zone.querySelectorAll('.magnetic').forEach(fullDetach);

      cursorEls.forEach(el => {
        el.removeEventListener('mouseenter', onCursorEnter);
        el.removeEventListener('mouseleave', onCursorLeave);
      });
    };
  }, [sectionRef]);
}