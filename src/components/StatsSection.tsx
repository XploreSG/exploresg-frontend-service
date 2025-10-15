import React from "react";

const StatsSection: React.FC = () => {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 xl:px-0">
        <div className="rounded-xl bg-white/90 p-6 ring-1 ring-slate-100 drop-shadow-2xl sm:p-8">
          <div className="grid grid-cols-1 items-center gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8">
            {/* Stat 1 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm sm:h-12 sm:w-12">
                <span aria-hidden className="text-lg sm:text-xl">
                  🌟
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <h3
                  className="font-extrabold text-slate-900"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  2,000+
                </h3>
                <p
                  className="mt-1 text-slate-500"
                  style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)" }}
                >
                  ExploreSG partners
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm sm:h-12 sm:w-12">
                <span aria-hidden className="text-lg sm:text-xl">
                  🎉
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="flex items-center justify-center -space-x-3 sm:-space-x-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white sm:h-12 sm:w-12"
                    src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Avatar 1"
                  />
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white sm:h-12 sm:w-12"
                    src="https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Avatar 2"
                  />
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white sm:h-12 sm:w-12"
                    src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                    alt="Avatar 3"
                  />
                </div>
                <h3
                  className="mt-3 font-extrabold text-slate-900"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  85%
                </h3>
                <p
                  className="mt-1 text-slate-500"
                  style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)" }}
                >
                  Happy explorers
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600 shadow-sm sm:h-12 sm:w-12">
                <span aria-hidden className="text-lg sm:text-xl">
                  🚀
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <h3
                  className="font-extrabold text-slate-900"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  $55M+
                </h3>
                <p
                  className="mt-1 text-slate-500"
                  style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)" }}
                >
                  Bookings managed yearly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
