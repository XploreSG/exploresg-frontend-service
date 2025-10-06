import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="lg:w-3/4">
          <h2 className="text-3xl font-bold text-gray-800 lg:text-4xl">
            Built to help you discover and design better experiences
          </h2>
          <p className="mt-3 text-gray-700">
            ExploreSG brings together local guides, curated itineraries and
            scheduling tools so travellers and residents can find the best of
            Singapore — quickly and confidently.
          </p>
          <p className="mt-5">
            <a
              className="inline-flex items-center gap-x-2 text-sm font-medium text-teal-600 decoration-2 hover:underline focus:outline-none"
              href="#contact"
            >
              Partner with our events & experiences team
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

        <div className="space-y-6 lg:space-y-10">
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
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </span>
            <div className="grow">
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                Local guides & resources
              </h3>
              <p className="mt-1 text-gray-600">
                In-depth guides and curated neighbourhood walks crafted by local
                experts — everything you need to plan a day, an event, or a
                whole weekend in Singapore.
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
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                Partners & local experts
              </h3>
              <p className="mt-1 text-gray-600">
                We work with a growing network of tour operators, venues and
                creators to make it easy for businesses and organisers to run
                memorable events and experiences.
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
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                Flexible packages & transparent pricing
              </h3>
              <p className="mt-1 text-gray-600">
                From single-day itineraries to full-service event support, our
                pricing and packages are designed to be flexible and clear so
                you can choose what fits your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
