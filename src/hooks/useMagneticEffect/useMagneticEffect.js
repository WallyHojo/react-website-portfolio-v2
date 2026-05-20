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
 */

import { useEffect, useRef } from "react";
import "./useMagneticEffect.css";

// ─────────────────────────────────────────────────────────────────────────────
// § 1 · Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const resetMagVars = (el) => {
  el.style.setProperty("--mx", "0");
  el.style.setProperty("--my", "0");
};

const hasHoverPointer = () => !window.matchMedia("(hover: none)").matches;

// ✅ Fix: accepts refs (not values) so .current is read at call time,
//    not frozen at construction — stale element references after a
//    mobile↔desktop switch would otherwise make every class-toggle a no-op.
const makeCursorCls = (dotCls, ringCls, dotRef, ringRef) => ({
  add: () => {
    dotRef.current?.classList.add(dotCls);
    ringRef.current?.classList.add(ringCls);
  },
  remove: () => {
    dotRef.current?.classList.remove(dotCls);
    ringRef.current?.classList.remove(ringCls);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// § 2 · Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useMagnetic(sectionRef) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const idleTimer = useRef(null);
  const state = useRef({ inZone: false, hovering: false, clicking: false, idle: false });
  // ✅ Fix: track last frame timestamp for delta-time lerp so ring speed is
  //    frame-rate independent (was too fast at 120 Hz, sluggish at 30 Hz)
  const lastTs = useRef(0);
  const isGlobal = useRef(!sectionRef?.current);

  // ── rAF animation loop ──────────────────────────────────────────────────
  // Listens for pointer-capability changes (e.g. desktop ↔ mobile resize)
  // so the cursor is created/destroyed dynamically rather than only on mount.
  useEffect(() => {
    const hoverMQ = window.matchMedia("(hover: none)");

    let dot    = null;
    let ringEl = null;

    const startLoop = () => {
      if (dotRef.current) return; // already running

      dot    = Object.assign(document.createElement("div"), { className: "cursor" });
      ringEl = Object.assign(document.createElement("div"), { className: "cursor-ring" });
      dotRef.current  = dot;
      ringRef.current = ringEl;
      document.body.append(dot, ringEl);

      const loop = (ts) => {
        if (!state.current.inZone && !isGlobal.current) {
          rafId.current = requestAnimationFrame(loop);
          return;
        }
        const dt    = Math.min(ts - lastTs.current, 64);
        lastTs.current = ts;
        const alpha = 1 - Math.pow(1 - 0.12, dt / (1000 / 60));

        const { x: mx, y: my } = mouse.current;
        const speed = Math.hypot(mx - prevMouse.current.x, my - prevMouse.current.y);
        prevMouse.current = { x: mx, y: my };

        ringPos.current.x = lerp(ringPos.current.x, mx, alpha);
        ringPos.current.y = lerp(ringPos.current.y, my, alpha);

        ringEl.style.left = `${ringPos.current.x}px`;
        ringEl.style.top  = `${ringPos.current.y}px`;

        const { hovering, clicking, inZone } = state.current;
        if (!hovering && !clicking && inZone) {
          ringEl.style.setProperty("--velocity-scale", (1 + clamp(speed * 0.012, 0, 0.45)).toFixed(3));
        }

        rafId.current = requestAnimationFrame(loop);
      };

      rafId.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (!dotRef.current) return; // already stopped
      cancelAnimationFrame(rafId.current);
      dotRef.current?.remove();
      ringRef.current?.remove();
      dotRef.current  = null;
      ringRef.current = null;
      // Reset state so a fresh startLoop is clean
      state.current.inZone   = false;
      state.current.hovering = false;
      state.current.clicking = false;
      state.current.idle     = false;
    };

    const onPointerChange = (e) => {
      // hoverMQ matches when hover:none (touch device) — so invert for "has hover"
      if (e.matches) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    // Init based on current capability
    if (hasHoverPointer()) startLoop();

    hoverMQ.addEventListener("change", onPointerChange);

    return () => {
      hoverMQ.removeEventListener("change", onPointerChange);
      stopLoop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Event listeners & observers ─────────────────────────────────────────
  useEffect(() => {
    isGlobal.current = !sectionRef?.current;
    const zone = sectionRef?.current ?? document.documentElement;
    const s = state.current;

    // ✅ Fix: pass refs (not captured values) so class helpers always operate
    //    on the live element, even after it's been recreated on pointer-change.
    const activeCls = makeCursorCls("cursor--active", "cursor-ring--active", dotRef, ringRef);
    const idleCls   = makeCursorCls("cursor--idle",   "cursor-ring--idle",   dotRef, ringRef);
    const hoverCls  = makeCursorCls("cursor--hovering","cursor-ring--hovering",dotRef, ringRef);
    const clickCls  = makeCursorCls("cursor--clicking","cursor-ring--clicking",dotRef, ringRef);

    // ── Idle management ─────────────────────────────────────────────────────

    const clearIdle = () => {
      s.idle = false;
      idleCls.remove();
    };

    const scheduleIdle = () => {
      clearTimeout(idleTimer.current);
      clearIdle();
      idleTimer.current = setTimeout(() => {
        if (!s.hovering && !s.clicking) {
          s.idle = true;
          idleCls.add();
        }
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
      activeCls.remove();
      hoverCls.remove();
      clickCls.remove();
      zone.querySelectorAll(".magnetic").forEach(resetMagVars);
    };

    if (isGlobal.current) activate();

    // ── Mouse tracking ──────────────────────────────────────────────────────

    const onMouseMove = ({ clientX, clientY }) => {
      mouse.current.x = clientX;
      mouse.current.y = clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`;
        dotRef.current.style.top  = `${clientY}px`;
      }
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

    // ── Magnetic pull ─────────────────────────────────────────────────
    // ✅ Fix: throttle magnetic mousemove to one update per rAF tick
    //    (was firing on every raw mousemove — up to 1000×/s on some devices)
    // ── Magnetic pull ─────────────────────────────────────────────────
    let rectCache = new WeakMap();
    const getRect = (el) => {
      if (!rectCache.has(el)) rectCache.set(el, el.getBoundingClientRect());
      return rectCache.get(el);
    };
    const invalidateRects = () => {
      rectCache = new WeakMap();
    };
    let magRafPending = false;
    let lastMagEvent = null;
    const flushMagMove = () => {
      magRafPending = false;
      if (!lastMagEvent) return;
      const { el, clientX, clientY } = lastMagEvent;
      lastMagEvent = null;
      const r = getRect(el); // ← read from cache, not live DOM
      el.style.setProperty("--mx", ((clientX - (r.left + r.width / 2)) / (r.width / 2)).toFixed(3));
      el.style.setProperty("--my", ((clientY - (r.top + r.height / 2)) / (r.height / 2)).toFixed(3));
      if (!s.hovering) {
        s.hovering = true;
        hoverCls.add();
        ringRef.current?.style.setProperty("--velocity-scale", "1");
      }
    };
    const onMagneticMove = ({ currentTarget: el, clientX, clientY }) => {
      lastMagEvent = { el, clientX, clientY };
      if (!magRafPending) {
        magRafPending = true;
        requestAnimationFrame(flushMagMove);
      }
    };

    // Damped spring oscillator — jiggles naturally before settling at 0
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMagneticLeave = ({ currentTarget: el }) => {
      lastMagEvent  = null;
      magRafPending = false;

      const startMX = parseFloat(el.style.getPropertyValue("--mx") || 0);
      const startMY = parseFloat(el.style.getPropertyValue("--my") || 0);

      rectCache.delete(el);
      s.hovering = false;
      hoverCls.remove();

      // Skip physics if no pull or user prefers reduced motion
      if (prefersReducedMotion || (Math.abs(startMX) <= 0.01 && Math.abs(startMY) <= 0.01)) {
        resetMagVars(el);
        return;
      }

      // Spring constants — tune these to taste:
      // stiffness: higher = faster oscillation
      // damping:   lower  = more jiggles before settling (underdamped when damping² < 4*stiffness*mass)
      const stiffness = 220;
      const damping   = 8;
      const mass      = 1;

      let vx = 0, vy = 0;
      let px = startMX, py = startMY;
      let lastTime = null;
      let springRaf = null;

      const tick = (ts) => {
        if (lastTime === null) { lastTime = ts; }
        // Cap dt to avoid huge jumps on tab restore
        const dt = Math.min((ts - lastTime) / 1000, 0.064);
        lastTime = ts;

        // Semi-implicit Euler integration (stable for springs)
        const ax = (-stiffness * px - damping * vx) / mass;
        const ay = (-stiffness * py - damping * vy) / mass;
        vx += ax * dt;
        vy += ay * dt;
        px += vx * dt;
        py += vy * dt;

        el.style.setProperty("--mx", px.toFixed(4));
        el.style.setProperty("--my", py.toFixed(4));

        // Settle when both position and velocity are negligible
        if (Math.abs(px) < 0.002 && Math.abs(py) < 0.002 &&
            Math.abs(vx) < 0.002 && Math.abs(vy) < 0.002) {
          resetMagVars(el);
          return;
        }

        springRaf = requestAnimationFrame(tick);
      };

      springRaf = requestAnimationFrame(tick);

      // Safety cleanup if element is removed mid-animation
      const observer = new MutationObserver(() => {
        if (!document.contains(el)) {
          cancelAnimationFrame(springRaf);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // ── Contextual color ────────────────────────────────────────────────────

    const onCursorEnter = ({ currentTarget: el }) => {
      if (dotRef.current)  dotRef.current.dataset.cursor  = el.dataset.cursor;
      if (ringRef.current) ringRef.current.dataset.cursor = el.dataset.cursor;
    };

    const onCursorLeave = () => {
      if (dotRef.current)  delete dotRef.current.dataset.cursor;
      if (ringRef.current) delete ringRef.current.dataset.cursor;
    };

    const cursorEls = zone.querySelectorAll("[data-cursor]");
    cursorEls.forEach((el) => {
      el.addEventListener("mouseenter", onCursorEnter);
      el.addEventListener("mouseleave", onCursorLeave);
    });

    // ── SA-aware magnetic bind / unbind ─────────────────────────────────────

    const bound = new WeakSet();

    const bind = (el) => {
      if (bound.has(el)) return;
      bound.add(el);
      el.addEventListener("mousemove", onMagneticMove);
      el.addEventListener("mouseleave", onMagneticLeave);
    };

    const unbind = (el) => {
      if (!bound.has(el)) return;
      bound.delete(el);
      el.removeEventListener("mousemove", onMagneticMove);
      el.removeEventListener("mouseleave", onMagneticLeave);
    };

    const detach = (el) => {
      unbind(el);
      resetMagVars(el);
    };

    const sync = (el) => {
      const ready = !el.hasAttribute("sa") || el.classList.contains("sa-visible");
      if (ready) bind(el);
      else detach(el);
    };

    const saObserver = new MutationObserver((mutations) => {
      for (const { target } of mutations) {
        if (target instanceof Element && target.classList.contains("magnetic") && target.hasAttribute("sa")) {
          sync(target);
        }
      }
    });

    const domObserver = new MutationObserver((mutations) => {
      for (const { addedNodes, removedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("magnetic")) sync(node);
          node.querySelectorAll(".magnetic").forEach(sync);
        }
        for (const node of removedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("magnetic")) detach(node);
          node.querySelectorAll(".magnetic").forEach(detach);
        }
      }
    });

    // ── Global listeners ────────────────────────────────────────────────────

    // ✅ Fix: mousemove marked passive — browser can optimise scroll compositing
    const attachListeners = () => {
      document.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      if (!isGlobal.current) {
        zone.addEventListener("mouseenter", activate);
        zone.addEventListener("mouseleave", deactivate);
      }
      zone.querySelectorAll(".magnetic").forEach(sync);
      saObserver.observe(zone, { attributes: true, attributeFilter: ["class"], subtree: true });
      domObserver.observe(zone, { childList: true, subtree: true });
      if (isGlobal.current) activate();
    };

    const detachListeners = () => {
      clearTimeout(idleTimer.current);
      saObserver.disconnect();
      domObserver.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", invalidateRects);
      document.removeEventListener("scroll", invalidateRects, { capture: true });
      if (!isGlobal.current) {
        zone.removeEventListener("mouseenter", activate);
        zone.removeEventListener("mouseleave", deactivate);
      }
      zone.querySelectorAll(".magnetic").forEach(detach);
      cursorEls.forEach((el) => {
        el.removeEventListener("mouseenter", onCursorEnter);
        el.removeEventListener("mouseleave", onCursorLeave);
      });
      deactivate();
    };

    // ✅ Fix: listen for pointer-capability changes (desktop ↔ mobile) and
    //    attach/detach all listeners dynamically — previously the effect bailed
    //    out early on mobile, so no change listener was ever registered and the
    //    cursor never reappeared when switching back to a hover device.
    const hoverMQ = window.matchMedia("(hover: none)");
    const onPointerChange = (e) => {
      if (e.matches) {
        // Switched to touch — remove all cursor listeners
        detachListeners();
      } else {
        // Switched to hover device — re-attach everything
        attachListeners();
      }
    };
    hoverMQ.addEventListener("change", onPointerChange);

    // Initial attach only if hover is available right now
    if (hasHoverPointer()) attachListeners();

    return () => {
      hoverMQ.removeEventListener("change", onPointerChange);
      detachListeners();
    };
  }, [sectionRef]); // eslint-disable-line react-hooks/exhaustive-deps
}