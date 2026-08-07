import { useCallback, useEffect, useRef, useState } from "react";

/** Keep in sync with CSS close animation duration (ms) */
export const LIGHTBOX_CLOSE_MS = 320;

/**
 * Shared lightbox open / close / nav state.
 * Used by CaseStudyLightboxProvider for the unified case-study sequence.
 */
export default function useLightbox(items = []) {
  const closeTimerRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLightboxClosing, setIsLightboxClosing] = useState(false);

  const isLightboxMounted = lightboxIndex !== null;
  const activeItem = isLightboxMounted ? items[lightboxIndex] ?? null : null;

  const openLightbox = useCallback(
    (index) => {
      if (typeof index !== "number" || index < 0 || index >= items.length) return;
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsLightboxClosing(false);
      setLightboxIndex(index);
    },
    [items.length]
  );

  const closeLightbox = useCallback(() => {
    if (lightboxIndex === null || isLightboxClosing) return;
    setIsLightboxClosing(true);

    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setLightboxIndex(null);
      setIsLightboxClosing(false);
      closeTimerRef.current = null;
    }, LIGHTBOX_CLOSE_MS);
  }, [lightboxIndex, isLightboxClosing]);

  const showPrev = useCallback(() => {
    if (isLightboxClosing || !items.length) return;
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length, isLightboxClosing]);

  const showNext = useCallback(() => {
    if (isLightboxClosing || !items.length) return;
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length, isLightboxClosing]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isLightboxMounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxMounted, closeLightbox, showPrev, showNext]);

  return {
    lightboxIndex,
    isLightboxClosing,
    isLightboxMounted,
    activeItem,
    openLightbox,
    closeLightbox,
    showPrev,
    showNext,
  };
}
