import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            About ExploreSG
          </h1>
          <p className="mt-3 text-lg sm:mt-4 sm:text-xl lg:text-2xl">
            Explore Singapore, Your Way!
          </p>
        </div>

        {/* Main Content Card */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg sm:mt-12 sm:p-8 lg:mt-16 lg:p-12">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 sm:h-24 sm:w-24">
              <span className="text-3xl font-bold text-red-600 sm:text-4xl">
                SG
              </span>
            </div>

            {/* Mission Title */}
            <h2 className="mt-4 text-xl font-semibold text-gray-900 sm:mt-6 sm:text-2xl lg:text-3xl">
              Our Mission
            </h2>

            {/* Mission Description */}
            <p className="mx-auto mt-3 max-w-3xl px-2 text-base text-gray-600 sm:mt-4 sm:text-lg lg:px-0">
              ExploreSG is dedicated to helping visitors and locals alike
              discover the best that Singapore has to offer. From iconic
              attractions to hidden gems, from world-class dining to local
              street food, we're here to make your Singapore experience
              unforgettable.
            </p>

            {/* Features Grid */}
            <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:mt-12 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 sm:h-16 sm:w-16">
                  <span className="text-2xl sm:text-3xl">🗺️</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 sm:mt-4 sm:text-lg">
                  Comprehensive Guides
                </h3>
                <p className="mt-2 px-2 text-sm text-gray-600 sm:text-base">
                  Detailed information about attractions, food, and events
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 sm:mt-4 sm:text-lg">
                  Local Insights
                </h3>
                <p className="mt-2 px-2 text-sm text-gray-600 sm:text-base">
                  Recommendations from locals who know Singapore best
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 sm:h-16 sm:w-16">
                  <span className="text-2xl sm:text-3xl">⭐</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-gray-900 sm:mt-4 sm:text-lg">
                  Quality Content
                </h3>
                <p className="mt-2 px-2 text-sm text-gray-600 sm:text-base">
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
