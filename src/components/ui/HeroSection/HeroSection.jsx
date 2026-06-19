import React from "react";

import { useIsMobile } from "../../../hooks/useIsMobile.jsx";
import SectionLabel from "../SectionLabel";
import { useDotGrid, DotGrid } from "../../../hooks/useDotGrid";
import SlatsSVG, { HOME_SLATS, PAGE_SLATS } from "../../brand/Slats";
import handleDots from "../../../assets/images/handle-dots.svg";
import arrowDown from "../../../assets/images/arrow-down.svg";
import arrowRight from "../../../assets/images/arrow-right.svg";
import "./HeroSection.css";

// Fallback video (page style). Specific heroes should pass their own via videoSrc.
import defaultPageVideo from "../../../assets/images/grok-video-a8077b85-082f-45ae-ad4e-0da84ed1eac2.mp4";

/**
 * HeroSection
 * Reusable hero with consistent decor (DotGrid, floating shapes, Slats video mask),
 * animated heading, and mask.
 *
 * @param {string} title - Text for the main h1 (also used for the count animation target)
 * @param {string|React.ReactNode} [subtitle] - Optional h2 sub-heading (home style)
 * @param {string} [description] - Optional lead paragraph with text-muted
 * @param {React.ReactNode} [children] - Additional content (e.g. CTA buttons) after description
 * @param {"home"|"page"} [variant="page"] - Affects layout classes and default slats behavior
 * @param {string} [heightClass] - Override e.g. "h-viewport-small" or "h-viewport-hero"
 * @param {string} [className] - Extra classes for the <section>
 * @param {Array} [slats] - Custom slats config (from slatsConfig). Defaults based on variant
 * @param {string} [videoSrc] - Video URL for the slats background. Falls back to a page video.
 * @param {object} [mediaProps] - Props passed to the <video> foreignObject (x,y,width,height)
 * @param {string} [ariaLabel] - Accessible label for the section
 * @param {string} [slatsClassName] - Class applied to the SlatsSVG (e.g. "slats-bg--hero")
 */

export default function HeroSection({
  title,
  subtitle,
  description,
  children,
  variant = "page",
  heightClass,
  className = "",
  slats,
  videoSrc,
  mediaProps,
  ariaLabel,
  slatsClassName,
  titleClassName,
}) {
  useDotGrid();
  const isMobile = useIsMobile();

  const isHome = variant === "home";
  const resolvedHeightClass = heightClass || (isHome ? "h-viewport-small" : "h-viewport-hero");
  const contentWrapperClass = isHome ? "section__content" : "hero__content";

  // Resolve slats configuration
  let resolvedSlats = slats;
  let resolvedMediaProps = mediaProps;

  if (!resolvedSlats) {
    if (isHome) {
      resolvedSlats = HOME_SLATS;
      resolvedMediaProps = mediaProps || { x: "75", y: "0", width: "125%", height: "150%" };
    } else {
      // "page" style: PAGE_SLATS on desktop, HOME_SLATS on mobile (matches About/Contact)
      if (isMobile) {
        resolvedSlats = HOME_SLATS;
        resolvedMediaProps = mediaProps || { x: "75", y: "0", width: "150%", height: "125%" };
      } else {
        resolvedSlats = PAGE_SLATS;
        resolvedMediaProps = mediaProps || { x: "75", y: "0", width: "125%", height: "150%" };
      }
    }
  }

  const resolvedVideo = videoSrc || defaultPageVideo;

  const resolvedSlatsCls = slatsClassName || (isHome ? "slats-bg--hero" : "slats-bg--page");

  const sectionClasses = [
    "section",
    "section__hero",
    resolvedHeightClass,
    "relative",
    "section-padding",
    "overflow-hidden",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const defaultAriaLabel = ariaLabel || (isHome ? "Introduction and Hero" : `${title} Heading and Introduction`);
  const sectionLabel = isHome ? "portfolio.init" : `page.${title}`;

  return (
    <section className={sectionClasses} aria-label={defaultAriaLabel}>
      <div className={`${contentWrapperClass} flex-all flex-vert-bottom h-full`}>
        <div className="content__left flex-all flex-direction-column relative gap-row-1 mt-auto" sa="up glacial mirror">
          <SectionLabel
            className="label__system--hero"
            labelSystem={sectionLabel}
            labelTitle={null}
            labelCount={null}
          />
          <h1 className={`heading${titleClassName ? ` ${titleClassName}` : ""}`} data-sa-to={title} sa="count" data-sa-duration="1000">
            {title}
          </h1>
          {subtitle}
          {description}
          {children}
        </div>
      </div>

      <div className="section__decor absolute">
        {!isMobile && (
          <DotGrid
            color="surface"
            pattern="scatter"
            size="small"
            cols={40}
            count={600}
            className="backdrop-dots"
          />
        )}

        <div className="decor__shape dots--1 absolute" sa="float float-y float-y-loop delay-1000">
          <img src={handleDots} width="52" height="33" alt="Handle dots" sa="up-long glacial delay-800" />
        </div>
        <div className="decor__shape dots--2 absolute" sa="float float-y float-y-loop delay-1200">
          <img src={handleDots} width="52" height="33" alt="Handle dots" sa="down-long glacial delay-1000" />
        </div>
        <div className="decor__shape arrow-down-svg arrow-down--1 absolute" sa="float float-x float-x-loop delay-1400">
          <img src={arrowRight} width="54" height="16" alt="Arrow down drop" sa="right-long glacial delay-1200" />
        </div>
        <div className="decor__shape arrow-down-svg arrow-down--2 absolute" sa="float float-y float-y-loop delay-1600">
          <img src={arrowDown} width="16" height="54" alt="Arrow down drop" sa="down-long glacial delay-1400" />
        </div>

        {resolvedVideo && resolvedSlats && (
          <SlatsSVG
            className={`${resolvedSlatsCls} absolute`}
            mediaType="video"
            mediaSrc={resolvedVideo}
            slats={resolvedSlats}
            mediaProps={resolvedMediaProps || { x: "75", y: "0", width: "125%", height: "150%" }}
          />
        )}
      </div>

      <div className="section__mask absolute"></div>
    </section>
  );
}
