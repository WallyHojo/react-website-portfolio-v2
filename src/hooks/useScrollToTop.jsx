import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Automatic scroll to top on route change
function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
}

export default useScrollToTop;