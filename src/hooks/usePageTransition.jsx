import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { requestCursorReset } from "./useMagneticEffect/cursorReset";

const TRANSITION_DURATION = 400; // ms — match CSS

/**
 * usePageTransition
 * 
 * Returns { phase, triggerTransition }
 * 
 * phase: "idle" | "out" | "in"
 *   - "out" → overlay animates in (covering the page)
 *   - "in"  → overlay animates out (revealing the new page)
 * 
 * triggerTransition(to) — call instead of navigate(to).
 * Plays the out animation, navigates, then plays the in animation.
 */
export function usePageTransition() {
  const [phase, setPhase] = useState("idle");
  const navigate  = useNavigate();
  const location  = useLocation();
  const pendingTo = useRef(null);

  const triggerTransition = useCallback((to) => {
    // Don't transition to the same page
    if (to === location.pathname) return;

    requestCursorReset();
    pendingTo.current = to;
    setPhase("out");
  }, [location.pathname]);

  useEffect(() => {
    if (phase === "out") {
      const timer = setTimeout(() => {
        navigate(pendingTo.current);
        setPhase("in");
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }

    if (phase === "in") {
      const timer = setTimeout(() => {
        setPhase("idle");
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [phase, navigate]);

  return { phase, triggerTransition };
}
