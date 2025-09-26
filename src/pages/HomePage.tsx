import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 to-red-700 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Discover Singapore
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-red-100">
            From world-class attractions to local street food, explore
            everything the Lion City has to offer. Your adventure starts here.
          </p>
          <div className="mt-10">
            <button className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-red-600 transition-colors hover:bg-gray-100">
              Start Exploring
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to make the most of your Singapore experience
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Attractions
                </h3>
                <p className="mt-2 text-gray-600">
                  Iconic landmarks and hidden gems waiting to be discovered
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="text-2xl">🍜</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Food & Dining
                </h3>
                <p className="mt-2 text-gray-600">
                  From hawker centers to fine dining, taste the flavors of
                  Singapore
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Events
                </h3>
                <p className="mt-2 text-gray-600">
                  Stay updated with the latest events and festivals in the city
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Local Insights
                </h3>
                <p className="mt-2 text-gray-600">
                  Get insider tips and recommendations from locals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
