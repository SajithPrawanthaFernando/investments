import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// 1. Register ScrollTrigger with GSAP core
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Optional: Global configuration for smooth rendering
  gsap.config({
    nullTargetWarn: false, // Suppresses warnings if a target isn't found immediately on render
  });

  // Tailored default configurations for ScrollTrigger
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load", // Refresh triggers safely
  });
}

/**
 * Custom hook to refresh ScrollTrigger instances.
 * Essential for Next.js dynamic routing when page heights change.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    // Refresh ScrollTrigger instances after a slight delay to ensure the DOM is fully painted
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}

// Export everything together so components can import from a single file
export { gsap, ScrollTrigger, useGSAP };
