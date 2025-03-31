
import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    checkIsMobile();

    // Re-check on resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
