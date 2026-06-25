import React, { createContext, useContext, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageTransition } from "../../../hooks/usePageTransition";
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

export const TransitionLink = forwardRef(function TransitionLink(
  { to, onClick, replace, state, ...rest },
  ref
) {
  const { triggerTransition } = useTransition();
  const location = useLocation();

  const handleClick = (event) => {
    if (isModifiedClick(event)) return;

    onClick?.(event);
    if (event.defaultPrevented) return;

    const path = resolveToPath(to);
    if (path === location.pathname) return;

    event.preventDefault();
    triggerTransition(path);
  };

  return (
    <Link to={to} ref={ref} onClick={handleClick} replace={replace} state={state} {...rest} />
  );
});

export function PageTransitionProvider({ children }) {
  const { phase, triggerTransition } = usePageTransition();

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <div
        className={`page-transition-overlay ${phase !== "idle" ? `page-transition-overlay--${phase}` : ""} flex-all flex-horz-center flex-vert-center`}
        aria-hidden="true"
      >
        <svg
              xmlns="http://www.w3.org/2000/svg"
              className="logo-load"
              viewBox="-5 -10 335 233"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="logo-gradient" x1="20%" y1="0%" x2="80%" y2="100%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stopColor="#55585a" />
                  <stop offset="10%" stopColor="#3d74a6" />
                  <stop offset="25%" stopColor="#ff1493" />
                  <stop offset="45%" stopColor="#00ffff" />
                  <stop offset="65%" stopColor="#ff4500" />
                  <stop offset="85%" stopColor="#9400d3" />
                  <stop offset="100%" stopColor="#262e64" />
                </linearGradient>              

                <clipPath id="logo-clip">
                  <path d="M299.976.5c-9.319.135-15.93 6.549-15.93 6.549l-66.424 63.83-40.51-57.805s-12.484-18.969-33.952 1.763c-18.31 17.68-9.61 31.246-5.829 36.646l40.61 57.998-35.953 34.729L48.962 11.404S42.053 1.594 30.643.778c-5.186-.37-11.307 1.12-18.123 6.238-21.907 16.49-7.222 37.328-7.222 37.328s103.528 147.884 112.083 160c7.501 10.858 24.08 13.137 35.085 2.49l55.882-53.93 33.683 48.106s14.652 19.633 36.896-1.848c17.533-16.931 6.748-31.044 6.748-31.044l-37.55-53.626 71.562-69.166s17.027-16.394-.85-35.56C312.13 2.596 305.566.419 299.976.5" />
                </clipPath>

                <mask id="fill-mask">
                  <rect
                    x="-5" y="-10"
                    width="335" height="233"
                    fill="white"
                  />
                  <rect
                    className="fill-mask-load"
                    x="-5" y="-10"
                    width="335" height="233"
                    fill="black"
                  />
                </mask>                
              </defs>

              {/* Gradient fill — clipped to path shape, reveals on scroll */}
              <rect
                className="logo-fill"
                x="-5" y="-10"
                width="335" height="233"
                fill="url(#logo-gradient)"
                clipPath="url(#logo-clip)"
                mask="url(#fill-mask)"
              />

              {/* Stroke — animated draw on scroll 
              <path
                className="logo-path"
                fill="none"
                stroke="var(--color-text-primary)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M299.976.5c-9.319.135-15.93 6.549-15.93 6.549l-66.424 63.83-40.51-57.805s-12.484-18.969-33.952 1.763c-18.31 17.68-9.61 31.246-5.829 36.646l40.61 57.998-35.953 34.729L48.962 11.404S42.053 1.594 30.643.778c-5.186-.37-11.307 1.12-18.123 6.238-21.907 16.49-7.222 37.328-7.222 37.328s103.528 147.884 112.083 160c7.501 10.858 24.08 13.137 35.085 2.49l55.882-53.93 33.683 48.106s14.652 19.633 36.896-1.848c17.533-16.931 6.748-31.044 6.748-31.044l-37.55-53.626 71.562-69.166s17.027-16.394-.85-35.56C312.13 2.596 305.566.419 299.976.5"
              />
              */}
            </svg>
      </div>
    </TransitionContext.Provider>
  );
}
