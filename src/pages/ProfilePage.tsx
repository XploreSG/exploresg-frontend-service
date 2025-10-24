import React from "react";
import { useAuth } from "../contexts/useAuth";
import { useCollection } from "../hooks/useCollection";
import { FaBookmark, FaRegHeart, FaTrophy, FaFire } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { collectedItems, badges, getCollectionCount } = useCollection();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Please sign in to view your profile.
          </h1>
        </div>
      </div>
    );
  }

  const fullName = [user.givenName, user.familyName].filter(Boolean).join(" ");

  // Calculate stats
  const totalCollected = collectedItems.length;
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const attractionCount = getCollectionCount("attraction");
  const eventCount = getCollectionCount("event");
  const foodCount = getCollectionCount("food");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={user.picture || "/assets/default-avatar.png"}
              alt={fullName || user.email}
              className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover shadow-md"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-md text-gray-600">{user.email}</p>
              <div className="mt-2 flex items-center justify-center gap-4 sm:justify-start">
                <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
            <div className="mb-1 text-3xl font-bold">{totalCollected}</div>
            <div className="text-sm opacity-90">Places Collected</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-lg">
            <div className="mb-1 text-3xl font-bold">{unlockedBadges}</div>
            <div className="text-sm opacity-90">Badges Earned</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-4 text-white shadow-lg">
            <div className="mb-1 text-3xl font-bold">{attractionCount}</div>
            <div className="text-sm opacity-90">Attractions</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-lg">
            <div className="mb-1 text-3xl font-bold">
              {foodCount + eventCount}
            </div>
            <div className="text-sm opacity-90">Food & Events</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - User Details */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Your Details
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Phone:</strong> {user.phone || "Not provided"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {user.dateOfBirth || "Not provided"}
                </p>
                <p>
                  <strong>Driver's License:</strong>{" "}
                  {user.drivingLicenseNumber || "Not provided"}
                </p>
                <p>
                  <strong>Country:</strong>{" "}
                  {user.countryOfResidence || "Not provided"}
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {user.preferredLanguage || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Achievements & Collections */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Badge Showcase */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaTrophy className="text-2xl text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Achievements
                    </h2>
                  </div>
                  <Link
                    to="/collections"
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  >
                    View All →
                  </Link>
                </div>

                {/* Badge Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {badges.slice(0, 6).map((badge) => (
                    <div
                      key={badge.id}
                      className={`group relative rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                        badge.unlocked
                          ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md hover:scale-105 hover:shadow-xl"
                          : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      {badge.unlocked && (
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white shadow-md">
                          ✓
                        </div>
                      )}
                      <div
                        className={`mb-2 text-4xl transition-transform ${
                          badge.unlocked ? "group-hover:scale-110" : "grayscale"
                        }`}
                      >
                        {badge.icon}
                      </div>
                      <h3
                        className={`mb-1 text-sm font-bold ${
                          badge.unlocked ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {badge.name}
                      </h3>
                      <p
                        className={`text-xs ${
                          badge.unlocked ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {badge.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Collections Preview */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaRegHeart className="text-xl text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Recent Collections
                    </h2>
                  </div>
                  {totalCollected > 0 && (
                    <Link
                      to="/collections"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View All ({totalCollected})
                    </Link>
                  )}
                </div>

                {totalCollected === 0 ? (
                  <div className="text-center text-gray-500">
                    <FaFire className="mx-auto mb-3 text-4xl text-gray-300" />
                    <p className="mb-2 text-lg font-semibold">
                      Start Your Collection!
                    </p>
                    <p className="mb-4 text-sm">
                      Explore attractions, events, and food places to begin your
                      journey.
                    </p>
                    <Link
                      to="/explore"
                      className="inline-block rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                    >
                      Start Exploring
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {collectedItems
                      .slice(-6)
                      .reverse()
                      .map((item) => (
                        <div
                          key={item.id}
                          className="group relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 shadow-sm transition-all hover:scale-105 hover:border-red-400 hover:shadow-md"
                        >
                          <div className="mb-2 text-2xl">
                            {item.type === "attraction"
                              ? "🎡"
                              : item.type === "event"
                                ? "🎉"
                                : "🍜"}
                          </div>
                          <h4 className="line-clamp-2 text-xs font-semibold text-gray-800">
                            {item.name}
                          </h4>
                          <div className="absolute top-1 right-1">
                            <FaRegHeart className="text-xs text-red-400" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Bookmarks Section */}
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <FaBookmark className="text-xl text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Bookmarks
                  </h2>
                </div>
                <div className="text-center text-gray-500">
                  <p>You haven't bookmarked any items yet.</p>
                  <p className="text-sm">
                    Explore rentals and save them here for quick access!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
