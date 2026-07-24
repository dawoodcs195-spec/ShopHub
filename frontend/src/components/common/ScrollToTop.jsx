import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Keep it instant (luxury = calm, no jarring jumps)
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;