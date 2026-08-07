import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  MEDIA_TYPE,
  composeCaseStudyLightboxItems,
  getProjectContentMedia,
  resolveLightboxIndex,
} from "../../../config/projects.jsx";
import GalleryLightbox from "./GalleryLightbox";
import useLightbox from "./useLightbox";

const CaseStudyLightboxContext = createContext(null);

/**
 * Owns the single case-study lightbox sequence composed from one project:
 * project.contentMedia (section order) + project.gallery.
 *
 * Children open by local ref (mediaType + section + localIndex) — they never
 * need the unified list for display data.
 */
export function CaseStudyLightboxProvider({ project, children }) {
  const items = useMemo(
    () => composeCaseStudyLightboxItems(project),
    [project]
  );

  const {
    lightboxIndex,
    isLightboxClosing,
    isLightboxMounted,
    activeItem,
    openLightbox,
    closeLightbox,
    showPrev,
    showNext,
  } = useLightbox(items);

  const openContentMedia = useCallback(
    (section, localIndex) => {
      const index = resolveLightboxIndex(items, {
        mediaType: MEDIA_TYPE.CONTENT,
        section,
        localIndex,
      });
      if (index >= 0) openLightbox(index);
    },
    [items, openLightbox]
  );

  const openGalleryMedia = useCallback(
    (localIndex) => {
      const index = resolveLightboxIndex(items, {
        mediaType: MEDIA_TYPE.GALLERY,
        localIndex,
      });
      if (index >= 0) openLightbox(index);
    },
    [items, openLightbox]
  );

  const getContentMedia = useCallback(
    (section) => getProjectContentMedia(project, section),
    [project]
  );

  const value = useMemo(
    () => ({
      project,
      slug: project?.slug ?? null,
      gallery: project?.gallery ?? [],
      contentMedia: project?.contentMedia ?? {},
      items,
      getContentMedia,
      openContentMedia,
      openGalleryMedia,
      openAt: openLightbox,
    }),
    [
      project,
      items,
      getContentMedia,
      openContentMedia,
      openGalleryMedia,
      openLightbox,
    ]
  );

  return (
    <CaseStudyLightboxContext.Provider value={value}>
      {children}
      {isLightboxMounted && activeItem ? (
        <GalleryLightbox
          items={items}
          activeItem={activeItem}
          lightboxIndex={lightboxIndex}
          isClosing={isLightboxClosing}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
          label="Case study images"
        />
      ) : null}
    </CaseStudyLightboxContext.Provider>
  );
}

export function useCaseStudyLightbox() {
  const ctx = useContext(CaseStudyLightboxContext);
  if (!ctx) {
    throw new Error(
      "useCaseStudyLightbox must be used within a CaseStudyLightboxProvider"
    );
  }
  return ctx;
}

/** Optional access when a component may render outside a case study page. */
export function useCaseStudyLightboxOptional() {
  return useContext(CaseStudyLightboxContext);
}
