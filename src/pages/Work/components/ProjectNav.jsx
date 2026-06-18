import React from "react";
import { Link } from "react-router-dom";

function NavLink({ direction, project }) {
  if (!project) return <div className="project-nav__placeholder" aria-hidden="true" />;

  const label = direction === "prev" ? "Previous project" : "Next project";

  return (
    <Link
      to={`/work/${project.slug}`}
      className={`project-nav__link project-nav__link--${direction}`}
      data-cursor="accent"
    >
      <span className="project-nav__direction">{label}</span>
      <span className="project-nav__title">{project.shortTitle}</span>
      <span className="project-nav__tag">{project.tag}</span>
    </Link>
  );
}

export default function ProjectNav({ prev, next }) {
  return (
    <nav className="project-nav" aria-label="Project navigation">
      <NavLink direction="prev" project={prev} />
      <Link to="/work" className="project-nav__hub" data-cursor="light">
        All work
      </Link>
      <NavLink direction="next" project={next} />
    </nav>
  );
}