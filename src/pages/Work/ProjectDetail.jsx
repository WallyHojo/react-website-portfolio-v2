import React from "react";
import { useLocation, useParams } from "react-router-dom";

import { TransitionLink } from "../../components/ui/PageTransition/PageTransition";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.jsx";
import Btn from "../../components/ui/Buttons";
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import SectionLabel from "../../components/ui/SectionLabel";
import ProjectNav from "./components/ProjectNav";
import ProjectGallery from "./components/ProjectGallery";
import useProjectSEO from "./hooks/useProjectSEO";
import { getAdjacentProjects, getProjectBySlug } from "../../config/projects.jsx";
import handleDots from "../../assets/images/handle-dots.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import arrowRight from "../../assets/images/arrow-right.svg";
import "../../assets/styles/noise.css";
import "../../components/ui/HeroSection/HeroSection.css";
import "./ProjectDetail.css";

function CaseStudyBlock({ label, title, children, count, saDelay = 200 }) {
  return (
    <section className="section-padding" aria-labelledby={`${label}-heading`}>
      <SectionLabel
        labelCount={count}
        labelSystem={label}
        labelTitle={title}
      />
      <div className="case-study__content" sa={`up-long glacial mirror delay-${saDelay}`}>
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="case-study__list flex-all flex-direction-column">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function FeatureCard({ title, description, index }) {
  return (
    <article
      className="case-study__feature relative section__grain --grain-subtle"
      sa={`up slow mirror delay-${(index + 1) * 100}`}
    >
      <h3 className="h5">{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function ProjectNotFound() {
  return (
    <section className="section section-padding project-not-found flex-all flex-direction-column flex-horz-center" aria-label="Project not found">
      <h1 className="h2">Project not found</h1>
      <p className="text-muted">The case study you're looking for doesn't exist or has been moved.</p>
      <TransitionLink to="/work" className="project-not-found__link">
        Back to work
      </TransitionLink>
    </section>
  );
}

function ProjectDetail() {
  useSA();
  useDotGrid();
  const isMobile = useIsMobile();

  const { slug } = useParams();
  const location = useLocation();
  useSARouteSync(location.pathname);

  const project = getProjectBySlug(slug);

  useProjectSEO({
    title: project?.seo?.title ?? "Work | Walter Carlson",
    description: project?.seo?.description,
  });

  if (!project) return <ProjectNotFound />;

  const { prev, next } = getAdjacentProjects(slug);
  const heroImage = project.heroimage;
  const image = project.image;

  return (
    <article itemScope itemType="https://schema.org/CreativeWork">
      {/* Project Hero — mirrors HeroSection features with project hero image */}
      <header
        className="section section__hero project-hero h-viewport relative section-padding overflow-hidden"
        style={{ "--project-accent": project.backgroundColor }}
        aria-label={`${project.title} overview`}
      >
        {heroImage && (
          <div className="project-hero__bg absolute" aria-hidden="true">
            <img src={heroImage} alt="" className="project-hero__bg-image" />
          </div>
        )}

        <div className="hero__content flex-all flex-vert-bottom h-full">
          <div className="hero__left project-hero__left flex-all flex-direction-column relative gap-row-1 mt-auto" sa="up glacial mirror">          

            <div className="project-hero__meta flex-all flex-vert-center flex-wrap gap-column-1">
              <span className="project-hero__tag">{project.tag}</span>
              <span className="project-hero__year">{project.year}</span>
            </div>
            <h1 className="project-hero__title" itemProp="name">{project.title}</h1>
            <p className="project-hero__overview" itemProp="description">{project.overview}</p>

            <dl className="project-hero__details">
              <div className="project-hero__detail">
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div className="project-hero__detail">
                <dt>Timeline</dt>
                <dd>{project.timeline}</dd>
              </div>
              <div className="project-hero__detail project-hero__detail--wide">
                <dt>Technologies</dt>
                <dd>
                  <ul className="project-hero__tech flex-all flex-wrap">
                    {project.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <Btn to="/work" primary className="magnetic magnetic--subtle" data-cursor="accent">
              All work
            </Btn>            
          </div>
        </div>

        <div className="section__decor absolute">
          {!isMobile && <DotGrid color="surface" pattern="scatter" size="small" cols={40} count={600} className="backdrop-dots" />}

          <div className="decor__shape dots--1 absolute" sa="float float-y float-y-loop delay-1000">
            <img src={handleDots} width="52" height="33" alt="" sa="up-long glacial delay-800" />
          </div>
          <div className="decor__shape dots--2 absolute" sa="float float-y float-y-loop delay-1200">
            <img src={handleDots} width="52" height="33" alt="" sa="down-long glacial delay-1000" />
          </div>
          <div className="decor__shape arrow-down-svg arrow-down--1 absolute" sa="float float-x float-x-loop delay-1400">
            <img src={arrowRight} width="54" height="16" alt="" sa="right-long glacial delay-1200" />
          </div>
          <div className="decor__shape arrow-down-svg arrow-down--2 absolute" sa="float float-y float-y-loop delay-1600">
            <img src={arrowDown} width="16" height="54" alt="" sa="down-long glacial delay-1400" />
          </div>
        </div>

        {/* Schema image (decorative slats media is aria-hidden) */}
        <meta itemProp="image" content={image} />

        <div className="section__mask absolute"></div>
      </header>

      {/* Summary */}
      <CaseStudyBlock label="project.summary" title="Overview" count="01">
        <div className="case-study__summary-grid gap-column-1 gap-row-1">
          <div className="case-study__summary-card relative section__grain --grain-medium">
            <h3 className="h5">Challenge</h3>
            <p>{project.summary.challenge}</p>
          </div>
          <div className="case-study__summary-card relative section__grain --grain-medium">
            <h3 className="h5">Goals</h3>
            <BulletList items={project.summary.goals} />
          </div>
          <div className="case-study__summary-card relative section__grain --grain-medium">
            <h3 className="h5">Objectives</h3>
            <BulletList items={project.summary.objectives} />
          </div>
        </div>
      </CaseStudyBlock>

      {/* Discovery */}
      <CaseStudyBlock label="project.discovery" title="Discovery & Strategy" count="02" saDelay={300}>
        <div className="case-study__prose">
          <h3 className="h5">Problem Space</h3>
          <p>{project.discovery.problem}</p>
          <h3 className="h5">Research</h3>
          <BulletList items={project.discovery.research} />
          <h3 className="h5">Planning</h3>
          <BulletList items={project.discovery.planning} />
        </div>
      </CaseStudyBlock>

      {/* Design */}
      <CaseStudyBlock label="project.design" title="Design Process" count="03" saDelay={400}>
        <div className="case-study__prose">
          <h3 className="h5">Wireframes</h3>
          <p>{project.design.wireframes}</p>
          <h3 className="h5">Exploration</h3>
          <p>{project.design.exploration}</p>
          <h3 className="h5">UI Decisions</h3>
          <BulletList items={project.design.decisions} />
          <h3 className="h5">Design System</h3>
          <p>{project.design.systems}</p>
        </div>
      </CaseStudyBlock>

      {/* Development */}
      <CaseStudyBlock label="project.development" title="Development Process" count="04" saDelay={500}>
        <div className="case-study__prose">
          <h3 className="h5">Architecture</h3>
          <p>{project.development.architecture}</p>
          <h3 className="h5">Technical Decisions</h3>
          <BulletList items={project.development.decisions} />
          <h3 className="h5">Performance</h3>
          <BulletList items={project.development.performance} />
          <h3 className="h5">Challenges Solved</h3>
          <BulletList items={project.development.challenges} />
        </div>
      </CaseStudyBlock>

      {/* Key Features */}
      <CaseStudyBlock label="project.features" title="Key Features" count="05" saDelay={600}>
        <div className="case-study__features gap-column-1 gap-row-1">
          {project.features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </CaseStudyBlock>

      {/* Results */}
      <CaseStudyBlock label="project.results" title="Results & Outcomes" count="06" saDelay={700}>
        <div className="case-study__results-grid gap-column-1 gap-row-1">
          <div className="case-study__result-card relative section__grain --grain-medium">
            <h3 className="h5">Achievements</h3>
            <BulletList items={project.results.achievements} />
          </div>
          <div className="case-study__result-card relative section__grain --grain-medium">
            <h3 className="h5">Improvements</h3>
            <BulletList items={project.results.improvements} />
          </div>
          <div className="case-study__result-card relative section__grain --grain-medium">
            <h3 className="h5">Lessons Learned</h3>
            <BulletList items={project.results.lessons} />
          </div>
        </div>
      </CaseStudyBlock>

      {/* Gallery — horizontal drag scroll + click-to-expand */}
      <CaseStudyBlock label="project.gallery" title="Project Gallery" count="07" saDelay={800}>
        <ProjectGallery items={project.gallery} />
      </CaseStudyBlock>

      {/* Technology Stack */}
      <CaseStudyBlock label="project.stack" title="Technology Stack" count="08" saDelay={900}>
        <div className="case-study__stack gap-column-1 gap-row-1">
          {project.stack.map((group, index) => (
            <div
              key={group.category}
              className="case-study__stack-group"
              sa={`up slow mirror delay-${(index + 1) * 100}`}
            >
              <h3 className="case-study__stack-label">{group.category}</h3>
              <ul className="case-study__stack-list flex-all flex-direction-column">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseStudyBlock>

      {/* Next Project */}
      <div className="project-detail__nav section-padding">
        <ProjectNav prev={prev} next={next} />
      </div>
    </article>
  );
}

export default ProjectDetail;