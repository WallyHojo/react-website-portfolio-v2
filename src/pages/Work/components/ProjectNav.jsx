import React from "react";

import { TransitionLink } from "../../../components/ui/PageTransition/PageTransition";

function NavLink({ direction, project }) {
  if (!project) return <div className="project-nav__placeholder" aria-hidden="true" />;

  const label = direction === "prev" ? "Previous project" : "Next project";

  return (
    <TransitionLink
      to={`/work/${project.slug}`}
      className={`project-nav__link project-nav__link--${direction} flex-all flex-direction-column`}
      data-cursor="accent"
    >
      <span className="project-nav__direction">{label}</span>
      <span className="project-nav__title">{project.shortTitle}</span>
      <span className="project-nav__tag">{project.tag}</span>
    </TransitionLink>
  );
}

export default function ProjectNav({ prev, next }) {
  return (
    <nav className="project-nav" aria-label="Project navigation">
      <NavLink direction="prev" project={prev} />
      <TransitionLink to="/work" className="project-nav__hub" data-cursor="light">
        All work
      </TransitionLink>
      <NavLink direction="next" project={next} />
    </nav>
  );
}