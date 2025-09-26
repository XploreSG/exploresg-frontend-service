import React from "react";

const AttractionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Attractions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Discover Singapore's most iconic landmarks and hidden gems
          </p>
        </div>

        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🏛️</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Coming Soon
            </h2>
            <p className="mt-4 text-gray-600">
              We're working hard to bring you the best attractions in Singapore.
              Stay tuned for amazing experiences!
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Marina Bay Sands
                </h3>
                <p className="text-sm text-gray-600">Iconic skyline landmark</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Gardens by the Bay
                </h3>
                <p className="text-sm text-gray-600">
                  Futuristic botanical wonder
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Merlion Park</h3>
                <p className="text-sm text-gray-600">
                  Singapore's national symbol
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Singapore Zoo</h3>
                <p className="text-sm text-gray-600">
                  Award-winning wildlife park
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Sentosa Island</h3>
                <p className="text-sm text-gray-600">Resort destination</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Chinatown</h3>
                <p className="text-sm text-gray-600">
                  Cultural heritage district
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionsPage;
