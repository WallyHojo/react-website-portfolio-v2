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

// CSS
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
  const hoveredBtnRef = useRef(null); // tracks hovered .btn-primary / .btn-secondary for rAF loop

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

      // ── Cursor-target singleton ──────────────────────────────────────────
      // Created once alongside the cursor elements so it is torn down with
      // them on pointer-capability change (stopLoop).
      // The guard prevents duplicate nodes under React Strict Mode / HMR.
      if (!document.querySelector("[data-cursor-target]")) {
        const target = document.createElement("div");
        target.className = "cursor-target";
        target.setAttribute("data-cursor-target", "");
        target.setAttribute("aria-hidden", "true");
        target.innerHTML = [
          '<div class="cursor-target__corner cursor-target__corner--tl"></div>',
          '<div class="cursor-target__corner cursor-target__corner--tr"></div>',
          '<div class="cursor-target__corner cursor-target__corner--bl"></div>',
          '<div class="cursor-target__corner cursor-target__corner--br"></div>',
        ].join("");
        document.body.append(target);
      }

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

        // Don't overwrite position while the btn-primary / btn-secondary morph owns the ring.
        // But keep ringPos in sync with the cursor so when the morph hands
        // control back the lerp loop re-acquires without any jump.
        if (!ringEl.classList.contains("cursor-ring--btn-primary") && !ringEl.classList.contains("cursor-ring--btn-secondary")) {
          ringEl.style.left = `${ringPos.current.x}px`;
          ringEl.style.top  = `${ringPos.current.y}px`;
        }

        const { hovering, clicking, inZone } = state.current;
        if (!hovering && !clicking && inZone && !ringEl.classList.contains("cursor-ring--btn-primary") && !ringEl.classList.contains("cursor-ring--btn-secondary")) {
          ringEl.style.setProperty("--velocity-scale", (1 + clamp(speed * 0.012, 0, 0.45)).toFixed(3));
        }

        // Snap cursor-target to button every frame so it follows the magnetic transform.
        // getBoundingClientRect() reflects the live CSS transform offset, so the target
        // stays glued to the button as the spring animation plays out.
        const activeBtn = hoveredBtnRef.current;
        if (activeBtn) {
          const cursorTarget = document.querySelector("[data-cursor-target]");
          if (cursorTarget?.classList.contains("cursor-target--visible")) {
            const r = activeBtn.getBoundingClientRect();
            cursorTarget.style.top    = `${r.top - 5}px`;
            cursorTarget.style.left   = `${r.left - 5}px`;
            cursorTarget.style.width  = `${r.width + 10}px`;
            cursorTarget.style.height = `${r.height + 10}px`;
          }
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
      // Remove the cursor-target singleton if it exists
      document.querySelector("[data-cursor-target]")?.remove();
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
      // Skip cursor--hovering activation for dot elements
      if (!s.hovering && !el.classList.contains('dot') &&
      el.tagName.toLowerCase() !== 'rect') {
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
      s.hovering = true;
      hoverCls.add();
    };

    const onCursorLeave = () => {
      if (dotRef.current)  delete dotRef.current.dataset.cursor;
      if (ringRef.current) delete ringRef.current.dataset.cursor;
      s.hovering = false;
      hoverCls.remove();
    };

    const cursorEls = zone.querySelectorAll("[data-cursor]");
    cursorEls.forEach((el) => {
      el.addEventListener("mouseenter", onCursorEnter);
      el.addEventListener("mouseleave", onCursorLeave);
    });

    // ── .btn-primary: direction-aware ring morph + corner-target ─────────────    //
    // The cursor ring morphs from its current position/size into the button's
    // bounding rect (enter), then collapses back to the cursor on leave.
    //
    // All interpolation is driven by a rAF loop using a custom ease curve so
    // CSS transitions cannot interfere. Transitions are suspended on the ring
    // element for the duration of each morph and restored afterwards.
    //
    // Direction awareness: entry/exit clientX/Y vs. button rect edges determine`
    // a normalised bias vector (dx, dy) ∈ [−1, 1]. That vector shifts the
    // transform-origin so the morph visually originates from the entry edge.

    const getCursorTarget = () => document.querySelector("[data-cursor-target]");

    // Track which button is currently being hovered so the rAF loop can re-snap.
    // hoveredBtnRef is a hook-level ref so the rAF loop in the first useEffect
    // can read it without closing over the local variable.
    const setHoveredBtn = (btn) => { hoveredBtnRef.current = btn; };
    let morphRafId     = null;   // active morph rAF handle
    let morphCleanup   = null;   // fn to cancel + restore after a morph

    // ── Easing ──────────────────────────────────────────────────────────────
    // ease-out cubic for enter, ease-in-out cubic for leave
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    // ── Direction bias ───────────────────────────────────────────────────────
    // Returns normalised (dx, dy) indicating which edge the cursor is nearest.
    // dx: −1 = left edge, +1 = right; dy: −1 = top, +1 = bottom.
    const getEdgeBias = (clientX, clientY, r) => {
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      // Distance from cursor to each edge, normalised to half-extents
      const dx = (clientX - cx) / (r.width  / 2);
      const dy = (clientY - cy) / (r.height / 2);
      // Clamp to [−1, 1] — outside the button on enter the value may exceed 1
      return {
        dx: Math.max(-1, Math.min(1, dx)),
        dy: Math.max(-1, Math.min(1, dy)),
      };
    };

    // ── Read computed border-radius of button ────────────────────────────────
    const getBtnRadius = (btn) => {
      const cs = window.getComputedStyle(btn);
      // Use top-left corner as representative; fall back to 0
      return parseFloat(cs.borderTopLeftRadius) || 0;
    };

    // ── Freeze / restore CSS transitions on the ring ─────────────────────────
    // During a rAF morph the ring's transition property would fight the loop,
    // so we suspend it and restore the original value when done.
    const freezeRingTransition = (ringEl) => {
      const prev = ringEl.style.transition;
      ringEl.style.transition = "none";
      return () => { ringEl.style.transition = prev; };
    };

    // ── Core morph driver ────────────────────────────────────────────────────
    // Animates the ring element from {fromRect, fromRadius} to {toRect, toRadius}
    // using the supplied easing fn over `duration` ms.
    // `originBias` = { dx, dy } shifts transform-origin toward the entry/exit edge.
    // Returns a cancel function.
    const runMorph = ({
      ringEl,
      fromRect,   // { left, top, width, height }
      toRect,     // may be a getter fn () => rect for live tracking
      fromRadius,
      toRadius,
      fromOpacity,
      toOpacity,
      duration,
      easing,
      originBias, // { dx, dy }
      onComplete,
    }) => {
      // Cancel any in-flight morph before starting
      if (morphRafId) { cancelAnimationFrame(morphRafId); morphRafId = null; }
      if (morphCleanup) { morphCleanup(); morphCleanup = null; }

      const restore = freezeRingTransition(ringEl);
      morphCleanup = restore;

      let startTs = null;
      morphRafId  = null;

      const originX = (50 + originBias.dx * 50).toFixed(1) + "%";
      const originY = (50 + originBias.dy * 50).toFixed(1) + "%";

      const tick = (ts) => {
        if (!startTs) startTs = ts;
        const raw = Math.min((ts - startTs) / duration, 1);
        const t   = easing(raw);

        // toRect may be a live getter (leave path tracks cursor)
        const target = typeof toRect === "function" ? toRect() : toRect;

        const left    = lerp(fromRect.left,   target.left,   t);
        const top     = lerp(fromRect.top,    target.top,    t);
        const width   = lerp(fromRect.width,  target.width,  t);
        const height  = lerp(fromRect.height, target.height, t);
        const radius  = lerp(fromRadius,      toRadius,      t);
        const opacity = lerp(fromOpacity,     toOpacity,     t);

        ringEl.style.left            = `${left}px`;
        ringEl.style.top             = `${top}px`;
        ringEl.style.width           = `${width}px`;
        ringEl.style.height          = `${height}px`;
        ringEl.style.borderRadius    = `${radius}px`;
        ringEl.style.opacity         = opacity.toFixed(3);
        ringEl.style.transformOrigin = `${originX} ${originY}`;
        ringEl.style.transform       = "translate(-50%, -50%)";

        if (raw < 1) {
          morphRafId = requestAnimationFrame(tick);
        } else {
          morphRafId = null;
          morphCleanup = null;
          restore();
          onComplete?.();
        }
      };

      morphRafId = requestAnimationFrame(tick);

      return () => {
        if (morphRafId) { cancelAnimationFrame(morphRafId); morphRafId = null; }
        restore();
      };
    };

    // ── Ring geometry snapshot ───────────────────────────────────────────────
    // Reads the ring's current rendered geometry as a "from" rect for morphing.
    // The ring is positioned via left/top + translate(-50%,-50%), so its visual
    // centre equals its left/top values.
    const getRingRect = (ringEl) => {
      const left   = parseFloat(ringEl.style.left)   || ringPos.current.x;
      const top    = parseFloat(ringEl.style.top)    || ringPos.current.y;
      const width  = parseFloat(ringEl.style.width)  || 36;
      const height = parseFloat(ringEl.style.height) || 36;
      // left/top are the centre point (translate -50% -50%)
      return {
        left:   left,
        top:    top,
        width:  width,
        height: height,
      };
    };

    // ── Button rect as a morph target ─────────────────────────────────────────
    // Converts getBoundingClientRect to the same centre-anchored space used by
    // the ring (left/top = centre of element).
    const btnToRingRect = (r) => ({
      left:   r.left + r.width  / 2,
      top:    r.top  + r.height / 2,
      width:  r.width,
      height: r.height,
    });

    // ── Cursor-target snap (scroll-safe) ──────────────────────────────────────
    const snapTargetToBtn = (btn) => {
      const target = getCursorTarget();
      if (!target) return;
      const r = btn.getBoundingClientRect();
      target.style.cssText = `
        top:    ${r.top - 5}px;
        left:   ${r.left - 5}px;
        width:  ${r.width + 10}px;
        height: ${r.height + 10}px;
      `;
    };

    // onScrollSnapTarget is superseded — the rAF loop reads getBoundingClientRect()
    // every frame so the target follows the button through scroll automatically.
    const onScrollSnapTarget = () => {};

    // ── Shared btn handler factory ────────────────────────────────────────────
    // Returns { onEnter, onLeave, onMove } for a given ring + target modifier
    // class pair. Both btn-primary and btn-secondary are identical in behaviour;
    // the only difference is which classes they apply.
    const makeBtnHandlers = (ringClass, targetClass) => {
      const onEnter = ({ currentTarget: btn, clientX, clientY }) => {
        const ringEl = ringRef.current;
        if (!ringEl) return;

        setHoveredBtn(btn);

        // Suspend the rAF loop's position writes for the ring so our morph owns it
        ringEl.classList.add(ringClass);

        // Geometry
        const fromRect   = getRingRect(ringEl);
        const btnRect    = btn.getBoundingClientRect();
        const toRect     = btnToRingRect(btnRect);
        const fromRadius = parseFloat(ringEl.style.borderRadius) || 9999; // circle
        const toRadius   = getBtnRadius(btn);

        // Direction bias from entry point relative to button centre
        const { dx, dy } = getEdgeBias(clientX, clientY, btnRect);

        const fromOpacity = parseFloat(ringEl.style.opacity ?? 1) || 1;

        // Snap and reveal corner target immediately on enter
        snapTargetToBtn(btn);
        const target = getCursorTarget();
        target?.classList.add("cursor-target--visible");
        target?.classList.add(targetClass);

        runMorph({
          ringEl,
          fromRect,
          toRect,
          fromRadius,
          toRadius,
          fromOpacity,
          toOpacity: 0,
          duration: 320,
          easing:   easeInOutSine,
          originBias: { dx, dy },
        });
      };

      const onLeave = ({ currentTarget: btn, clientX, clientY }) => {
        const ringEl = ringRef.current;
        if (!ringEl) return;

        setHoveredBtn(null);

        // Hide corner brackets immediately on leave
        const target = getCursorTarget();
        target?.classList.remove("cursor-target--visible");
        target?.classList.remove(targetClass);

        const btnRect    = btn.getBoundingClientRect();
        const fromRect   = btnToRingRect(btnRect);
        const fromRadius = getBtnRadius(btn);

        // toRect is a live getter so the ring always ends exactly at the cursor,
        // even if the user keeps moving after leaving the button.
        const getLiveCursorRect = () => ({
          left:   mouse.current.x,
          top:    mouse.current.y,
          width:  36,
          height: 36,
        });

        const toRadius = 9999; // pill/circle

        // Exit bias — cursor just left, so bias toward the exit edge
        const { dx, dy } = getEdgeBias(clientX, clientY, btnRect);

        runMorph({
          ringEl,
          fromRect,
          toRect:      getLiveCursorRect, // live getter — re-read each frame
          fromRadius,
          toRadius,
          fromOpacity: 0,
          toOpacity:   1,
          duration: 320,
          easing:   easeInOutSine,
          originBias: { dx, dy },
          onComplete: () => {
            // Hand control back to the rAF loop.
            // ringPos is already in sync because we've been tracking mouse.current
            // live each frame, so no jump occurs when the loop re-acquires.
            ringPos.current.x = mouse.current.x;
            ringPos.current.y = mouse.current.y;
            ringEl.classList.remove(ringClass);
            ringEl.style.width           = "";
            ringEl.style.height          = "";
            ringEl.style.borderRadius    = "";
            ringEl.style.transformOrigin = "";
            ringEl.style.opacity         = "";
            ringEl.style.left = `${mouse.current.x}px`;
            ringEl.style.top  = `${mouse.current.y}px`;
          },
        });
      };

      // Move — rAF loop handles target snapping every frame; this is a no-op
      // kept for the event listener registration below.
      const onMove = () => {};

      return { onEnter, onLeave, onMove };
    };

    const {
      onEnter: onBtnPrimaryEnter,
      onLeave: onBtnPrimaryLeave,
      onMove:  onBtnPrimaryMove,
    } = makeBtnHandlers("cursor-ring--btn-primary", "cursor-target--btn-primary");

    const {
      onEnter: onBtnSecondaryEnter,
      onLeave: onBtnSecondaryLeave,
      onMove:  onBtnSecondaryMove,
    } = makeBtnHandlers("cursor-ring--btn-secondary", "cursor-target--btn-secondary");

    // ── .btn (non-.btn-primary) handlers for hovering state ──────────────────
    const onBtnEnter = () => {
      s.hovering = true;
      hoverCls.add();
    };

    const onBtnLeave = () => {
      s.hovering = false;
      hoverCls.remove();
    };

    const btnEls = zone.querySelectorAll(".btn-primary");
    btnEls.forEach((el) => {
      el.addEventListener("mouseenter", onBtnPrimaryEnter);
      el.addEventListener("mouseleave", onBtnPrimaryLeave);
      el.addEventListener("mousemove",  onBtnPrimaryMove, { passive: true });
    });

    const btnSecondaryEls = zone.querySelectorAll(".btn-secondary");
    btnSecondaryEls.forEach((el) => {
      el.addEventListener("mouseenter", onBtnSecondaryEnter);
      el.addEventListener("mouseleave", onBtnSecondaryLeave);
      el.addEventListener("mousemove",  onBtnSecondaryMove, { passive: true });
    });

    // Attach hovering state to all .btn elements (excluding .btn-primary and .btn-secondary which are handled above)
    const allBtnEls = zone.querySelectorAll(".btn:not(.btn-primary):not(.btn-secondary)");
    allBtnEls.forEach((el) => {
      el.addEventListener("mouseenter", onBtnEnter);
      el.addEventListener("mouseleave", onBtnLeave);
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

    const bindBtn = (el) => {
      if (el.classList.contains("btn-primary")) {
        el.addEventListener("mouseenter", onBtnPrimaryEnter);
        el.addEventListener("mouseleave", onBtnPrimaryLeave);
        el.addEventListener("mousemove",  onBtnPrimaryMove, { passive: true });
      } else if (el.classList.contains("btn-secondary")) {
        el.addEventListener("mouseenter", onBtnSecondaryEnter);
        el.addEventListener("mouseleave", onBtnSecondaryLeave);
        el.addEventListener("mousemove",  onBtnSecondaryMove, { passive: true });
      } else {
        el.addEventListener("mouseenter", onBtnEnter);
        el.addEventListener("mouseleave", onBtnLeave);
      }
    };
    const unbindBtn = (el) => {
      if (el.classList.contains("btn-primary")) {
        el.removeEventListener("mouseenter", onBtnPrimaryEnter);
        el.removeEventListener("mouseleave", onBtnPrimaryLeave);
        el.removeEventListener("mousemove",  onBtnPrimaryMove);
      } else if (el.classList.contains("btn-secondary")) {
        el.removeEventListener("mouseenter", onBtnSecondaryEnter);
        el.removeEventListener("mouseleave", onBtnSecondaryLeave);
        el.removeEventListener("mousemove",  onBtnSecondaryMove);
      } else {
        el.removeEventListener("mouseenter", onBtnEnter);
        el.removeEventListener("mouseleave", onBtnLeave);
      }
    };

    const domObserver = new MutationObserver((mutations) => {
      for (const { addedNodes, removedNodes } of mutations) {
        for (const node of addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("magnetic")) sync(node);
          node.querySelectorAll(".magnetic").forEach(sync);
          if (node.classList.contains("btn")) bindBtn(node);
          node.querySelectorAll(".btn").forEach(bindBtn);
        }
        for (const node of removedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("magnetic")) detach(node);
          node.querySelectorAll(".magnetic").forEach(detach);
          if (node.classList.contains("btn")) unbindBtn(node);
          node.querySelectorAll(".btn").forEach(unbindBtn);
        }
      }
    });

    // ── Global listeners ────────────────────────────────────────────────────

    // ✅ Fix: mousemove marked passive — browser can optimise scroll compositing
    const attachListeners = () => {
      document.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      window.addEventListener("scroll", onScrollSnapTarget, { passive: true, capture: true });
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
      window.removeEventListener("scroll", onScrollSnapTarget, { capture: true });
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
      btnEls.forEach((el) => {
        el.removeEventListener("mouseenter", onBtnPrimaryEnter);
        el.removeEventListener("mouseleave", onBtnPrimaryLeave);
        el.removeEventListener("mousemove",  onBtnPrimaryMove);
      });
      btnSecondaryEls.forEach((el) => {
        el.removeEventListener("mouseenter", onBtnSecondaryEnter);
        el.removeEventListener("mouseleave", onBtnSecondaryLeave);
        el.removeEventListener("mousemove",  onBtnSecondaryMove);
      });
      allBtnEls.forEach((el) => {
        el.removeEventListener("mouseenter", onBtnEnter);
        el.removeEventListener("mouseleave", onBtnLeave);
      });
      // Cancel any in-flight morph and restore ring to default state
      if (morphRafId) { cancelAnimationFrame(morphRafId); morphRafId = null; }
      if (morphCleanup) { morphCleanup(); morphCleanup = null; }
      hoveredBtnRef.current = null;
      if (ringRef.current) {
        ringRef.current.classList.remove("cursor-ring--btn-primary");
        ringRef.current.classList.remove("cursor-ring--btn-secondary");
        ringRef.current.style.width        = "";
        ringRef.current.style.height       = "";
        ringRef.current.style.borderRadius = "";
        ringRef.current.style.transformOrigin = "";
        ringRef.current.style.opacity      = "";
      }
      // Ensure target is hidden if it was left visible
      const target = getCursorTarget();
      target?.classList.remove("cursor-target--visible");
      target?.classList.remove("cursor-target--btn-primary");
      target?.classList.remove("cursor-target--btn-secondary");
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