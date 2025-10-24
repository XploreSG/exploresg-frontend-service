import React, { useState } from "react";
import { useCollection } from "../hooks/useCollection";
import {
  FaTrophy,
  FaFire,
  FaHeart,
  FaFilter,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";
import { allPlacesGeoJSON } from "../data/places";

type FilterType = "all" | "attraction" | "event" | "food";

const CollectionsPage: React.FC = () => {
  const { collectedItems, badges, getCollectionCount } = useCollection();
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter collected items
  const filteredItems =
    filter === "all"
      ? collectedItems
      : collectedItems.filter((item) => item.type === filter);

  // Sort by most recent first
  const sortedItems = [...filteredItems].sort(
    (a, b) => b.collectedAt - a.collectedAt,
  );

  const totalCollected = collectedItems.length;
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const nextBadge = badges.find((b) => !b.unlocked);

  // Calculate progress to next badge
  const getProgressToNext = () => {
    if (!nextBadge) return 100;
    const current =
      nextBadge.category === "all"
        ? getCollectionCount()
        : getCollectionCount(nextBadge.category);
    return (current / nextBadge.requirement) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl">
            Your Collection
          </h1>
          <p className="text-lg text-gray-600">
            Track your journey through Singapore's best places
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Total Collected */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-4 right-4 opacity-20">
              <FaHeart className="text-6xl" />
            </div>
            <div className="relative z-10">
              <div className="mb-2 text-5xl font-bold">{totalCollected}</div>
              <div className="text-sm font-semibold tracking-wider uppercase opacity-90">
                Places Collected
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-4 right-4 opacity-20">
              <FaTrophy className="text-6xl" />
            </div>
            <div className="relative z-10">
              <div className="mb-2 text-5xl font-bold">
                {unlockedBadges}/{badges.length}
              </div>
              <div className="text-sm font-semibold tracking-wider uppercase opacity-90">
                Badges Earned
              </div>
            </div>
          </div>

          {/* Next Badge Progress */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute top-4 right-4 opacity-20">
              <FaFire className="text-6xl" />
            </div>
            <div className="relative z-10">
              {nextBadge ? (
                <>
                  <div className="mb-2 text-5xl font-bold">
                    {Math.round(getProgressToNext())}%
                  </div>
                  <div className="text-sm font-semibold tracking-wider uppercase opacity-90">
                    To "{nextBadge.name}"
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 text-5xl font-bold">🎉</div>
                  <div className="text-sm font-semibold tracking-wider uppercase opacity-90">
                    All Badges Unlocked!
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar - Badges */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <FaTrophy className="text-2xl text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Achievements
                </h2>
              </div>

              <div className="space-y-4">
                {badges.map((badge) => {
                  const progress =
                    badge.category === "all"
                      ? getCollectionCount()
                      : getCollectionCount(badge.category);
                  const percentage = Math.min(
                    (progress / badge.requirement) * 100,
                    100,
                  );

                  return (
                    <div
                      key={badge.id}
                      className={`group rounded-xl border-2 p-4 transition-all duration-300 ${
                        badge.unlocked
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-md hover:scale-105"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`text-4xl transition-transform ${
                            badge.unlocked
                              ? "group-hover:scale-110"
                              : "grayscale"
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold ${
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
                        {badge.unlocked && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {!badge.unlocked && (
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>
                              {progress}/{badge.requirement}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content - Collection Grid */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <FaFilter className="text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                      filter === "all"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All ({collectedItems.length})
                  </button>
                  <button
                    onClick={() => setFilter("attraction")}
                    className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                      filter === "attraction"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🎡 Attractions ({getCollectionCount("attraction")})
                  </button>
                  <button
                    onClick={() => setFilter("event")}
                    className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                      filter === "event"
                        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🎉 Events ({getCollectionCount("event")})
                  </button>
                  <button
                    onClick={() => setFilter("food")}
                    className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                      filter === "food"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    🍜 Food ({getCollectionCount("food")})
                  </button>
                </div>
              </div>
            </div>

            {/* Collection Grid */}
            {sortedItems.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
                <FaMapMarkerAlt className="mx-auto mb-4 text-6xl text-gray-300" />
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  {filter === "all"
                    ? "No Collections Yet"
                    : `No ${filter}s Collected Yet`}
                </h3>
                <p className="mb-6 text-gray-600">
                  Start exploring Singapore and collect your favorite places!
                </p>
                <Link
                  to="/explore"
                  className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {sortedItems.map((item) => {
                  // Find the full place data from GeoJSON
                  const placeData = allPlacesGeoJSON.features.find(
                    (feature) => feature.properties.id === item.id,
                  );

                  if (!placeData) {
                    // Fallback if place data not found
                    return (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      >
                        <div className="relative p-6">
                          <div className="mb-4 text-6xl transition-transform group-hover:scale-110">
                            {item.type === "attraction"
                              ? "🎡"
                              : item.type === "event"
                                ? "🎉"
                                : "🍜"}
                          </div>
                          <h3 className="mb-2 text-xl font-bold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Collected on{" "}
                            {new Date(item.collectedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  const props = placeData.properties;

                  return (
                    <ContentCard
                      key={item.id}
                      id={props.id}
                      name={props.name}
                      description={props.description}
                      image={props.image}
                      imageAlt={props.name}
                      rating={props.rating || 4.5}
                      reviews={props.reviews || 100}
                      distance={props.location || "Singapore"}
                      category={props.category}
                      price={props.price}
                      status={props.status}
                      type={item.type}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
