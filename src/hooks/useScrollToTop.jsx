import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollTo } from "./lenisController";

// Automatic scroll to top on route change. Goes through Lenis (force: works even
// if an overlay stopped it) so its internal target can't drag the page back.
function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollTo(0, { immediate: true, force: true });
  }, [pathname]);
}

export default useScrollToTop;
