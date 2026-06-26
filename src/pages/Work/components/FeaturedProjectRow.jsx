import React from "react";
import Btn from "../../../components/ui/Buttons";

export default function FeaturedProjectRow({
  index,
  title,
  shortTitle,
  tag,
  year,
  overview,
  image,
  slug,
  backgroundColor,
  reversed = false,
}) {
  const formattedIndex = String(index).padStart(2, "0");

  return (
    <article
      className={`featured-project${reversed ? " featured-project--reversed" : ""} flex-vert-center`}
      aria-label={`Featured project: ${title}`}
    >
      <div className="featured-project__content flex-all flex-direction-column flex-vert-top relative" sa="up-long glacial mirror">
        <span className="featured-project__index absolute" aria-hidden="true">
          {formattedIndex}
        </span>
        <div className="featured-project__meta flex-all flex-vert-center flex-wrap gap-column-1">
          <span className="featured-project__tag">{tag}</span>
          <span className="featured-project__year">{year}</span>
        </div>
        <h3 className="featured-project__title h2">{shortTitle}</h3>
        <p className="featured-project__overview">{overview}</p>
        <Btn
          to={`/work/${slug}`}
          primary
          className="magnetic magnetic--subtle"
          data-cursor="accent"
        >
          View case study
        </Btn>
      </div>

      <div className="featured-project__visual relative overflow-hidden" sa="left-long glacial mirror">
        <div
          className="featured-project__visual-bg absolute"
          style={{ "--project-accent": backgroundColor }}
          aria-hidden="true"
        />
        <div className="featured-project__image-wrap relative overflow-hidden">
          <img src={image} alt={`${title} preview`} loading="lazy" />
        </div>
      </div>
    </article>
  );
}