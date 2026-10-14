import React, { useMemo, useState } from "react";

import { TransitionLink } from "../../../components/ui/PageTransition/PageTransition";
import Btn, { ArrowUpRight } from "../../../components/ui/Buttons";

import { PROJECT_CATEGORIES, getProjectsByCategory } from "../../../config/projects.jsx";

export default function ProjectCollection({ projects }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () => getProjectsByCategory(activeCategory),
    [activeCategory]
  );

  return (
    <div className="project-collection">
      <div
        className="project-collection__filters flex-all flex-wrap"
        role="group"
        aria-label="Filter projects by category"
      >
        {PROJECT_CATEGORIES.map((category) => {
          const isActive = category === activeCategory;
          return (
            <Btn
              plain
              key={category}
              type="button"
              aria-pressed={isActive}
              className={`btn project-collection__filter${isActive ? " is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Btn>
          );
        })}
      </div>

      <ol className="project-collection__list">
        {filtered.map((project, index) => (
          <li key={project.slug} sa={`up slow mirror delay-${(index + 1) * 100}`}>
            <TransitionLink
              to={`/work/${project.slug}`}
              className="project-collection__entry"
            >
              <span className="project-collection__entry-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-collection__entry-main flex-all flex-direction-column">
                <span className="project-collection__entry-title">{project.title}</span>
                <span className="project-collection__entry-desc">{project.overview}</span>
              </span>
              <span className="project-collection__entry-meta flex-all flex-direction-column flex-vert-bottom">
                <span className="project-collection__entry-tag">{project.tag}</span>
                <span className="project-collection__entry-year">{project.year}</span>
              </span>
              <span className="project-collection__entry-arrow flex-all flex-vert-center" aria-hidden="true">
                <ArrowUpRight fill="currentColor" />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ol>

      <p className="project-collection__count text-muted" aria-live="polite">
        Showing {filtered.length} of {projects.length} projects
      </p>
    </div>
  );
}