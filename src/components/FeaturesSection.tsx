import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="lg:w-3/4">
          <h2
            className="font-bold text-gray-800"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: "1.3",
            }}
          >
            Rent a car, plan an itinerary, and see Singapore your way
          </h2>
          <p
            className="mt-3 text-gray-700"
            style={{
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              lineHeight: "1.6",
            }}
          >
            ExploreSG's car rental platform makes it simple to book the right
            vehicle for your trip and build day-by-day routes. From short
            weekend getaways to multi-day island drives, plan, schedule and
            navigate with confidence.
          </p>
          <p className="mt-4 sm:mt-5">
            <a
              className="inline-flex items-center gap-x-2 font-medium text-teal-600 decoration-2 hover:underline focus:outline-none"
              href="/rentals"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 0.875rem)" }}
            >
              Browse cars or contact our fleet team
              <svg
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </p>
        </div>

        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <div className="flex gap-x-4 sm:gap-x-5 md:gap-x-8">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm sm:h-11 sm:w-11">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <div className="grow">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
              >
                Smart itinerary builder
              </h3>
              <p
                className="mt-1 text-gray-600"
                style={{
                  fontSize: "clamp(0.8125rem, 1.5vw, 0.9375rem)",
                  lineHeight: "1.6",
                }}
              >
                Create day-by-day routes that combine attractions, meals and
                drive time. The builder automatically optimises routing and
                suggests nearby stops so you can make the most of every trip.
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 sm:gap-x-8">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
              </svg>
            </span>
            <div className="grow">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
              >
                Nationwide fleet & trusted partners
              </h3>
              <p
                className="mt-1 text-gray-600"
                style={{
                  fontSize: "clamp(0.8125rem, 1.5vw, 0.9375rem)",
                  lineHeight: "1.6",
                }}
              >
                Choose from a wide selection of well-maintained vehicles and
                optional add-ons (GPS, child seats, insurance). Our partner
                garages and support network keep you moving.
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 sm:gap-x-8">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
            </span>
            <div className="grow">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)" }}
              >
                Flexible pricing & roadside support
              </h3>
              <p
                className="mt-1 text-gray-600"
                style={{
                  fontSize: "clamp(0.8125rem, 1.5vw, 0.9375rem)",
                  lineHeight: "1.6",
                }}
              >
                Transparent daily and hourly rates, easy upgrades, and 24/7
                roadside assistance mean you can plan with certainty and enjoy
                the ride.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
