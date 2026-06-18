import "./SectionLabel.css";

export default function SectionLabel({
  labelSystem,    
  labelTitle,
  labelCount,
  progressBar,
  className = "",
}) {

    const forwardSlash = '//';
    const rootClass = ["section__label", "flex-all", "flex-direction-column", "relative", className]
      .filter(Boolean)
      .join(" ");

    const hasSystem = !!labelSystem;
    const hasTitle = !!labelTitle;
    const hasProgress = !!progressBar;

    return (
    <div className={rootClass} role="presentation">
        {/* When there's a system label (typical for section intros), system + count come first */}
        {hasSystem && (
          <span className="label__system" sa="right slower mirror delay-200">
            {forwardSlash} {labelSystem}
          </span>
        )}
        {hasSystem && labelCount && <span className="label__count absolute" sa="up-long slower mirror">{labelCount}</span>}

        {/* Title (h2) */}
        {hasTitle && (
          <h2 className="label__title" sa="right slower mirror delay-400">
            {labelTitle}
          </h2>
        )}

        {/* For simple "title + count badge" cases (no system), put count after title */}
        {!hasSystem && labelCount && <span className="label__count">{labelCount}</span>}

        {hasProgress && (
            <div className="work__progress relative ml-auto" aria-hidden="true">
                <div className="work__progress-fill absolute"></div>
            </div>
        )}        
    </div> 
    );
}