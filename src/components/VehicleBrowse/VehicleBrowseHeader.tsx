import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface VehicleBrowseHeaderProps {
  title?: string;
  subtitle?: string;
  carImages?: string[];
}

const VehicleBrowseHeader: React.FC<VehicleBrowseHeaderProps> = ({
  title = "WHICH CAR DO YOU WANT TO DRIVE?",
  subtitle = "Two or Four Wheels, Discover Singapore, Your Way!",
  carImages = [
    "/assets/cars/vw-golf.png",
    "/assets/cars/bmw-440i.png",
    "/assets/cars/bmw-5t.png",
    "/assets/cars/maserati-grecale.png",
    "/assets/cars/vw-polo.png",
    "/assets/cars/porsche-911-c.png",
    "/assets/cars/merc-sl63.png",
    "/assets/cars/bmw-z4.png",
    "/assets/cars/mini-cooper.png",
    "/assets/cars/bmw-x3.png",
    "/assets/cars/skoda-octavia.png",
    "/assets/cars/nissan-sentra.png",
  ],
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GSAP Marquee Animation - Smooth infinite scroll
      if (marqueeRef.current) {
        const marqueeTrack = marqueeRef.current;

        // Get the width of the content (half because we duplicate)
        const trackWidth = marqueeTrack.scrollWidth / 2;

        // Animate the marquee - LEFT TO RIGHT (positive x)
        gsap.fromTo(
          marqueeTrack,
          { x: -trackWidth },
          {
            x: 0,
            duration: 120, // Slower - doubled from 30 to 60 seconds
            ease: "none",
            repeat: -1,
          },
        );
      }

      // Text entrance animations
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.2,
        })
        .from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5",
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Add hover effect to pause/slow down marquee
    const marqueeTrack = marqueeRef.current;
    if (!marqueeTrack) return;

    const handleMouseEnter = () => {
      gsap.to(marqueeTrack, {
        timeScale: 0.3, // Slow down to 30% speed
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(marqueeTrack, {
        timeScale: 1, // Back to normal speed
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const container = marqueeTrack.parentElement;
    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return (
    <div className="relative mb-6 min-h-[180px] overflow-hidden rounded-xl sm:mb-8 sm:min-h-[220px] md:mb-12 md:min-h-[280px] md:rounded-2xl">
      {/* Text Background Layer - Behind Cars */}
      <div className="absolute inset-0 z-0 flex items-center justify-center px-4 text-center sm:px-6">
        <div className="max-w-6xl">
          <h1
            ref={titleRef}
            className="mb-2 font-bold text-gray-800 sm:mb-3 md:mb-4"
            style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)" }}
          >
            {title}
          </h1>
          <p
            ref={subtitleRef}
            className="text-gray-600"
            style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.75rem)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Car Carousel - In Front of Text */}
      <div className="relative z-10 flex h-full min-h-[180px] items-center sm:min-h-[220px] md:min-h-[280px]">
        <div className="h-24 w-full overflow-hidden sm:h-20 md:h-24 lg:h-56">
          <div
            ref={marqueeRef}
            className="flex h-full items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12"
            style={{ willChange: "transform" }}
          >
            {/* Duplicate images for seamless loop */}
            {[...carImages, ...carImages].map((img, idx) => (
              <div key={idx} className="h-full flex-shrink-0">
                <img
                  src={img}
                  alt=""
                  className="h-full w-auto object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleBrowseHeader;
