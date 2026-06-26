import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import Btn from "../../components/ui/Buttons";
import { CORE_EXPERTISE, CAPABILITY_CALLOUT, TECH_STACK, EXPERIENCE_HIGHLIGHTS, DEV_PHILOSOPHY } from "../../config/cardsConfig.jsx";
import heroVideo from "../../assets/videos/grok-video-a8077b85-082f-45ae-ad4e-0da84ed1eac2.mp4";
import "../../assets/styles/noise.css";
import "./Skills.css";

function CapabilityCategory({ label, tag, base, accent, index }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.setProperty("--path-length", length);
  }, []);

  return (
    <div
      className={`capability__label capability__label--${index + 1} flex-all flex-direction-column flex-space-end`}
      style={{
        "--base-color": base,
        "--accent-color": accent,
      }}
    >
      <div className="label__node-status flex-all flex-space-between flex-vert-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="logo-svg" viewBox="-5 -10 335 233" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
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
              <rect x="-5" y="-10" width="335" height="233" fill="white" />
              <rect className="fill-mask-cover" x="-5" y="-10" width="335" height="233" fill="black" />
            </mask>
          </defs>

          {/* Gradient fill — clipped to path shape, reveals on scroll */}
          <rect className="logo-fill" x="-5" y="-10" width="335" height="233" fill="url(#logo-gradient)" clipPath="url(#logo-clip)" mask="url(#fill-mask)" />

          {/* Stroke — animated draw on scroll */}
          <path className="logo-path" ref={pathRef} fill="none" stroke="var(--color-text-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" d="M299.976.5c-9.319.135-15.93 6.549-15.93 6.549l-66.424 63.83-40.51-57.805s-12.484-18.969-33.952 1.763c-18.31 17.68-9.61 31.246-5.829 36.646l40.61 57.998-35.953 34.729L48.962 11.404S42.053 1.594 30.643.778c-5.186-.37-11.307 1.12-18.123 6.238-21.907 16.49-7.222 37.328-7.222 37.328s103.528 147.884 112.083 160c7.501 10.858 24.08 13.137 35.085 2.49l55.882-53.93 33.683 48.106s14.652 19.633 36.896-1.848c17.533-16.931 6.748-31.044 6.748-31.044l-37.55-53.626 71.562-69.166s17.027-16.394-.85-35.56C312.13 2.596 305.566.419 299.976.5" />
        </svg>
        <span>●●●</span>
      </div>
      <div className="flex-all flex-direction-row flex-vert-center gap-column-1">
        <span className="label__node-tag">
          <small>{tag}</small>
        </span>
        <span className="label__node-label">
          <strong>{label}</strong>
        </span>
      </div>
    </div>
  );
}

function CapabilitySummary({ label, tag, description, capabilities, base, accent, index, total }) {
  return (
    <article
      className={`capability__description capability__description--${index + 1} flex-all flex-direction-column gap-row-1`}
      style={{
        viewTimelineName: `--cap-${index + 1}`,
        "--base-color": base,
        "--accent-color": accent,
      }}
    >
      <div className="description__panel-number flex-all flex-vert-center gap-column-1">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div className="description__panel-accent"></div>
      <header className="description__panel-header flex-all flex-direction-row flex-vert-center gap-column-1">
        <span className="description__panel-tag">{tag}</span>
        <h3>
          <strong>{label}</strong>
        </h3>
      </header>
      <p className="description__panel-desc">{description}</p>
      <ul className="description__panel-list flex-all flex-wrap">
        {capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function Skills() {
  useSA();

  const location = useLocation();
  useSARouteSync(location.pathname);

  return (
    <>
      <HeroSection
        title="Skills"
        subtitle={
          <h2 className="h3 sub-heading">
            Engineering interfaces where <strong className="text-primary">craft meets precision</strong>
          </h2>
        }
        description={<p className="text-muted">Deep expertise across the modern web stack, from design systems and component architecture to performant front-end engineering, tooling, and cross-functional collaboration.</p>}
        videoSrc={heroVideo}
      />

      {/* Core Expertise */}
      <section className="section section__expertise section-padding" aria-label="Core Expertise">
        <SectionLabel labelCount="02" labelSystem="section.expertise" labelTitle="Core Expertise" />
        <div className="section__intro" sa="up glacial mirror">
          <p>Nine disciplines that define how I approach interface work, not proficiency meters, but the domains where I operate daily and deliver production outcomes.</p>
        </div>
        <div className="cards__wrapper cards__wrapper--default gap-column-1 gap-row-1">
          {CORE_EXPERTISE.map((item, index) => (
            <article key={item.id} className="card relative section__grain --grain-medium" sa={`up slow mirror delay-${(index + 1) * 100}`}>
              <span className="expertise__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="h5">{item.title}</h3>
              <p className="expertise__summary">{item.summary}</p>
              <ul className="expertise__focus flex-all flex-wrap">
                {item.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Capability */}
      <section className="section section__capability section-padding" aria-label="Interactive Skills Showcase">
        <SectionLabel labelCount="03" labelSystem="section.capability" labelTitle="Capability" />
        <div className="section__intro" sa="up-long glacial mirror">
          <p>My experience spans the full lifecycle of digital products, from shaping interface systems and front-end architecture to refining the details that elevate the user experience. While technology and processes continue to evolve, my focus remains the same: creating thoughtful, scalable solutions that balance user needs, business goals, and long-term maintainability.</p>
        </div>
        <div className="capability__container">
          <div className="capability__col capability__col--category flex-all flex-horz-center">
            <div className="capability__category">
              <div className="capability__notch hidden-mobile"></div>
              <div className="capability__item flex-all flex-horz-center">
                {CAPABILITY_CALLOUT.map((item, index) => (
                  <CapabilityCategory key={item.id} {...item} index={index} />
                ))}
              </div>
            </div>
          </div>
          <div className="capability__col capability__col--summary flex-all flex-direction-column flex-horz-center">
            {CAPABILITY_CALLOUT.map((item, index) => (
              <CapabilitySummary key={item.id} {...item} index={index} total={CAPABILITY_CALLOUT.length} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="section section__tech section-padding" aria-label="Tools and Technologies">
        <SectionLabel labelCount="04" labelSystem="section.stack" labelTitle="Tools & Technologies" />
        <div className="section__intro" sa="up-long glacial mirror">
          <p>The technologies I reach for most often, organized by role in the stack, not ranked by familiarity.</p>
        </div>
        <div className="cards__wrapper cards__wrapper--compact gap-column-1 gap-row-1">
          {TECH_STACK.map((cluster, index) => (
            <div key={cluster.id} className="card cards--tech-stack" sa={`up slow mirror delay-${(index + 1) * 100}`}>
              <h3 className="tech-stack__label">{cluster.label}</h3>
              <ul className="tech-stack__list flex-all flex-direction-column">
                {cluster.items.map((item) => (
                  <li key={item.id}>
                    <Btn href={item.url} plain target="_blank">
                      <span className="tech-stack__item">
                        {item.icon && (
                          <span className="tech-stack__icon flex-all flex-horz-center flex-vert-center" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <span className="tech-stack__name">{item.name}</span>
                      </span>
                    </Btn>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="section section__highlights section-padding overflow-hidden" aria-label="Experience Highlights">
        <SectionLabel labelCount="05" labelSystem="section.highlights" labelTitle="In Practice" />
        <div className="section__intro" sa="up-long glacial mirror">
          <p>Real-world capabilities demonstrated through delivery, not years on a timeline, but outcomes that show how these skills translate to production work.</p>
        </div>
        <div className="cards__wrapper cards__wrapper--wide gap-column-1 gap-row-1">
          {EXPERIENCE_HIGHLIGHTS.map((item, index) => (
            <article key={item.id} className="card relative section__grain --grain-subtle" sa={`diag-tr-bl slow mirror delay-${(index + 1) * 100}`}>
              <div className="highlights__card-top flex-all flex-space-between flex-vert-center">
                <span className="highlights__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="highlights__icon flex-all flex-horz-center flex-vert-center" aria-hidden="true" sa="fade slow mirror delay-200">
                  {item.icon}
                </span>
              </div>
              <h3 className="h5">{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Development Philosophy */}
      <section className="section section__philosophy section-padding" aria-label="Development Philosophy">
        <SectionLabel labelCount="06" labelSystem="section.philosophy" labelTitle="How I Build" />
        <div className="cards__wrapper cards__wrapper--compact gap-column-1 gap-row-1">
          {DEV_PHILOSOPHY.map((item, index) => (
            <div key={item.id} className="card relative section__grain --grain-medium" sa={`up slow mirror delay-${(index + 1) * 100}`}>
              <h3 className="h5">{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Skills;