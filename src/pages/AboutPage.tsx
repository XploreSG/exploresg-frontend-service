import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">About ExploreSG</h1>
          <p className="mt-4 text-xl">Explore Singapore, Your Way!</p>
        </div>

        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl font-bold text-red-600">SG</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              ExploreSG is dedicated to helping visitors and locals alike
              discover the best that Singapore has to offer. From iconic
              attractions to hidden gems, from world-class dining to local
              street food, we're here to make your Singapore experience
              unforgettable.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Comprehensive Guides
                </h3>
                <p className="mt-2 text-gray-600">
                  Detailed information about attractions, food, and events
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Local Insights
                </h3>
                <p className="mt-2 text-gray-600">
                  Recommendations from locals who know Singapore best
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Quality Content
                </h3>
                <p className="mt-2 text-gray-600">
                  Carefully curated experiences for every type of traveler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
