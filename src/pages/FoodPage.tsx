import React from "react";

const FoodPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Food & Dining</h1>
          <p className="mt-4 text-xl text-gray-600">
            Taste the incredible flavors of Singapore's diverse culinary scene
          </p>
        </div>

        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🍜</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Culinary Adventures Await
            </h2>
            <p className="mt-4 text-gray-600">
              From street food to Michelin-starred restaurants, Singapore's food
              scene is second to none. We're preparing a comprehensive guide for
              food lovers!
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Hawker Centers</h3>
                <p className="text-sm text-gray-600">
                  Authentic local street food
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Hainanese Chicken Rice
                </h3>
                <p className="text-sm text-gray-600">
                  Singapore's national dish
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Laksa</h3>
                <p className="text-sm text-gray-600">
                  Spicy coconut curry noodles
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Char Kway Teow</h3>
                <p className="text-sm text-gray-600">Wok-fried rice noodles</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Chili Crab</h3>
                <p className="text-sm text-gray-600">Iconic seafood delicacy</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Kaya Toast</h3>
                <p className="text-sm text-gray-600">
                  Traditional breakfast treat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
