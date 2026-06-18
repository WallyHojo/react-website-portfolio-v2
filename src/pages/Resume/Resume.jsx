import React from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import heroVideo from "../../assets/images/grok-video-6b5748d3-8abf-4a07-be83-3f7f7a34efea.mp4";
import "./Resume.css";

function Resume() {
  useSA();

  const location = useLocation();
  useSARouteSync(location.pathname);

  return (
    <>
      <HeroSection
        title="Resume"
        description="A comprehensive view of my professional experience, leadership across design and engineering teams, and a track record of delivering production-ready interfaces and design systems over 16+ years."
        videoSrc={heroVideo}
      />

      {/* Content sections to be developed */}
      <section className="section section-padding" aria-label="Resume Content">
        <SectionLabel labelTitle="Experience" labelCount="01 career" />
        <div className="section__content">
          <p className="text-muted">Detailed resume content, timeline, and downloadable CV will be added here. The structure will mirror the refined layout used across the rest of the site.</p>
        </div>
      </section>
    </>
  );
}

export default Resume;