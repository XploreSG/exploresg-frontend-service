import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Clients/Partners Section Component
const ClientsSection: React.FC = () => {
  const partners = [
    {
      name: "Singapore Tourism Board",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Singapore_Tourism_Board_Logo.svg/1200px-Singapore_Tourism_Board_Logo.svg.png",
    },
    {
      name: "Changi Airport",
      imageUrl:
        "https://logos-world.net/wp-content/uploads/2023/02/Singapore-Changi-Airport-Logo.png",
    },
    {
      name: "Gardens by the Bay",
      imageUrl:
        "https://www.gardensbythebay.com.sg/content/dam/gbb-2021/logo/gbb-logo-2021.png",
    },
    {
      name: "Marina Bay Sands",
      imageUrl:
        "https://logos-world.net/wp-content/uploads/2022/04/Marina-Bay-Sands-Logo.png",
    },
    {
      name: "Sentosa",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Sentosa_logo.svg/1200px-Sentosa_logo.svg.png",
    },
  ];

  return (
    <div className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Title */}
      <div className="mx-auto mb-12 w-full text-center lg:w-2/3">
        <h2 className="text-gray-600">
          Trusted by Singapore's leading tourism and hospitality organizations
        </h2>
      </div>
      {/* End Title */}

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 lg:gap-x-16">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="flex items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100"
          >
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="h-12 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0 sm:h-16 lg:h-20"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = "none";
                const textFallback = document.createElement("span");
                textFallback.className = "text-lg font-semibold text-gray-600";
                textFallback.textContent = partner.name;
                e.currentTarget.parentElement?.appendChild(textFallback);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

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

      // Scroll-triggered animations
      gsap.from(missionRef.current, {
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(teamRef.current?.querySelectorAll(".team-member") || [], {
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    });

    return () => ctx.revert();
  }, []);

  const team = [
    {
      name: "Sree",
      role: "Chief Cartographer",
      image: "/assets/team/sree.png",
    },
    {
      name: "Suhaas",
      role: "Signal Scout",
      image: "/assets/team/suhaas.png",
    },
    {
      name: "Shirley",
      role: "Forge Master",
      image: "/assets/team/shirley.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
          <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - Text content */}
            <div className="flex flex-col justify-center">
              <h1
                className="mb-6 leading-tight font-bold text-gray-900"
                style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
              >
                We're changing the way people connect
              </h1>
              <p
                className="text-gray-600"
                style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
              >
                ExploreSG is your gateway to discovering Singapore's hidden
                gems, cultural treasures, and unforgettable experiences. We
                connect travelers with authentic local insights and curated
                adventures, making every visit to the Lion City truly memorable.
                From iconic landmarks to secret spots, we help you explore
                Singapore your way.
              </p>
            </div>

            {/* Right column - Image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&h=300&q=80"
                    alt="Singapore Marina Bay"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=400&h=500&q=80"
                    alt="Singapore Gardens"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=400&h=500&q=80"
                    alt="Singapore Culture"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600468636011-c75ae69b7fcb?auto=format&fit=crop&w=400&h=300&q=80"
                    alt="Singapore Food"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-6 font-bold text-gray-900"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            Our mission
          </h2>
          <p
            className="mb-8 text-gray-700"
            style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
          >
            At ExploreSG, we believe every journey should be extraordinary. Our
            mission is to empower travelers with authentic insights, local
            expertise, and seamless experiences that showcase the best of
            Singapore's diverse culture, cuisine, and attractions.
          </p>
          <p
            className="text-gray-600"
            style={{ fontSize: "clamp(0.875rem, 1.8vw, 1rem)" }}
          >
            Whether you're a first-time visitor or a seasoned explorer, we're
            here to help you discover the Lion City's magic through carefully
            curated content, trusted partnerships, and innovative technology
            that makes planning your Singapore adventure effortless and
            exciting.
          </p>
        </div>
      </section>

      {/* Clients Section */}
      <ClientsSection />

      {/* Team Section */}
      <section id="our-team" ref={teamRef} className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-4 font-bold text-gray-900"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
            >
              Our team
            </h2>
            <p className="text-gray-600">
              We're a dynamic group of individuals passionate about showcasing
              Singapore
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div key={index} className="team-member text-center">
                <div className="mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-gray-200"
                  />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
