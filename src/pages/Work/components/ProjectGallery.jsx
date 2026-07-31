import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DRAG_THRESHOLD = 8;
/** Keep in sync with CSS close animation duration (ms) */
const LIGHTBOX_CLOSE_MS = 320;

/**
 * Horizontal, drag-scrollable project gallery with click-to-expand lightbox.
 *
 * Drag and click are separated carefully: parent pointer-capture was previously
 * swallowing button clicks, so drag uses window-level listeners after threshold
 * and never captures the pointer on the track for simple taps.
 */
export default function ProjectGallery({ items = [] }) {
  const trackRef = useRef(null);
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    listening: false,
  });
  const ignoreClickRef = useRef(false);
  const closeTimerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
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
    if (isLightboxClosing) return;
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length, isLightboxClosing]);

  const showNext = useCallback(() => {
    if (isLightboxClosing) return;
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length, isLightboxClosing]);

  // Clear pending close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Lock body scroll + keyboard controls while lightbox is open (incl. close anim)
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

  // Clean up window drag listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable function refs via dragRef
  }, []);

  function onWindowPointerMove(event) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(deltaX) <= DRAG_THRESHOLD) return;

    if (!drag.moved) {
      drag.moved = true;
      setIsDragging(true);
      ignoreClickRef.current = true;
    }

    track.scrollLeft = drag.scrollLeft - deltaX;
  }

  function onWindowPointerUp(event) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);

    const didDrag = drag.moved;

    dragRef.current = {
      pointerId: null,
      startX: 0,
      scrollLeft: 0,
      moved: false,
      listening: false,
    };
    setIsDragging(false);

    if (didDrag) {
      // Keep ignoring clicks briefly so the residual click after a drag is dropped
      window.setTimeout(() => {
        ignoreClickRef.current = false;
      }, 150);
    } else {
      ignoreClickRef.current = false;
    }
  }

  const onTrackPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    // Don't start a drag gesture from interactive controls' keyboard path
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
      listening: true,
    };

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
  };

  const onItemClick = (index) => (event) => {
    if (ignoreClickRef.current || dragRef.current.moved || isDragging) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    openLightbox(index);
  };

  if (!items.length) return null;

  return (
    <>
      <div className="case-study__gallery-shell" sa="up slow mirror">
        <p className="case-study__gallery-hint" aria-hidden="true">
          Drag to explore · Click to expand
        </p>

        <div
          ref={trackRef}
          className={`case-study__gallery${isDragging ? " case-study__gallery--dragging" : ""}`}
          role="list"
          aria-label="Project gallery"
          data-cursor="light"
          onPointerDown={onTrackPointerDown}
        >
          {items.map((item, index) => (
            <figure
              key={`${item.caption || item.alt || "gallery"}-${index}`}
              className="case-study__gallery-item relative overflow-hidden"
              role="listitem"
            >
              <button
                type="button"
                className="case-study__gallery-trigger"
                onClick={onItemClick(index)}
                data-cursor="accent"
                aria-haspopup="dialog"
                aria-label={`View larger: ${item.alt || item.caption || `Image ${index + 1}`}`}
              >
                <img src={item.src} alt={item.alt || ""} loading="lazy" draggable={false} />
              </button>
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>

      {isLightboxMounted && activeItem
        ? createPortal(
            <div
              className={`gallery-lightbox${isLightboxClosing ? " gallery-lightbox--closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label="Expanded gallery image"
              aria-hidden={isLightboxClosing ? true : undefined}
            >
              <button
                type="button"
                className="gallery-lightbox__backdrop"
                aria-label="Close expanded image"
                onClick={closeLightbox}
                disabled={isLightboxClosing}
                data-cursor="light"
              />

              <div className="gallery-lightbox__panel">
                <button
                  type="button"
                  className="gallery-lightbox__close"
                  onClick={closeLightbox}
                  disabled={isLightboxClosing}
                  data-cursor="light"
                  aria-label="Close expanded image"
                >
                  ×
                </button>

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                      onClick={showPrev}
                      disabled={isLightboxClosing}
                      data-cursor="light"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="gallery-lightbox__nav gallery-lightbox__nav--next"
                      onClick={showNext}
                      disabled={isLightboxClosing}
                      data-cursor="light"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}

                <figure className="gallery-lightbox__figure">
                  <img
                    src={activeItem.src}
                    alt={activeItem.alt || ""}
                    className="gallery-lightbox__image"
                  />
                  {(activeItem.caption || items.length > 1) && (
                    <figcaption className="gallery-lightbox__caption">
                      {activeItem.caption}
                      {items.length > 1 && (
                        <span className="gallery-lightbox__count">
                          {lightboxIndex + 1} / {items.length}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
