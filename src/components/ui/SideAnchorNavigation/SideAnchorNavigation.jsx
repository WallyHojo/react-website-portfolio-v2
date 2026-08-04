import React, { useCallback, useEffect, useId, useMemo, useRef } from "react";

import { useActiveSection } from "./useActiveSection";
import { scrollTo as lenisScrollTo } from "../../../hooks/lenisController";
import "./SideAnchorNavigation.css";

/** Fallback header clearance if the CSS custom property can't be read. */
const DEFAULT_HEADER_OFFSET_PX = 96;

/**
 * Extra offset applied only to the anchor-nav scroll *destination* — on top
 * of the shared header clearance, not instead of it. This does NOT affect
 * useActiveSection's highlight line or the CSS scroll-margin-top; it only
 * changes where a click (or hash deep-link) actually lands.
 *
 * Sign convention matches Lenis's `offset` (same as CSS scroll-padding-top):
 * positive = extra clearance above the target (stop earlier / higher up),
 * negative = scroll further down, past the section's top edge.
 *
 * Tune this number directly — that's the intended way to adjust it.
 */
const NAV_CLICK_SCROLL_OFFSET_PX = -225;

/**
 * Resolves --side-anchor-header-offset (set in SideAnchorNavigation.css) to
 * a pixel number, whatever unit it's authored in (rem/em/vh/calc()/etc).
 *
 * This is the single source of truth for header clearance, shared by:
 *   - CSS `scroll-margin-top` on section targets (ProjectDetail.css)
 *   - The active-section "reading line" (useActiveSection's offset)
 *   - The scroll destination below (Lenis's offset), before NAV_CLICK_SCROLL_OFFSET_PX
 * Reading it here means those three can never quietly drift apart again.
 */
function getHeaderOffsetPx() {
  if (typeof window === "undefined") return DEFAULT_HEADER_OFFSET_PX;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--side-anchor-header-offset")
    .trim();
  if (!raw) return DEFAULT_HEADER_OFFSET_PX;

  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute; visibility:hidden; height:${raw};`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();

  return px || DEFAULT_HEADER_OFFSET_PX;
}

/**
 * Scroll to a section, respecting reduced-motion and the fixed-header offset.
 *
 * Routed through Lenis (see hooks/lenisController) rather than native
 * Element.scrollIntoView(): this project runs Lenis for its global smooth
 * scroll, which continuously drives window scroll via its own rAF loop.
 * Calling the native scroll APIs while Lenis is active makes the two
 * animations fight over the scroll position each frame, so the page lands
 * close to — but not exactly on — the target section. That's what was
 * causing the anchor nav highlight to land on the wrong section: the
 * active-section detection reads the real landed scroll position, and it
 * was a few dozen pixels off from where a precise scroll would leave it.
 *
 * @param {string} id
 * @param {{ offset?: number, extraOffset?: number }} [options]
 *   offset       - header clearance (defaults to getHeaderOffsetPx())
 *   extraOffset  - added on top; the click-only adjustment (see
 *                  NAV_CLICK_SCROLL_OFFSET_PX above)
 */
function scrollToSection(id, { offset, extraOffset = 0 } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  lenisScrollTo(el, {
    offset: (offset ?? getHeaderOffsetPx()) + extraOffset,
    immediate: reduceMotion,
  });

  return true;
}

/**
 * Production-ready side / horizontal anchor navigation.
 *
 * @param {{
 *   sections: Array<{ id: string, label: string, title?: string }>,
 *   ariaLabel?: string,
 *   className?: string,
 * }} props
 */
function SideAnchorNavigation({
  sections = [],
  ariaLabel = "On this page",
  className = "",
}) {
  const listId = useId();
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef(new Map());

  const sectionIds = useMemo(
    () => sections.map((s) => s.id).filter(Boolean),
    [sections]
  );

  // Computed once per mount; the CSS variable it reads doesn't change at
  // runtime, so there's no need to re-probe the DOM on every render.
  const headerOffsetPx = useMemo(() => getHeaderOffsetPx(), []);

  const activeId = useActiveSection(sectionIds, {
    enabled: sectionIds.length > 0,
    initialId: sectionIds[0] ?? null,
    offset: headerOffsetPx,
  });

  // Deep link: honor hash on mount and on hashchange (browser back/forward)
  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || !sectionIds.includes(hash)) return;

      // Defer past layout + route scroll-to-top so the target lands correctly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(hash, {
            offset: headerOffsetPx,
            extraOffset: NAV_CLICK_SCROLL_OFFSET_PX,
          });
        });
      });
    };

    // Initial load / project change with hash
    if (window.location.hash) {
      // Slight delay so useScrollToTop and images don't fight the first paint
      const t = window.setTimeout(scrollToHash, 80);
      return () => window.clearTimeout(t);
    }

    return undefined;
  }, [sectionIds, headerOffsetPx]);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sectionIds.includes(hash)) {
        scrollToSection(hash, {
          offset: headerOffsetPx,
          extraOffset: NAV_CLICK_SCROLL_OFFSET_PX,
        });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [sectionIds, headerOffsetPx]);

  // Desktop active indicator: slide a bar to the active item
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator || !activeId) return;

    const item = itemRefs.current.get(activeId);
    if (!item) {
      indicator.style.opacity = "0";
      return;
    }

    // Vertical indicator (desktop list)
    const top = item.offsetTop;
    const height = item.offsetHeight;
    indicator.style.opacity = "1";
    indicator.style.transform = `translateY(${top}px)`;
    indicator.style.height = `${height}px`;

    // Keep active pill visible in the horizontal track only —
    // avoid scrollIntoView, which can shift the whole page sideways on mobile.
    const track = item.closest(".side-anchor__track");
    if (track && track.scrollWidth > track.clientWidth) {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const nextLeft = itemLeft - (track.clientWidth - itemWidth) / 2;
      const maxLeft = track.scrollWidth - track.clientWidth;
      const clampedLeft = Math.max(0, Math.min(nextLeft, maxLeft));

      track.scrollTo({
        left: clampedLeft,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [activeId, sections]);

  const handleNavClick = useCallback((event, id) => {
    event.preventDefault();
    if (!id) return;

    scrollToSection(id, {
      offset: headerOffsetPx,
      extraOffset: NAV_CLICK_SCROLL_OFFSET_PX,
    });

    // Update URL hash for shareable deep links without full navigation
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, [headerOffsetPx]);

  const setItemRef = useCallback((id, node) => {
    if (node) {
      itemRefs.current.set(id, node);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  if (!sections.length) return null;

  const rootClass = ["side-anchor", className].filter(Boolean).join(" ");

  return (
    <nav
      ref={navRef}
      className={rootClass}
      aria-label={ariaLabel}
      data-active={activeId || undefined}
    >
      <p className="side-anchor__eyebrow" id={`${listId}-label`}>
        On this page
      </p>

      <div className="side-anchor__shell">
        <span
          ref={indicatorRef}
          className="side-anchor__indicator"
          aria-hidden="true"
        />

        <ul
          className="side-anchor__track"
          aria-labelledby={`${listId}-label`}
        >
          {sections.map((section, index) => {
            const isActive = section.id === activeId;
            const number = String(index + 1).padStart(2, "0");

            return (
              <li
                key={section.id}
                className="side-anchor__item"
                ref={(node) => setItemRef(section.id, node)}
              >
                <a
                  href={`#${section.id}`}
                  className={`side-anchor__link${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleNavClick(e, section.id)}
                  data-cursor="accent"
                >
                  <span className="side-anchor__index" aria-hidden="true">
                    {number}
                  </span>
                  <span className="side-anchor__label">
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default React.memo(SideAnchorNavigation);
