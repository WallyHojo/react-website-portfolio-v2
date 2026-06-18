import { useRef } from "react";

import { useMagneticSVG } from "../../../hooks/useMagneticSVG";
import "./Slats.css";

/**
 * SlatsSVG
 * @param {"video"|"image"} mediaType
 * @param {string}          mediaSrc    - video or image URL
 * @param {Array}           slats       - slat config array from slatsConfig.jsx
 * @param {object}          mediaProps  - x, y, width, height for the media element
 */
export default function SlatsSVG({
  className = "",
  mediaType = "image",
  mediaSrc,
  slats = [],
  mediaProps = { x: "0", y: "0", width: "145%", height: "200%" },
}) {
  const SLAT_COUNT = slats.length;

  const magSlatRefs = useRef(
    Array.from({ length: SLAT_COUNT }, () => ({ current: null }))
  );
  const slatRefs = useRef(
    Array.from({ length: SLAT_COUNT }, () => ({ current: null }))
  );

  useMagneticSVG(magSlatRefs.current, slatRefs.current, 10);

  const toRotate = ([deg, cx, cy]) => `rotate(${deg}, ${cx}, ${cy})`;

  return (
    <svg
      className={`decor__shape slats-svg${className ? ` ${className}` : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <mask
          id="slats-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          {slats.map((s, i) => (
            <g key={i} className="slat">
              <g transform={toRotate(s.rotate)}>
                <g
                  ref={(el) => (slatRefs.current[i].current = el)}
                  style={{ transform: "translate(var(--mag-x,0px),var(--mag-y,0px))" }}
                >
                  <rect
                    x={s.x} y={s.y}
                    width={s.width} height={s.height}
                    rx="70" ry="70"
                    fill="white"
                  />
                </g>
              </g>
            </g>
          ))}
        </mask>
      </defs>

      {/* ── Media ── */}
      {mediaType === "video" ? (
        <foreignObject mask="url(#slats-mask)" {...mediaProps} x="0">
          <video
            xmlns="http://www.w3.org/1999/xhtml"
            autoPlay muted playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        </foreignObject>
      ) : (
        <image
          href={mediaSrc}
          preserveAspectRatio="xMidYMid slice"
          mask="url(#slats-mask)"
          {...mediaProps}
        />
      )}

      {/* ── Magnetic hit zones ── */}
      {slats.map((s, i) => (
        <g key={i} transform={toRotate(s.rotate)}>
          <rect
            className="magnetic magnetic--strong"
            ref={(el) => (magSlatRefs.current[i].current = el)}
            x={s.x} y={s.y}
            width={s.width} height={s.height}
            rx="70" ry="70"
            fill="transparent"
            pointerEvents="all"
          />
        </g>
      ))}
    </svg>
  );
}