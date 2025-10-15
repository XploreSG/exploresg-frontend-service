import React from "react";
import StatsSection from "../components/StatsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FeaturesSection from "../components/FeaturesSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with background image and overlay */}
      <div className="relative mb-8 flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24 sm:px-6 md:px-8">
        {/* Background image */}
        <img
          src="/assets/exploresg-backdrop-garden.jpg"
          alt="Singapore Jewel Backdrop"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          // style={{ filter: "brightness(0.7) blur(0.5px)" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-3xl rounded-xl bg-white/40 p-6 drop-shadow-2xl backdrop-blur-sm sm:rounded-2xl sm:p-8 md:p-10">
          {/* Announcement bar */}
          <div className="mb-4 flex items-center justify-center sm:mb-6">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[clamp(0.625rem,2vw,0.75rem)] font-medium text-gray-700 sm:px-4">
              Discover Singapore, Your Way!
            </span>
          </div>
          {/* Headline */}
          <h1
            className="mb-4 text-center font-extrabold text-gray-100 drop-shadow-lg sm:mb-6"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
              lineHeight: "1.2",
            }}
          >
            Explore Singapore
            <span className="mt-2 block text-[clamp(1rem,2.5vw,1.5rem)] sm:mt-4">
              {" "}
              with{" "}
              <span className="text-[clamp(1.5rem,4vw,2.5rem)]">ExploreSG</span>
            </span>
          </h1>
          {/* Subheadline */}
          <p
            className="mx-auto mb-6 max-w-2xl text-center text-gray-200 sm:mb-8"
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
              lineHeight: "1.6",
            }}
          >
            Welcome to ExploreSG, your platform to discover the best of
            Singapore. Dive into world-class attractions, vibrant local events,
            and hidden gems. Whether you're a local or a visitor, find new
            adventures, food, and experiences that make Singapore truly special.
          </p>
          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-center gap-3 sm:mb-12 sm:flex-row sm:justify-center sm:gap-4">
            <button
              className="w-full rounded-md bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-auto sm:px-8 sm:py-3"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
            >
              Start Exploring
            </button>
            <button
              className="w-full rounded-md bg-white px-6 py-2.5 font-semibold text-indigo-700 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:w-auto sm:px-8 sm:py-3"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
            >
              Learn more <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features / Product Highlights */}
      <FeaturesSection />
      {/* Stats Section */}
      <StatsSection />
      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
