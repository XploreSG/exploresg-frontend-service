import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UsePageAnimationsOptions {
  heroRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentSelector?: string;
  staggerDelay?: number;
}

export const usePageAnimations = ({
  heroRef,
  contentRef,
  contentSelector = "section",
  staggerDelay = 0.1
}: UsePageAnimationsOptions) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section entrance
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
      });

      // Scroll-triggered animations for content sections
      gsap.from(contentRef.current?.querySelectorAll(contentSelector) || [], {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        stagger: staggerDelay,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [heroRef, contentRef, contentSelector, staggerDelay]);
};