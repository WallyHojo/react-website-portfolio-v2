import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  // Read the real value on first render so mobile never mounts desktop-only
  // UI (e.g. the 600-dot DotGrid) just to tear it down a frame later.
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const update = () => {
      setIsMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return isMobile;
}