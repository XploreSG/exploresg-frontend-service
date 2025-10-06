import React from "react";
import StatsSection from "../components/StatsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FeaturesSection from "../components/FeaturesSection";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with background image and overlay */}
      <div className="relative mb-8 flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24 sm:px-8">
        {/* Background image */}
        <img
          src="/assets/exploresg-backdrop-garden.jpg"
          alt="Singapore Jewel Backdrop"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          // style={{ filter: "brightness(0.7) blur(0.5px)" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/40 p-8 drop-shadow-2xl backdrop-blur-sm">
          {/* Announcement bar */}
          <div className="mb-6 flex items-center justify-center">
            <span className="rounded-full bg-white/80 px-4 py-1 text-xs font-medium text-gray-700">
              Discover Singapore, Your Way!
            </span>
          </div>
          {/* Headline */}
          <h1 className="mb-6 text-center text-4xl font-extrabold text-gray-100 drop-shadow-lg sm:text-5xl md:text-6xl">
            Explore Singapore
            <br className="hidden sm:block" /> with ExploreSG
          </h1>
          {/* Subheadline */}
          <p className="mb-8 max-w-2xl text-center text-lg text-gray-200">
            Welcome to ExploreSG, your platform to discover the best of
            Singapore. Dive into world-class attractions, vibrant local events,
            and hidden gems. Whether you’re a local or a visitor, find new
            adventures, food, and experiences that make Singapore truly special.
          </p>
          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              Start Exploring
            </button>
            <button className="rounded-md bg-white px-8 py-3 text-base font-semibold text-indigo-700 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
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
