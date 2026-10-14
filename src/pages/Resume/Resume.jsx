import React from "react";
import { useLocation } from "react-router-dom";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import HeroSection from "../../components/ui/HeroSection";
import SectionLabel from "../../components/ui/SectionLabel";
import OverviewList from "../../components/ui/OverviewList";
import Btn from "../../components/ui/Buttons";
import { PAGE_SEO } from "../../config/seo";
import {
  RESUME_PDF,
  RESUME_SUMMARY,
  RESUME_STATS,
  RESUME_EXPERIENCE,
  RESUME_SKILLS,
  RESUME_PROJECTS,
  RESUME_EDUCATION,
} from "../../config/resumeData";
import heroVideo from "../../assets/videos/grok-video-6b5748d3-8abf-4a07-be83-3f7f7a34efea.mp4";
import "../../assets/styles/cards.css";
import "./Resume.css";

function BulletList({ items }) {
  return (
    <ul className="card__list flex-all flex-direction-column">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Resume() {
  useSA();

  const location = useLocation();
  useSARouteSync(location.pathname);

  return (
    <>
      <HeroSection
        title="Resume"
        metaDescription={PAGE_SEO.resume.description}
        subtitle={
          <h2 className="h3 sub-heading">
            A <strong className="text-primary">{RESUME_SUMMARY.headline}</strong> blending front-end development and UI/UX design
          </h2>
        }
        description={<p className="text-muted">Experience, skills, and project highlights from building and maintaining responsive, user-centered interfaces across hundreds of client websites.</p>}
        videoSrc={heroVideo}
      >
        <div className="hero__content-actions flex-all flex-wrap gap-2">
          <Btn href={RESUME_PDF} download="Walter-Carlson-Resume.pdf" primary className="magnetic magnetic--subtle" data-cursor="accent">
            Download PDF
          </Btn>
          <Btn to="/contact" secondary className="magnetic magnetic--subtle btn--no-target">
            Get in Touch
          </Btn>
        </div>
      </HeroSection>

      {/* Summary */}
      <section className="section section-padding overflow-hidden" aria-labelledby="resume-summary">
        <SectionLabel labelCount="02" labelSystem="resume.summary" labelTitle="Summary" titleId="resume-summary" />
        <div className="resume__summary">
          <p className="resume__summary-body" sa="up-long glacial mirror">{RESUME_SUMMARY.body}</p>
          <dl className="resume__facts card" sa="up slow mirror delay-200">
            {RESUME_SUMMARY.facts.map(({ label, value, href }) => (
              <div key={label} className="resume__fact">
                <dt>{label}</dt>
                <dd>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="accent">
                      {value}<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="resume__stats">
          <OverviewList items={RESUME_STATS} />
        </div>
      </section>

      {/* Experience */}
      <section className="section section-padding" aria-labelledby="resume-experience">
        <SectionLabel labelCount="03" labelSystem="resume.experience" labelTitle="Experience" titleId="resume-experience" />
        <ol className="resume__timeline">
          {RESUME_EXPERIENCE.map((job) => (
            <li key={job.id} className="resume__role" sa="up-long glacial mirror">
              <div className="resume__role-meta">
                <p className="resume__role-dates">
                  <time>{job.start}</time> – <time>{job.end}</time>
                </p>
                <p className="resume__role-company">{job.company}</p>
                <p className="resume__role-location">{job.location}</p>
              </div>
              <article className="resume__role-body card">
                <h3 className="h5">{job.role}</h3>
                <BulletList items={job.highlights} />
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section className="section section-padding" aria-labelledby="resume-skills">
        <SectionLabel labelCount="04" labelSystem="resume.skills" labelTitle="Core Skills" titleId="resume-skills" />
        <div className="resume__skills cards__wrapper cards__wrapper--default gap-column-1 gap-row-1">
          {RESUME_SKILLS.map((group, index) => (
            <article key={group.id} className="card relative section__grain --grain-medium" sa={`up slow mirror delay-${(index + 1) * 100}`}>
              <h3 className="h5">{group.title}</h3>
              <ul className="resume__chips flex-all flex-wrap">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Project highlights */}
      <section className="section section-padding" aria-labelledby="resume-projects">
        <SectionLabel labelCount="05" labelSystem="resume.projects" labelTitle="Project Highlights" titleId="resume-projects" />
        <div className="cards__wrapper cards__wrapper--wide gap-column-1 gap-row-1">
          {RESUME_PROJECTS.map((project, index) => (
            <article key={project.id} className="card relative section__grain --grain-medium" sa={`up slow mirror delay-${(index + 1) * 100}`}>
              <h3 className="h5">{project.title}</h3>
              <BulletList items={project.highlights} />
            </article>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="section section-padding" aria-labelledby="resume-education">
        <SectionLabel labelCount="06" labelSystem="resume.education" labelTitle="Education" titleId="resume-education" />
        <article className="resume__education card relative section__grain --grain-medium" sa="up slow mirror">
          <h3 className="h5">{RESUME_EDUCATION.credential}</h3>
          <p>
            {RESUME_EDUCATION.school} · {RESUME_EDUCATION.location} · GPA {RESUME_EDUCATION.gpa}
          </p>
          <ul className="resume__chips flex-all flex-wrap">
            {RESUME_EDUCATION.honors.map((honor) => (
              <li key={honor}>{honor}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}

export default Resume;