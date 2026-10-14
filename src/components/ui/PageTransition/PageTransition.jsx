import React, { createContext, useContext, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTransition, TRANSITION_DURATION } from "../../../hooks/usePageTransition";
import "./PageTransition.css";

// Context so any component can call triggerTransition(to) instead of navigate(to)
export const TransitionContext = createContext({ triggerTransition: () => {} });

export function useTransition() {
  return useContext(TransitionContext);
}

function resolveToPath(to) {
  if (typeof to === "string") {
    return to.split("?")[0].split("#")[0] || "/";
  }
  return to.pathname || "/";
}

function isModifiedClick(event) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

const isExternal = (to) => typeof to === "string" && /^([a-z][a-z\d+.-]*:|\/\/)/i.test(to);

export const TransitionLink = forwardRef(function TransitionLink(
  { to, onClick, replace, state, children, ...rest },
  ref
) {
  const { triggerTransition } = useTransition();
  const location = useLocation();

  // External URLs and new-tab links are plain anchors — the router would
  // otherwise resolve "https://…" as a relative path (/https:/…).
  if (isExternal(to)) {
    return (
      <a href={to} ref={ref} onClick={onClick} rel={rest.target === "_blank" ? "noopener noreferrer" : undefined} {...rest}>
        {children}
      </a>
    );
  }

  const handleClick = (event) => {
    if (isModifiedClick(event) || rest.target === "_blank") return;

    onClick?.(event);
    if (event.defaultPrevented) return;

    const path = resolveToPath(to);
    if (path === location.pathname) return;

    event.preventDefault();
    triggerTransition(path);
  };

  return (
    <Link to={to} ref={ref} onClick={handleClick} replace={replace} state={state} {...rest}>
      {children}
    </Link>
  );
});

export function PageTransitionProvider({ children }) {
  const { phase, triggerTransition } = usePageTransition();

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <div
        className={`page-transition-overlay ${phase !== "idle" ? `page-transition-overlay--${phase}` : ""} flex-all flex-horz-center flex-vert-center`}
        style={{ "--page-transition-duration": `${TRANSITION_DURATION}ms` }}
        aria-hidden="true"
      />
    </TransitionContext.Provider>
  );
}
