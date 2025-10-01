import { useAuth } from "../contexts/useAuth";
import RentalCardSummary from "../components/Rentals/RentalCardSummary";
import { useMemo } from "react";

// Supported languages type
type SupportedLanguage = "English" | "Chinese" | "Malay" | "Tamil";

// Greeting messages per language
const greetingsMap: Record<
  SupportedLanguage,
  { morning: string; afternoon: string; evening: string; night: string }
> = {
  English: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night",
  },
  Chinese: {
    morning: "早上好",
    afternoon: "下午好",
    evening: "晚上好",
    night: "晚安",
  },
  Malay: {
    morning: "Selamat pagi",
    afternoon: "Selamat petang",
    evening: "Selamat malam",
    night: "Selamat malam",
  },
  Tamil: {
    morning: "காலை வணக்கம்",
    afternoon: "மதிய வணக்கம்",
    evening: "மாலை வணக்கம்",
    night: "இனிய இரவு",
  },
};

const YourDayPage = () => {
  const { user } = useAuth();

  // Always compute greeting first, even if user is null
  const { greeting, emoji } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    // fallback to English if no user or invalid language
    const lang: SupportedLanguage =
      (user?.preferredLanguage as SupportedLanguage) || "English";
    const texts = greetingsMap[lang];

    if (hour < 5) return { greeting: texts.night, emoji: "🌙" };
    if (hour < 12) return { greeting: texts.morning, emoji: "🌅" };
    if (hour < 18) return { greeting: texts.afternoon, emoji: "🌞" };
    if (hour < 22) return { greeting: texts.evening, emoji: "🌆" };
    return { greeting: texts.night, emoji: "🌙" };
  }, [user?.preferredLanguage]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-gray-900">
            Please sign in to view your day
          </h1>
        </div>
      </div>
    );
  }

  // Build full name
  const fullName = [user.givenName, user.familyName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-4 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Your Day</h1>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-2">
              <span className="text-2xl">{emoji}</span>
              <div>
                <div className="text-lg font-semibold text-blue-700">30°C</div>
                <div className="text-xs text-gray-500">
                  Sunny with a chance of afternoon showers
                </div>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  View 5-day forecast
                </a>
              </div>
            </div>
          </div>

          {/* Greeting */}
          <div className="mt-2 flex items-center gap-3 text-lg text-gray-700">
            <img
              src={user.picture || "/assets/default-avatar.png"}
              alt={fullName || user.email}
              className="h-10 w-10 rounded-full border object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/default-avatar.png";
              }}
            />
            <span>
              {greeting}, {user.givenName || fullName || user.email}! Here's
              what's planned for your day
            </span>
          </div>
        </div>

        {/* Example Ride */}
        <div className="mb-6 flex flex-col gap-2 rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Your Ride</h1>

          <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  Porsche 911 Carrera
                </div>
                <div className="text-sm text-gray-600">
                  9:00 AM @ Changi Airport Terminal 3<br />
                  Drop-off: 5:00 PM @ Marina Bay Sands
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold">
                    Hertz
                  </span>
                  <span className="text-xs text-gray-500">
                    Booking Ref: #SG12345
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <RentalCardSummary
              model="Porsche 911 Carrera"
              seats={4}
              luggage={2}
              transmission="automatic"
              imageUrl="/assets/porsche-911-c.png"
              operator="Hertz"
              operatorStyling="bg-yellow-400 text-black"
              price={320}
              className="w-full"
            />
            <div className="relative w-full">
              <button className="absolute left-1/2 mx-auto mt-3 block w-36 -translate-x-1/2 translate-y-8 rounded-lg bg-blue-600 py-2 font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blue-700">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Your Bookings */}
            {/* <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
              <div className="mb-2 text-lg font-semibold">Your Bookings</div>
              <div className="flex items-center gap-4">
                <img
                  src="/assets/porsche-911-c.png"
                  alt="Porsche 911"
                  className="h-16 w-24 rounded-lg border object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Porsche 911 Carrera
                  </div>
                  <div className="text-sm text-gray-600">
                    9:00 AM @ Changi Airport Terminal 3<br />
                    Drop-off: 5:00 PM @ Marina Bay Sands
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold">
                      Hertz
                    </span>
                    <span className="text-xs text-gray-500">
                      Booking Ref: #SG12345
                    </span>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
                Get Directions
              </button>
            </div> */}

            {/* Your Books (placeholder) & Travel Tools */}
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
              <div className="mb-2 text-lg font-semibold">Your Books</div>
              <div className="mb-2 text-sm text-gray-400">No books yet.</div>
              <div className="mb-2 text-lg font-semibold">Travel Tools</div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                    <span className="text-xl">🗺️</span>
                  </div>
                  <span className="text-xs text-gray-700">Public sgt Map</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                    <span className="text-xl">🚨</span>
                  </div>
                  <span className="text-xs text-gray-700">
                    Emergency Contacts
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                    <span className="text-xl">💱</span>
                  </div>
                  <span className="text-xs text-gray-700">
                    Currency Converter
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Today's Adventures */}
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
              <div className="mb-2 text-lg font-semibold">
                Today's Adventures
              </div>
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  alt="Gardens by the Bay"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-lg font-bold text-white">
                    Gardens by the Bay - Cloud Forest
                  </div>
                  <div className="text-xs text-white">
                    Entry 10:30 AM
                    <br />
                    Location: Marina Gardens Drive
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>2 Adults</span>
                <span>Booking Ref: #ATT67890</span>
              </div>
              <div className="mt-2 flex gap-2">
                <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                  View Ticket
                </button>
                <button className="rounded-lg border border-blue-600 px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Recommendations for You */}
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
              <div className="mb-2 text-lg font-semibold">
                Recommendations for You
              </div>
              <div className="mb-2 flex gap-2">
                <button className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Nearby Eateries
                </button>
                <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Hidden Gems
                </button>
                <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Evening Activities
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                    alt="328 Katong Laska"
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                  />
                  <div className="font-semibold text-gray-800">
                    328 Katong Laska
                  </div>
                  <div className="text-xs text-gray-500">Peranakan Cuisine</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                    <span>★ 4.5</span>
                    <span className="text-gray-400">(890)</span>
                    <span className="text-gray-400">• 0.3 km</span>
                  </div>
                  <button className="mt-2 w-full rounded-lg border border-blue-600 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                    Book Table
                  </button>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
                    alt="Food"
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                  />
                  <div className="text-center font-semibold text-gray-800">
                    More Eateries
                  </div>
                  <button className="w-full rounded-lg border border-blue-600 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourDayPage;
