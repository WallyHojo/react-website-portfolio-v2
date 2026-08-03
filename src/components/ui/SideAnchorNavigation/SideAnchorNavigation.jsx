import React, { useCallback, useEffect, useId, useMemo, useRef } from "react";

import { useActiveSection } from "./useActiveSection";
import "./SideAnchorNavigation.css";

/**
 * Scroll to a section, respecting reduced-motion and sticky header offset
 * (via CSS scroll-margin-top on targets).
 */
function scrollToSection(id, { behavior } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  el.scrollIntoView({
    behavior: behavior ?? (reduceMotion ? "auto" : "smooth"),
    block: "start",
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

  const activeId = useActiveSection(sectionIds, {
    enabled: sectionIds.length > 0,
    initialId: sectionIds[0] ?? null,
  });

  // Deep link: honor hash on mount and on hashchange (browser back/forward)
  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const scrollToHash = (behavior = "smooth") => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || !sectionIds.includes(hash)) return;

      // Defer past layout + route scroll-to-top so the target lands correctly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(hash, { behavior });
        });
      });
    };

    // Initial load / project change with hash
    if (window.location.hash) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Slight delay so useScrollToTop and images don't fight the first paint
      const t = window.setTimeout(
        () => scrollToHash(reduceMotion ? "auto" : "smooth"),
        80
      );
      return () => window.clearTimeout(t);
    }

    return undefined;
  }, [sectionIds]);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sectionIds.includes(hash)) {
        scrollToSection(hash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [sectionIds]);

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

    scrollToSection(id);

    // Update URL hash for shareable deep links without full navigation
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, []);

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
