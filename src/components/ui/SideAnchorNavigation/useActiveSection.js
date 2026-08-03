import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Approximate fixed-header clearance used when resolving the active section. */
const DEFAULT_OFFSET_PX = 96;

/**
 * Tracks which section is currently in the reading viewport via IntersectionObserver.
 * Only one section is active at a time; updates are stable in both scroll directions.
 *
 * Strategy: observe all sections; on any intersection change, pick the last section
 * whose top edge has crossed the header offset line. Handles short sections, image
 * load layout shifts (via ResizeObserver), and end-of-page without scroll listeners.
 *
 * @param {string[]} sectionIds - Ordered list of element IDs to observe
 * @param {{ offset?: number, enabled?: boolean, initialId?: string | null }} options
 * @returns {string | null} Active section id
 */
export function useActiveSection(sectionIds, options = {}) {
  const {
    offset = DEFAULT_OFFSET_PX,
    enabled = true,
    initialId = null,
  } = options;

  const idsKey = useMemo(() => sectionIds.join("|"), [sectionIds]);
  const ids = useMemo(
    () => (idsKey ? idsKey.split("|").filter(Boolean) : []),
    [idsKey]
  );

  const [activeId, setActiveId] = useState(
    () => initialId ?? ids[0] ?? null
  );
  const activeRef = useRef(activeId);
  const idsRef = useRef(ids);
  const offsetRef = useRef(offset);
  const rafRef = useRef(0);

  activeRef.current = activeId;
  idsRef.current = ids;
  offsetRef.current = offset;

  const resolveActive = useCallback(() => {
    const ordered = idsRef.current;
    if (!ordered.length) return;

    const line = offsetRef.current;
    let current = ordered[0];

    for (const id of ordered) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      // Section has scrolled up to / past the reading line
      if (top - line <= 1) {
        current = id;
      }
    }

    // Near page bottom: force last section when the document end is in view
    const doc = document.documentElement;
    const nearBottom =
      window.innerHeight + window.scrollY >= doc.scrollHeight - 8;
    if (nearBottom) {
      current = ordered[ordered.length - 1];
    }

    if (current && current !== activeRef.current) {
      setActiveId(current);
    }
  }, []);

  const scheduleResolve = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      resolveActive();
    });
  }, [resolveActive]);

  useEffect(() => {
    if (!enabled || !ids.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(scheduleResolve, {
      root: null,
      // Generous margins so short sections still fire when near the reading line
      rootMargin: `-${Math.max(0, offset - 8)}px 0px -40% 0px`,
      threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
    });

    elements.forEach((el) => observer.observe(el));

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleResolve)
        : null;

    elements.forEach((el) => resizeObserver?.observe(el));

    // Initial resolve after paint (deep links may already be mid-page)
    scheduleResolve();

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [enabled, ids, offset, scheduleResolve]);

  // Keep active id valid when section list changes (route / project swap)
  useEffect(() => {
    if (!ids.length) {
      setActiveId(null);
      return;
    }
    if (!ids.includes(activeRef.current)) {
      setActiveId(ids[0]);
    }
  }, [ids]);

  return activeId;
}

export default useActiveSection;
