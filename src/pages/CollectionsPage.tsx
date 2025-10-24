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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-4 text-5xl font-bold text-gray-900 sm:text-6xl"
            style={{ fontFamily: "cursive" }}
          >
            Chope It!
          </h1>
          <p className="text-base text-gray-600">
            Track and manage your favorite places in Singapore
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {/* Total Collected */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Collected
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {totalCollected}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <FaHeart className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Badges Earned
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {unlockedBadges}
                  <span className="text-lg text-gray-400">
                    /{badges.length}
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
                <FaTrophy className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Next Badge Progress */}
          <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {nextBadge ? (
                  <>
                    <p className="text-sm font-medium text-gray-600">
                      Next Achievement
                    </p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">
                      {nextBadge.name}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${getProgressToNext()}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">
                      All Complete!
                    </p>
                  </>
                )}
              </div>
              <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                <FaFire className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Sidebar - Badges */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                    <FaTrophy className="text-xl text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Achievements
                  </h2>
                </div>
              </div>

              <div className="max-h-[600px] space-y-3 overflow-y-auto p-6">
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
                      className={`group rounded-lg border p-4 transition-all duration-200 ${
                        badge.unlocked
                          ? "border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`text-3xl transition-transform ${
                            badge.unlocked
                              ? "group-hover:scale-110"
                              : "opacity-40 grayscale"
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-sm font-semibold ${
                              badge.unlocked ? "text-gray-900" : "text-gray-500"
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
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {!badge.unlocked && (
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span className="font-medium">
                              {progress}/{badge.requirement}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
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
            <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
                  <FaFilter className="text-gray-600" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      filter === "all"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All ({collectedItems.length})
                  </button>
                  <button
                    onClick={() => setFilter("attraction")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      filter === "attraction"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🎡 Attractions ({getCollectionCount("attraction")})
                  </button>
                  <button
                    onClick={() => setFilter("event")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      filter === "event"
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🎉 Events ({getCollectionCount("event")})
                  </button>
                  <button
                    onClick={() => setFilter("food")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      filter === "food"
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    🍜 Food ({getCollectionCount("food")})
                  </button>
                </div>
              </div>
            </div>

            {/* Collection Grid */}
            {sortedItems.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-900/5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                  <FaMapMarkerAlt className="text-3xl text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {filter === "all"
                    ? "No Collections Yet"
                    : `No ${filter}s Collected Yet`}
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  Start exploring Singapore and collect your favorite places!
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
                >
                  Start Exploring
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {sortedItems.map((item) => {
                  // Find the full place data from GeoJSON
                  const placeData = allPlacesGeoJSON.features.find(
                    (feature) => feature.properties?.id === item.id,
                  );

                  if (!placeData || !placeData.properties) {
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
