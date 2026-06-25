import React from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import FeaturedProjectRow from "./components/FeaturedProjectRow";
import ProjectCollection from "./components/ProjectCollection";
import { getFeaturedProjects, PROJECTS, WORK_HIGHLIGHTS } from "../../config/projects.jsx";
import heroVideo from "../../assets/videos/grok-video-1e71206d-e9f4-40b1-91a2-dc620ab60a66.mp4";
import "../../assets/styles/noise.css";
import "./Work.css";

function WorkIndex() {
  useSA();

  const location = useLocation();
  useSARouteSync(location.pathname);

  const featured = getFeaturedProjects();

  return (
    <>
      <HeroSection
        title="Work"
        subtitle={
          <h2 className="h3 sub-heading">
            Curated projects where{" "}
            <strong className="text-primary">design intent meets engineering craft</strong>
          </h2>
        }
        description={
          <p className="text-muted">
            A selection of digital experiences built through research, iteration, and
            meticulous front-end execution, from automotive platforms and dashboards to
            interactive design systems.
          </p>
        }
        videoSrc={heroVideo}
      />

      {/* Featured Projects */}
      <section
        className="section section__featured section-padding overflow-hidden"
        aria-label="Featured Projects"
      >
        <SectionLabel
          labelCount="01"
          labelSystem="section.featured"
          labelTitle="Featured Work"
        />
        <div className="work__intro" sa="up-long glacial mirror">
          <p>
            Immersive case studies presented as editorial experiences, each project tells
            the story of challenge, process, and outcome rather than listing deliverables.
          </p>
        </div>
        <div className="featured-projects">
          {featured.map((project, index) => (
            <FeaturedProjectRow
              key={project.slug}
              index={index + 1}
              reversed={index % 2 === 1}
              {...project}
            />
          ))}
        </div>
      </section>

      {/* Project Collection */}
      <section
        className="section section__collection section-padding"
        aria-label="Project Collection"
      >
        <SectionLabel
          labelCount="02"
          labelSystem="section.collection"
          labelTitle="All Projects"
        />
        <div className="work__intro" sa="up-long glacial mirror">
          <p>
            Browse the full collection by category. Every entry links to a detailed case
            study covering strategy, design, development, and results.
          </p>
        </div>
        <ProjectCollection projects={PROJECTS} />
      </section>

      {/* Work Highlights */}
      <section
        className="section section__highlights section-padding"
        aria-label="Selected Work Highlights"
      >
        <SectionLabel
          labelCount="03"
          labelSystem="section.highlights"
          labelTitle="Impact"
        />
        <div className="work__intro" sa="up-long glacial mirror">
          <p>
            Outcomes and accomplishments across projects, not vanity metrics, but the
            results that shaped how I approach interface work.
          </p>
        </div>
        <div className="work-highlights__grid gap-column-1 gap-row-1">
          {WORK_HIGHLIGHTS.map((item, index) => (
            <article
              key={item.id}
              className="work-highlights__card relative section__grain --grain-medium"
              sa={`up slow mirror delay-${(index + 1) * 100}`}
            >
              <span className="work-highlights__index" aria-hidden="true">
                {item.index}
              </span>
              <h3 className="h5">{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default WorkIndex;