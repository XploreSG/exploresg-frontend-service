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
    "/assets/cars/bmw-440i.png",
    "/assets/cars/maserati-grecale.png",
    "/assets/cars/porsche-911-c.png",
    "/assets/cars/merc-sl63.png",
    "/assets/cars/bmw-z4.png",
    "/assets/cars/mini-cooper.png",
    "/assets/cars/peugeot-5008.png",
    "/assets/cars/bmw-x3.png",
    "/assets/cars/vw-golf.png",
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
    <div className="relative mb-6 min-h-[250px] overflow-hidden rounded-xl sm:mb-8 sm:min-h-[300px] md:mb-12 md:min-h-[400px] md:rounded-2xl">
      {/* Car Carousel Background with GSAP */}
      <div className="absolute inset-0 opacity-90">
        <div className="h-full overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex h-full items-center"
            style={{ willChange: "transform" }}
          >
            {/* Duplicate images for seamless loop */}
            {[...carImages, ...carImages].map((img, idx) => (
              <div
                key={idx}
                className="h-20 flex-shrink-0 sm:h-28 md:h-36 lg:h-40"
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-contain px-3 transition-transform duration-300 hover:scale-110 sm:px-4 md:px-6"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay for text readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" /> */}

      {/* Content with GSAP entrance animations */}
      <div className="relative z-10 flex h-full min-h-[250px] items-center justify-center px-4 text-center sm:min-h-[300px] sm:px-6 md:min-h-[400px]">
        <div className="max-w-4xl">
          <h1
            ref={titleRef}
            className="mt-60 mb-3 font-bold text-gray-900 sm:mt-40 sm:mb-4 md:mt-60"
            style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)" }}
          >
            {title}
          </h1>
          <p
            ref={subtitleRef}
            className="text-gray-700"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleBrowseHeader;
