import React from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import CapabilityMap from "./components/CapabilityMap";
import { CORE_EXPERTISE, TECH_STACK, EXPERIENCE_HIGHLIGHTS, DEV_PHILOSOPHY } from "../../config/cardsConfig.jsx";
import heroVideo from "../../assets/images/grok-video-a8077b85-082f-45ae-ad4e-0da84ed1eac2.mp4";
import "../../assets/styles/noise.css";
import "./Skills.css";

function ExpertiseCard({ title, summary, focus, index }) {
  return (
    <article
      className="expertise__card relative section__grain --grain-medium"
      sa={`up slow mirror delay-${(index + 1) * 100}`}
    >
      <span className="expertise__index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="h5">{title}</h3>
      <p className="expertise__summary">{summary}</p>
      <ul className="expertise__focus">
        {focus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function TechCluster({ label, items, index }) {
  return (
    <div className="tech-stack__cluster" sa={`up slow mirror delay-${(index + 1) * 150}`}>
      <h3 className="tech-stack__cluster-label">{label}</h3>
      <ul className="tech-stack__list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="tech-stack__item">
              {item.icon && (
                <span className="tech-stack__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="tech-stack__name">{item.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HighlightCard({ index, title, description, icon, cardIndex }) {
  return (
    <article
      className="highlights__card relative section__grain --grain-subtle"
      sa={`diag-tr-bl slow mirror delay-${(cardIndex + 1) * 150}`}
    >
      <div className="highlights__card-top flex-all flex-space-between flex-vert-center">
        <span className="highlights__index">{index}</span>
        <span className="highlights__icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="h5">{title}</h3>
      <p>{description}</p>
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
        description={
          <p className="text-muted">
            Deep expertise across the modern web stack, from design systems and component
            architecture to performant front-end engineering, tooling, and cross-functional
            collaboration.
          </p>
        }
        videoSrc={heroVideo}
      />

      {/* Core Expertise */}
      <section className="section section__expertise section-padding" aria-label="Core Expertise">
        <SectionLabel labelCount="01" labelSystem="section.expertise" labelTitle="Core Expertise" />
        <div className="section__content expertise__intro" sa="up glacial mirror">
          <p>Nine disciplines that define how I approach interface work, not proficiency meters, but the domains where I operate daily and deliver production outcomes.</p>
        </div>
        <div className="expertise__grid gap-column-1 gap-row-1">
          {CORE_EXPERTISE.map((item, index) => (
            <ExpertiseCard key={item.id} {...item} index={index} />
          ))}
        </div>
      </section>

      {/* Interactive Capability Map */}
      <section
        className="section section__capability section-padding"
        aria-label="Interactive Skills Showcase"
      >
        <SectionLabel
          labelCount="02"
          labelSystem="section.capability"
          labelTitle="Capability Map"
        />
        <div className="section__content capability__intro" sa="up-long glacial mirror">
          <p>
            An interconnected view of how expertise clusters around UI engineering, select a
            node to explore how interface, architecture, experience, delivery, and craft
            reinforce one another.
          </p>
        </div>
        <CapabilityMap />
      </section>

      {/* Tools & Technologies */}
      <section
        className="section section__tech section-padding"
        aria-label="Tools and Technologies"
      >
        <SectionLabel
          labelCount="03"
          labelSystem="section.stack"
          labelTitle="Tools & Technologies"
        />
        <div className="section__content tech-stack__intro" sa="up-long glacial mirror">
          <p>
            The technologies I reach for most often, organized by role in the stack, not ranked
            by familiarity.
          </p>
        </div>
        <div className="tech-stack__grid gap-column-1 gap-row-1">
          {TECH_STACK.map((cluster, index) => (
            <TechCluster key={cluster.id} {...cluster} index={index} />
          ))}
        </div>
      </section>

      {/* Experience Highlights */}
      <section
        className="section section__highlights section-padding"
        aria-label="Experience Highlights"
      >
        <SectionLabel
          labelCount="04"
          labelSystem="section.highlights"
          labelTitle="In Practice"
        />
        <div className="section__content highlights__intro" sa="up-long glacial mirror">
          <p>
            Real-world capabilities demonstrated through delivery, not years on a timeline, but
            outcomes that show how these skills translate to production work.
          </p>
        </div>
        <div className="highlights__grid gap-column-1 gap-row-1 overflow-hidden">
          {EXPERIENCE_HIGHLIGHTS.map((item, index) => (
            <HighlightCard key={item.id} {...item} cardIndex={index} />
          ))}
        </div>
      </section>

      {/* Development Philosophy */}
      <section
        className="section section__philosophy section-padding"
        aria-label="Development Philosophy"
      >
        <SectionLabel
          labelCount="05"
          labelSystem="section.philosophy"
          labelTitle="How I Build"
        />
        <div className="philosophy__wrapper gap-column-1 gap-row-1">
          {DEV_PHILOSOPHY.map((item, index) => (
            <div
              key={item.id}
              className="philosophy__card relative section__grain --grain-medium"
              sa={`up slow mirror delay-${(index + 1) * 100}`}
            >
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