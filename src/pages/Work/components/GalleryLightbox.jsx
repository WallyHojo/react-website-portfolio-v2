import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { isVideoMedia } from "../../../config/projects.jsx";

/**
 * Full-screen media lightbox (portal) — images and videos.
 * Presentation only — open/close/nav owned by useLightbox / CaseStudyLightboxProvider.
 */
export default function GalleryLightbox({
  items = [],
  activeItem,
  lightboxIndex,
  isClosing = false,
  onClose,
  onPrev,
  onNext,
  label = "Expanded media",
}) {
  const videoRef = useRef(null);
  const isVideo = isVideoMedia(activeItem);

  // Pause video when navigating away, closing, or unmounting
  useEffect(() => {
    const el = videoRef.current;
    return () => {
      if (el) {
        el.pause();
      }
    };
  }, [lightboxIndex, isClosing]);

  useEffect(() => {
    if (isClosing && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isClosing]);

  if (!activeItem) return null;

  return createPortal(
    <div
      className={`gallery-lightbox${isClosing ? " gallery-lightbox--closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-hidden={isClosing ? true : undefined}
    >
      <div className="gallery-lightbox__header">
        {items.length > 1 && (
          <span className="gallery-lightbox__count">
            {lightboxIndex + 1} / {items.length}
          </span>
        )}

        <button
          type="button"
          className="gallery-lightbox__close"
          onClick={onClose}
          disabled={isClosing}
          data-cursor="light"
          aria-label="Close expanded media"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className="gallery-lightbox__backdrop"
        aria-label="Close expanded media"
        onClick={onClose}
        disabled={isClosing}
        data-cursor="light"
      />

      <div className="gallery-lightbox__panel">
        {items.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--prev"
              onClick={onPrev}
              disabled={isClosing}
              data-cursor="light"
              aria-label="Previous media"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--next"
              onClick={onNext}
              disabled={isClosing}
              data-cursor="light"
              aria-label="Next media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </>
        )}

        <figure className="gallery-lightbox__figure">
          {isVideo ? (
            <video
              key={`video-${lightboxIndex}-${activeItem.src}`}
              ref={videoRef}
              className="gallery-lightbox__video"
              src={activeItem.src}
              poster={activeItem.poster || activeItem.sm || undefined}
              controls
              playsInline
              autoPlay
              preload="metadata"
              aria-label={activeItem.alt || activeItem.caption || "Video"}
            />
          ) : (
            <img
              key={`image-${lightboxIndex}-${activeItem.lg || activeItem.sm}`}
              src={activeItem.lg || activeItem.sm}
              alt={activeItem.alt || ""}
              className="gallery-lightbox__image"
            />
          )}
          {activeItem.caption ? (
            <figcaption className="gallery-lightbox__caption">
              {activeItem.caption}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </div>,
    document.body
  );
}
