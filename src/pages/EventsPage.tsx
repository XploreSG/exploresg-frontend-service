import React from "react";

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
          <p className="mt-4 text-xl text-gray-600">
            Stay updated with the latest happenings in the Lion City
          </p>
        </div>

        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Events & Festivals
            </h2>
            <p className="mt-4 text-gray-600">
              Singapore hosts world-class events throughout the year. From
              cultural festivals to international conferences, there's always
              something exciting happening!
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Singapore Grand Prix
                </h3>
                <p className="text-sm text-gray-600">Formula 1 night race</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Chinese New Year
                </h3>
                <p className="text-sm text-gray-600">Cultural celebrations</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Singapore Food Festival
                </h3>
                <p className="text-sm text-gray-600">Culinary extravaganza</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Art Week</h3>
                <p className="text-sm text-gray-600">
                  Contemporary art showcase
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">National Day</h3>
                <p className="text-sm text-gray-600">Singapore's birthday</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">Deepavali</h3>
                <p className="text-sm text-gray-600">Festival of lights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
