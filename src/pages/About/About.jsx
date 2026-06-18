import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import { useMarqueeScroll, Marquee } from "../../hooks/useMarqueeScroll";
import HeroSection from "../../components/ui/HeroSection";
import OverviewList from "../../components/ui/OverviewList";
import SectionLabel from "../../components/ui/SectionLabel";
import { MAIN_OVERVIEW_STATS } from "../../config/overviewStats.jsx";
import { MARQUEE_ROW1, MARQUEE_ROW2 } from "../../config/skillChips.jsx";
import { ABOUT_PRINCIPLES, ABOUT_WHAT } from "../../config/cardsConfig.jsx";
import heroVideo from "../../assets/images/grok-video-a8077b85-082f-45ae-ad4e-0da84ed1eac2.mp4";
import "./About.css";

// Component for individual skill chips in the marquee
const SkillChip = React.memo(({ label, icon, shadow }) => {
  return (
    <>
      <span className="skill-chip" aria-label={label} style={{ "--shadow-color": shadow }}>
        <span className="skill-chip__label">{label}</span>
        <span className="skill-chip__icon" aria-hidden="true">
          {icon}
        </span>
      </span>

      {/*<span className="divider" aria-hidden="true">
        &bull;
      </span>*/}
    </>
  );
});

function About() {
  useMarqueeScroll();
  useSA();

  // Sync route changes with scroll animations
  const location = useLocation();
  useSARouteSync(location.pathname);

  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.setProperty('--path-length', length);
  }, []);  

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="About"
        description={
          <p className="text-muted">From a seasoned graphic designer to a developer creating fully responsive, custom websites, my career has always been driven by a passion for creativity and problem-solving. I enjoy turning ideas into intuitive, meaningful digital experiences that people genuinely enjoy using.</p>
        }
        videoSrc={heroVideo}
      />

      {/* Overview Section */}
      <section className="section section__overview section-padding overflow-hidden" aria-label="Professional Overview">
        <div className="section__overview-inner section__overview-inner--about absolute">
          <OverviewList items={MAIN_OVERVIEW_STATS} />
        </div>
      </section>

      {/* Story Section */}
      <section className="section section__story section-padding" aria-label="My Story">
        <SectionLabel labelCount="02" labelSystem="section.intro" labelTitle="My Story"></SectionLabel>
        <div className="section__content flex-all flex-direction-row flex-vert-center">
          <div className="content__left flex-all flex-direction-column gap-row-1">
            <h2 className="h3">
              A <strong className="text-primary">UI Engineer</strong> focused on building accessible and scalable user interfaces that bridge design and engineering.
            </h2>
            <p className="small text-secondary">My interest in design started back in high school, creating forum banners and signatures for online communities. What began as a fun creative outlet quickly turned into an obsession with web design, spending countless hours experimenting with layouts in Photoshop 6.0 and teaching myself how websites were put together. My first website was built on Geocities for a Team Fortress Classic clan, a project that probably broke a few design rules, but it sparked something that has stayed with me ever since. Looking back, it's funny to think that what started with clan websites and late-night design experiments would eventually grow into a career built around creating things for the web.</p>
            <p className="small text-secondary">My first professional role was with an automotive web provider called Motorwebs. What started as graphic design work quickly evolved into wearing many hats, creating promotions, designing websites, building them, and helping improve their search visibility. It was an exciting time in the industry, as mobile browsing was rapidly taking over and responsive design was still in its early days. Using Bootstrap and HTML5, I helped modernize more than 600 custom dealership websites, transitioning them from separate desktop and mobile experiences into fully responsive sites. Looking back, it was a fast-paced environment that taught me how to adapt, learn quickly, and embrace whatever challenge came next.</p>
            <p className="small text-secondary">Ever since my early days in my career, I've never truly left the automotive industry. Over the past 16 years, I've stayed deeply involved, mentoring individuals, guiding teams, and leading projects both large and small as the industry evolved around me. My experience started hands-on, but it naturally expanded into broader ownership of delivery, quality, and team growth across web and product work in fast-moving environments.</p>
          </div>
          <div className="content__right flex-all flex-vert-center flex-horz-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="logo-svg"
              viewBox="-10 -10 341 233"
              preserveAspectRatio="xMidYMid meet"
              ref={svgRef}
            >
              <defs>
                <linearGradient id="logo-gradient" x1="20%" y1="0%" x2="80%" y2="100%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#55585a" />
                  <stop offset="10%" stopColor="#3d74a6" />
                  <stop offset="25%" stopColor="#ff1493" />
                  <stop offset="45%" stopColor="#00ffff" />
                  <stop offset="65%" stopColor="#ff4500" />
                  <stop offset="85%" stopColor="#9400d3" />
                  <stop offset="100%" stopColor="#262e64" />
                </linearGradient>              

                <clipPath id="logo-clip">
                  <path d="M299.976.5c-9.319.135-15.93 6.549-15.93 6.549l-66.424 63.83-40.51-57.805s-12.484-18.969-33.952 1.763c-18.31 17.68-9.61 31.246-5.829 36.646l40.61 57.998-35.953 34.729L48.962 11.404S42.053 1.594 30.643.778c-5.186-.37-11.307 1.12-18.123 6.238-21.907 16.49-7.222 37.328-7.222 37.328s103.528 147.884 112.083 160c7.501 10.858 24.08 13.137 35.085 2.49l55.882-53.93 33.683 48.106s14.652 19.633 36.896-1.848c17.533-16.931 6.748-31.044 6.748-31.044l-37.55-53.626 71.562-69.166s17.027-16.394-.85-35.56C312.13 2.596 305.566.419 299.976.5" />
                </clipPath>

                <mask id="fill-mask">
                  <rect
                    x="-10" y="-10"
                    width="341" height="233"
                    fill="white"
                  />
                  <rect
                    className="fill-mask-cover"
                    x="-10" y="-10"
                    width="341" height="233"
                    fill="black"
                  />
                </mask>                
              </defs>

              {/* Gradient fill — clipped to path shape, reveals on scroll */}
              <rect
                className="logo-fill"
                x="-10" y="-10"
                width="341" height="233"
                fill="url(#logo-gradient)"
                clipPath="url(#logo-clip)"
                mask="url(#fill-mask)"
              />

              {/* Stroke — animated draw on scroll */}
              <path
                className="logo-path"
                ref={pathRef}
                fill="none"
                stroke="var(--color-text-primary)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M299.976.5c-9.319.135-15.93 6.549-15.93 6.549l-66.424 63.83-40.51-57.805s-12.484-18.969-33.952 1.763c-18.31 17.68-9.61 31.246-5.829 36.646l40.61 57.998-35.953 34.729L48.962 11.404S42.053 1.594 30.643.778c-5.186-.37-11.307 1.12-18.123 6.238-21.907 16.49-7.222 37.328-7.222 37.328s103.528 147.884 112.083 160c7.501 10.858 24.08 13.137 35.085 2.49l55.882-53.93 33.683 48.106s14.652 19.633 36.896-1.848c17.533-16.931 6.748-31.044 6.748-31.044l-37.55-53.626 71.562-69.166s17.027-16.394-.85-35.56C312.13 2.596 305.566.419 299.976.5"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="section section__what flex-all flex-direction-column section-padding">
        <SectionLabel labelCount="03" labelSystem="section.what" labelTitle="What I Bring"></SectionLabel>
        {ABOUT_WHAT.map((item, index) => (
          <div key={item.id} className="card card--stacked section__grain --grain-medium">
            <div className="stacked__text" sa="up glacial mirror delay-400">
              <div className="stacked__label" sa="right slower mirror delay-200">{String(index + 1).padStart(2, "0")} — {item.id}</div>
              <h3 className="stacked__title" sa="right slower mirror delay-400">{item.title}</h3>
              <div className="stacked__body flex-all flex-direction-column gap-row-1">
                {item.body.map((paragraph, i) => (
                  <p key={i} className="small">{paragraph}</p>
                ))} 
              </div>
            </div>
            <div className="stacked__icon" aria-hidden="true" sa="fade glacial delay-600">{item.icon}</div>
          </div>
        ))}
      </section>

      {/* Skill Section */}
      <section className="section section__skills section-padding" aria-label="Skills and Expertise">
        <SectionLabel className="section-padding" labelSystem="section.skills"></SectionLabel>
        <div className="skills__marquee-wrap">
          <Marquee rtl faded>
            {MARQUEE_ROW1.map((item) => (
              <SkillChip key={item.id} {...item} />
            ))}
          </Marquee>

          <Marquee ltr faded>
            {MARQUEE_ROW2.map((item) => (
              <SkillChip key={item.id} {...item} />
            ))}
          </Marquee>
        </div>
      </section>

      {/* Principles Section */}
      <section className="section section__principles section-padding" aria-label="Principles About Work">
        <SectionLabel labelCount="04" labelSystem="section.principles" labelTitle="How I Think"></SectionLabel>
        <div className="cards__wrapper cards--principles gap-column-1 gap-row-1">
          {ABOUT_PRINCIPLES.map((item, index) => (
            <div
              key={item.id}
              className="card card--principles relative section__grain --grain-medium"
              sa={`up slow mirror delay-${(index + 1) * 100}`}
            >
              <h3 className="h5">{item.title}</h3>
              <p className="small text-secondary">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default About;