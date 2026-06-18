import { useRef, useEffect } from "react";

import { useMagneticSVG } from "../../../hooks/useMagneticSVG";
import "./Name.css";

/**
 * NameSVG
 * Renders "Walter Carlson" with staggered character animations and magnetic effects
 * @param {string} [className] - Additional CSS classes
 */
export default function NameSVG({ className = "" }) {
  const svgRef = useRef(null);

  const magCharRefs = useRef(
    Array.from({ length: 9 }, () => ({ current: null }))
  );
  const charRefs = useRef(
    Array.from({ length: 9 }, () => ({ current: null }))
  );

  useMagneticSVG(magCharRefs.current, charRefs.current, 5);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        } else {
          el.classList.remove("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox="22 60 480 83"
      xmlns="http://www.w3.org/2000/svg"
      className={`footer-name-svg${className ? ` ${className}` : ""}`}
      aria-label="Walter Carlson"
      ref={svgRef}
    >
      <defs>
        <clipPath id="clip-W">
          <rect x="22" y="60" width="105" height="90" />
        </clipPath>
        <clipPath id="clip-a1">
          <rect x="120" y="60" width="55" height="90" />
        </clipPath>
        <clipPath id="clip-l">
          <rect x="178" y="60" width="18" height="90" />
        </clipPath>
        <clipPath id="clip-t">
          <rect x="193" y="60" width="45" height="90" />
        </clipPath>
        <clipPath id="clip-e">
          <rect x="230" y="60" width="60" height="90" />
        </clipPath>
        <clipPath id="clip-r1">
          <rect x="290" y="60" width="45" height="90" />
        </clipPath>
        <clipPath id="clip-C">
          <rect x="350" y="60" width="80" height="90" />
        </clipPath>
        <clipPath id="clip-a2">
          <rect x="424" y="60" width="55" height="90" />
        </clipPath>
        <clipPath id="clip-r2">
          <rect x="480" y="60" width="50" height="90" />
        </clipPath>
      </defs>

      <g>
        {/* W */}
        {/*
          KEY FIX: magnetic transform <g> is the OUTERMOST wrapper.
          clipPath <g> sits INSIDE it, so the clip travels with the
          character when useMagneticSVG applies --mag-x / --mag-y.
          The magnetic <rect> lives outside both so it is never clipped.
        */}
        <g
          ref={(el) => (charRefs.current[0].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-W)">
            <path
              className="footer__char"
              d="m64.917 62.735-15.332 57.828-15.051-57.818H22.219l21.522 78.779 11.69-.001 15.727-56.775V62.735zm6.242 0 .001 22.013 15.727 56.775h11.69l21.522-78.778h-12.315l-15.051 57.818L77.4 62.735Z"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[0].current = el)}
          x="22" y="60" width="105" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* a (first) */}
        <g
          ref={(el) => (charRefs.current[1].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-a1)">
            <path
              className="footer__char"
              d="M147.471 80.935c-22.159 0-25.169 15.692-25.169 15.692l10.998 4.052s2.718-8.901 14.205-8.901c9.922 0 10.076 8.092 10.076 9.508 0 2.087-1.716 2.633-2.585 2.811-10.3 2.115-33.95.09-33.95 19.598 0 12.96 9.93 18.997 21.11 18.95 10.384-.043 15.424-6.013 15.424-6.013v4.887h11.87l.001-40.93c0-2.266-.516-19.654-21.98-19.654m10.109 32.94v6.11c0 1.754-2.593 11.684-14.275 11.644-10.302-.035-10.316-7.243-10.316-7.243-.013-7.414 9.68-7.794 15.566-8.52 1.465-.18 6.28-.817 9.025-1.992"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[1].current = el)}
          x="120" y="60" width="55" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* l */}
        <g
          ref={(el) => (charRefs.current[2].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-l)">
            <rect
              className="footer__char"
              width="11.939" height="78.787" x="178.99" y="62.736"
              rx="9.252" ry="0"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[2].current = el)}
          x="178" y="60" width="18" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* t */}
        <g
          ref={(el) => (charRefs.current[3].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-t)">
            <path
              className="footer__char"
              d="m229.61 140.523-2.35-10.646s-1.868.81-5.175.81c-3.308 0-5.788-1.471-5.788-5.34V92.124h12.121v-10.45l-12.121-.001V68.065h-11.89v13.609h-8.549v10.452l8.55-.001-.003 35.465c0 1.195 2.764 14.629 16.985 14.525 4.792-.035 8.22-1.592 8.22-1.592z"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[3].current = el)}
          x="193" y="60" width="45" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* e */}
        <g
          ref={(el) => (charRefs.current[4].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-e)">
            <path
              className="footer__char"
              d="M259.688 80.935c-25.257 0-27.253 26.234-27.253 30.732s1.684 30.86 28.079 30.86c21.386 0 24.567-16.967 24.567-16.967l-11.413-3.272s-.982 9.242-13.153 9.242c-12.17 0-15.887-9.651-15.887-15.406l40.974.001-.006-8.555s-.65-26.635-25.908-26.635zm-.001 11.113c13.283 0 13.982 13.255 13.982 13.255H244.63s1.773-13.255 15.056-13.255"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[4].current = el)}
          x="230" y="60" width="60" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* r (first) */}
        <g
          ref={(el) => (charRefs.current[5].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-r1)">
            <path
              className="footer__char"
              d="M304.421 141.516v-38.378c0-4.14 3.931-10.814 13.108-10.814 2.806 0 5.345 1.57 5.345 1.57l4.085-9.988s-2.344-3.182-8.962-3.182-11.506 3.321-13.891 6.08v-5.18h-11.577v59.892z"
              fill="var(--color-bg-surface)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[5].current = el)}
          x="290" y="60" width="45" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* C */}
        <g
          ref={(el) => (charRefs.current[6].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-C)">
            <path
              className="footer__char"
              d="M420.69 114.625h-12.355c0 1.124-2.979 16.225-19.828 16.093-12.7-.1-22.87-9.316-22.87-28.63 0-19.315 10.1-28.557 22.87-28.557 12.768 0 19.829 10.137 19.829 16.057l11.952-.001c0-11.927-12.138-27.988-31.782-27.988s-35.055 15.605-35.055 40.487 15.146 40.426 35.056 40.426c24.54 0 32.183-21.053 32.183-27.887"
              fill="var(--color-bg-subtle)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[6].current = el)}
          x="350" y="60" width="80" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* a (second) */}
        <g
          ref={(el) => (charRefs.current[7].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-a2)">
            <path
              className="footer__char"
              d="M451.213 80.935c-22.159 0-25.17 15.692-25.17 15.692l10.999 4.052s2.718-8.901 14.205-8.901c9.922 0 10.076 8.092 10.076 9.508 0 2.087-1.716 2.633-2.585 2.811-10.3 2.115-33.95.09-33.95 19.598 0 12.96 9.93 18.997 21.11 18.95 10.384-.043 15.424-6.013 15.424-6.013v4.887h11.869l.002-40.93c0-2.266-.516-19.654-21.98-19.654m10.109 32.94v6.11c0 1.754-2.593 11.684-14.275 11.644-10.302-.035-10.316-7.243-10.316-7.243-.013-7.414 9.68-7.794 15.566-8.52 1.465-.18 6.28-.817 9.025-1.992"
              fill="var(--color-bg-subtle)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[7].current = el)}
          x="424" y="60" width="55" height="90"
          fill="transparent"
          pointerEvents="all"
        />

        {/* r (second) */}
        <g
          ref={(el) => (charRefs.current[8].current = el)}
          style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
        >
          <g clipPath="url(#clip-r2)">
            <path
              className="footer__char"
              d="M508.497 80.724q-.257 0-.51.007h1.029q-.255-.007-.519-.007m-25.468.9v59.892h11.892v-38.378c0-3.15 2.275-7.764 7.402-9.793V81.742c-3.505 1.197-6.151 3.25-7.718 5.063v-5.18zm34.426 2.276v.016l.004-.01z"
              fill="var(--color-bg-subtle)"
            />
          </g>
        </g>
        <rect
          className="magnetic magnetic--subtle"
          ref={(el) => (magCharRefs.current[8].current = el)}
          x="480" y="60" width="50" height="90"
          fill="transparent"
          pointerEvents="all"
        />
      </g>
    </svg>
  );
}