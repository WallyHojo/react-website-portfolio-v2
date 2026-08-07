import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getMediaPoster,
  getProjectContentMedia,
  isVideoMedia,
} from "../../../config/projects.jsx";
import { useCaseStudyLightboxOptional } from "./CaseStudyLightboxContext";

const DRAG_THRESHOLD = 8;

/**
 * Unified case-study media: gallery (drag row) or single/stack media.
 *
 * Supports image and video items in both modes.
 *
 * Gallery (always horizontal drag track):
 *   <ProjectMedia type="gallery" />
 *   <ProjectMedia type="gallery" items={project.gallery} />
 *   <ProjectMedia type="gallery" section="features" />  // contentMedia track
 *
 * Image/video stack; layout places content + media as row or column:
 *   <ProjectMedia type="image" section="design" layout="row">
 *     <div className="case-study__prose">…</div>
 *   </ProjectMedia>
 *
 * Item data — each array entry is a flat object (not nested under Image/Video):
 *
 *   // Image (type optional; defaults to image when sm/lg present)
 *   { type: "image", sm, lg, alt?, caption? }
 *
 *   // Video
 *   { type: "video", src, poster?, alt?, caption? }
 *
 * ❌ Wrong:  { Image: { type: "image", sm, lg } }
 * ✅ Right:  { type: "image", sm, lg }
 */
export default function ProjectMedia({
  type = "image",
  layout = "column",
  section,
  index,
  items: itemsProp,
  project: projectProp,
  className = "",
  sa = "up slow mirror delay-200",
  children,
}) {
  const lightbox = useCaseStudyLightboxOptional();
  const project = projectProp ?? lightbox?.project ?? null;

  const isGallery = type === "gallery";

  const items = useMemo(() => {
    if (itemsProp?.length) return itemsProp;
    // section wins over project.gallery so gallery-styled contentMedia works
    // (e.g. features videos rendered as a drag track)
    if (section && project) return getProjectContentMedia(project, section);
    if (section && lightbox) return lightbox.getContentMedia(section);
    if (isGallery) return project?.gallery ?? lightbox?.gallery ?? [];
    return [];
  }, [itemsProp, isGallery, project, section, lightbox]);

  if (isGallery) {
    return (
      <GalleryTrack
        items={items}
        className={className}
        onOpen={(localIndex) => {
          // Content-media sections open via section + localIndex; bare galleries
          // (project.gallery) use the gallery mediaType in the unified sequence.
          if (section) {
            lightbox?.openContentMedia(section, localIndex);
          } else {
            lightbox?.openGalleryMedia(localIndex);
          }
        }}
      />
    );
  }

  // --- Image / stack mode ---
  if (!section && !itemsProp?.length) {
    return children ? <>{children}</> : null;
  }

  const displayItems =
    typeof index === "number" ? [items[index]].filter(Boolean) : items;

  const hasMedia = displayItems.length > 0;
  const hasContent = Boolean(children);
  const layoutMode = layout === "row" ? "row" : "column";

  if (!hasMedia && !hasContent) return null;

  if (!hasMedia) return <>{children}</>;

  const media = (
    <div
      className={[
        "project-media",
        "project-media--image",
        "project-media--stack",
        !hasContent ? className : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-content-media-section={section || undefined}
    >
      {displayItems.map((item, i) => {
        const localIndex = typeof index === "number" ? index : i;
        const video = isVideoMedia(item);
        const key = `${section || "media"}-${localIndex}-${item.alt || item.caption || i}`;

        return (
          <figure
            key={key}
            className={[
              "project-media__figure",
              "relative",
              "overflow-hidden",
              video ? "project-media__figure--video" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            sa={sa}
          >
            <button
              type="button"
              className="project-media__trigger"
              onClick={() => lightbox?.openContentMedia(section, localIndex)}
              data-cursor="accent"
              aria-haspopup="dialog"
              aria-label={
                video
                  ? `Play video: ${item.alt || item.caption || `Video ${localIndex + 1}`}`
                  : `View larger: ${item.alt || item.caption || `Image ${localIndex + 1}`}`
              }
            >
              <MediaPreview item={item} />
              <span className="project-media__hint" aria-hidden="true">
                {video ? "Click to play" : "Click to expand"}
              </span>
            </button>
            {item.caption ? (
              <figcaption className="project-media__caption">{item.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );

  if (!hasContent) return media;

  return (
    <div
      className={[
        "project-media__layout",
        `project-media__layout--${layoutMode}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="project-media__content">{children}</div>
      {media}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared preview (image still or video poster / silent frame)                */
/* -------------------------------------------------------------------------- */

function MediaPreview({ item }) {
  const videoRef = useRef(null);
  const video = isVideoMedia(item);
  const poster = getMediaPoster(item);

  // Browsers require muted + playsInline for autoplay; retry play if policy delays it
  useEffect(() => {
    if (!video) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;

    el.muted = true;
    const play = () => {
      const result = el.play();
      if (result?.catch) result.catch(() => {});
    };

    play();
    el.addEventListener("loadeddata", play);
    return () => {
      el.removeEventListener("loadeddata", play);
      el.pause();
    };
  }, [video, item.src]);

  if (video) {
    return (
      <>
        <video
          ref={videoRef}
          className="project-media__video-preview"
          src={item.src}
          poster={poster || undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
        />
      </>
    );
  }

  return (
    <img
      src={item.sm || item.lg}
      alt={item.alt || ""}
      loading="lazy"
      draggable={false}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery track — horizontal drag only                                       */
/* -------------------------------------------------------------------------- */

function GalleryTrack({ items = [], className = "", onOpen }) {
  const trackRef = useRef(null);
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    moved: false,
    listening: false,
  });
  const ignoreClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable refs via dragRef
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

  const onItemClick = (localIndex) => (event) => {
    if (ignoreClickRef.current || dragRef.current.moved || isDragging) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onOpen?.(localIndex);
  };

  if (!items.length) return null;

  return (
    <div
      className={["project-media", "project-media--gallery", className]
        .filter(Boolean)
        .join(" ")}
      sa="up slow mirror"
    >
      <p className="project-media__gallery-hint" aria-hidden="true">
        Drag to explore · Click to expand
      </p>

      <div
        ref={trackRef}
        className={`project-media__track${isDragging ? " project-media__track--dragging" : ""}`}
        role="list"
        aria-label="Project gallery"
        data-cursor="light"
        onPointerDown={onTrackPointerDown}
      >
        {items.map((item, i) => {
          const video = isVideoMedia(item);

          return (
            <figure
              key={`${item.caption || item.alt || "gallery"}-${i}`}
              className={[
                "project-media__figure",
                "project-media__figure--gallery",
                "relative",
                "overflow-hidden",
                video ? "project-media__figure--video" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="listitem"
            >
              <button
                type="button"
                className="project-media__trigger"
                onClick={onItemClick(i)}
                data-cursor="accent"
                aria-haspopup="dialog"
                aria-label={
                  video
                    ? `Play video: ${item.alt || item.caption || `Video ${i + 1}`}`
                    : `View larger: ${item.alt || item.caption || `Image ${i + 1}`}`
                }
              >
                <MediaPreview item={item} />
              </button>
              {item.caption ? (
                <figcaption className="project-media__caption">{item.caption}</figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
