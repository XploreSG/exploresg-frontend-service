import React from "react";

const StatsSection: React.FC = () => {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 xl:px-0">
        <div className="rounded-xl bg-white/90 ring-1 ring-slate-100 drop-shadow-2xl sm:p-8">
          <div className="grid grid-cols-1 items-center gap-x-8 gap-y-8 sm:grid-cols-3">
            {/* Stat 1 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm">
                <span aria-hidden className="text-xl">
                  🌟
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  2,000+
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  ExploreSG partners
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-sm">
                <span aria-hidden className="text-xl">
                  🎉
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-center -space-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Avatar 1"
                  />
                  <img
                    className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Avatar 2"
                  />
                  <img
                    className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1679412330254-90cb240038c5?auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                    alt="Avatar 3"
                  />
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  85%
                </h3>
                <p className="mt-1 text-sm text-slate-500">Happy explorers</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 shadow-sm">
                <span aria-hidden className="text-xl">
                  🚀
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  $55M+
                </h3>
                <p className="mt-1 text-sm text-slate-500">
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
