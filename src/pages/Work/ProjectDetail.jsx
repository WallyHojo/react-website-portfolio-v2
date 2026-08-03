import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import { TransitionLink } from "../../components/ui/PageTransition/PageTransition";

import { useSA, useSARouteSync } from "../../hooks/useScrollAnimate/useScrollAnimate.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.jsx";
import Btn from "../../components/ui/Buttons";
import { useDotGrid, DotGrid } from "../../hooks/useDotGrid";
import SectionLabel from "../../components/ui/SectionLabel";
import SideAnchorNavigation from "../../components/ui/SideAnchorNavigation";
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

/* -------------------------------------------------------------------------- */
/* Case study section helpers                                                 */
/* -------------------------------------------------------------------------- */

function CaseStudyBlock({ id, label, title, children, count, saDelay = 200 }) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className="section-padding project-detail__section"
      aria-labelledby={headingId}
    >
      <SectionLabel
        labelCount={count}
        labelSystem={label}
        labelTitle={title}
        titleId={headingId}
      />
      <div className="case-study__content" sa={`up-long glacial mirror delay-${saDelay}`}>
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;

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

/* -------------------------------------------------------------------------- */
/* Section registry — data-driven, skips missing content                      */
/* -------------------------------------------------------------------------- */

/**
 * Build ordered case-study sections from project data.
 * Each entry exposes nav metadata + a render function.
 * Missing / empty fields are omitted automatically.
 */
function buildCaseStudySections(project) {
  if (!project) return [];

  const defs = [
    {
      id: "overview",
      label: "Overview",
      title: "Overview",
      system: "project.summary",
      count: "02",
      saDelay: 200,
      available: () => Boolean(project.summary),
      render: () => (
        <div className="case-study__summary-grid gap-column-1 gap-row-1">
          {project.summary.challenge && (
            <div className="case-study__summary-card relative section__grain --grain-medium">
              <h3 className="h5">Challenge</h3>
              <p>{project.summary.challenge}</p>
            </div>
          )}
          {project.summary.goals?.length > 0 && (
            <div className="case-study__summary-card relative section__grain --grain-medium">
              <h3 className="h5">Goals</h3>
              <BulletList items={project.summary.goals} />
            </div>
          )}
          {project.summary.objectives?.length > 0 && (
            <div className="case-study__summary-card relative section__grain --grain-medium">
              <h3 className="h5">Objectives</h3>
              <BulletList items={project.summary.objectives} />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "discovery",
      label: "Discovery",
      title: "Discovery & Strategy",
      system: "project.discovery",
      count: "03",
      saDelay: 300,
      available: () => Boolean(project.discovery),
      render: () => (
        <div className="case-study__prose">
          {project.discovery.problem && (
            <>
              <h3 className="h5">Problem Space</h3>
              <p>{project.discovery.problem}</p>
            </>
          )}
          {project.discovery.research?.length > 0 && (
            <>
              <h3 className="h5">Research</h3>
              <BulletList items={project.discovery.research} />
            </>
          )}
          {project.discovery.planning?.length > 0 && (
            <>
              <h3 className="h5">Planning</h3>
              <BulletList items={project.discovery.planning} />
            </>
          )}
        </div>
      ),
    },
    {
      id: "design",
      label: "Design",
      title: "Design Process",
      system: "project.design",
      count: "04",
      saDelay: 400,
      available: () => Boolean(project.design),
      render: () => (
        <div className="case-study__prose">
          {project.design.wireframes && (
            <>
              <h3 className="h5">Wireframes</h3>
              <p>{project.design.wireframes}</p>
            </>
          )}
          {project.design.exploration && (
            <>
              <h3 className="h5">Exploration</h3>
              <p>{project.design.exploration}</p>
            </>
          )}
          {project.design.decisions?.length > 0 && (
            <>
              <h3 className="h5">UI Decisions</h3>
              <BulletList items={project.design.decisions} />
            </>
          )}
          {project.design.systems && (
            <>
              <h3 className="h5">Design System</h3>
              <p>{project.design.systems}</p>
            </>
          )}
        </div>
      ),
    },
    {
      id: "development",
      label: "Development",
      title: "Development Process",
      system: "project.development",
      count: "05",
      saDelay: 500,
      available: () => Boolean(project.development),
      render: () => (
        <div className="case-study__prose">
          {project.development.architecture && (
            <>
              <h3 className="h5">Architecture</h3>
              <p>{project.development.architecture}</p>
            </>
          )}
          {project.development.decisions?.length > 0 && (
            <>
              <h3 className="h5">Technical Decisions</h3>
              <BulletList items={project.development.decisions} />
            </>
          )}
          {project.development.performance?.length > 0 && (
            <>
              <h3 className="h5">Performance</h3>
              <BulletList items={project.development.performance} />
            </>
          )}
          {project.development.challenges?.length > 0 && (
            <>
              <h3 className="h5">Challenges Solved</h3>
              <BulletList items={project.development.challenges} />
            </>
          )}
        </div>
      ),
    },
    {
      id: "features",
      label: "Features",
      title: "Key Features",
      system: "project.features",
      count: "06",
      saDelay: 600,
      available: () => project.features?.length > 0,
      render: () => (
        <div className="case-study__features gap-column-1 gap-row-1">
          {project.features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      ),
    },
    {
      id: "results",
      label: "Results",
      title: "Results & Outcomes",
      system: "project.results",
      count: "07",
      saDelay: 700,
      available: () => Boolean(project.results),
      render: () => (
        <div className="case-study__results-grid gap-column-1 gap-row-1">
          {project.results.achievements?.length > 0 && (
            <div className="case-study__result-card relative section__grain --grain-medium">
              <h3 className="h5">Achievements</h3>
              <BulletList items={project.results.achievements} />
            </div>
          )}
          {project.results.improvements?.length > 0 && (
            <div className="case-study__result-card relative section__grain --grain-medium">
              <h3 className="h5">Improvements</h3>
              <BulletList items={project.results.improvements} />
            </div>
          )}
          {project.results.lessons?.length > 0 && (
            <div className="case-study__result-card relative section__grain --grain-medium">
              <h3 className="h5">Lessons Learned</h3>
              <BulletList items={project.results.lessons} />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "gallery",
      label: "Gallery",
      title: "Project Gallery",
      system: "project.gallery",
      count: "08",
      saDelay: 800,
      available: () => project.gallery?.length > 0,
      render: () => <ProjectGallery items={project.gallery} />,
    },
    {
      id: "technologies",
      label: "Technologies",
      title: "Technology Stack",
      system: "project.stack",
      count: "09",
      saDelay: 900,
      available: () => project.stack?.length > 0,
      render: () => (
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
      ),
    },
  ];

  return defs.filter((def) => def.available());
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

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

  const sections = useMemo(() => buildCaseStudySections(project), [project]);

  const navItems = useMemo(
    () =>
      sections.map(({ id, label, title }) => ({
        id,
        label,
        title,
      })),
    [sections]
  );

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

      {/* Case study body: sticky side nav (desktop) / pills (mobile) + sections */}
      {sections.length > 0 && (
        <div className="section-padding project-detail__body">
          <aside className="project-detail__aside" aria-label="Case study navigation">
            <div className="project-detail__aside-inner">
              <SideAnchorNavigation
                sections={navItems}
                ariaLabel={`${project.title} sections`}
              />
            </div>
          </aside>

          <div className="project-detail__content">
            {sections.map((section) => (
              <CaseStudyBlock
                key={section.id}
                id={section.id}
                label={section.system}
                title={section.title}
                count={section.count}
                saDelay={section.saDelay}
              >
                {section.render()}
              </CaseStudyBlock>
            ))}
          </div>
        </div>
      )}

      {/* Next Project */}
      <div className="project-detail__nav section-padding">
        <ProjectNav prev={prev} next={next} />
      </div>
    </article>
  );
}

export default ProjectDetail;
