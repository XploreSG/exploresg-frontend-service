import React, { useState, useMemo } from "react";
import RentalCard from "../components/Rentals/RentalCard";
import { RENTAL_CARS } from "../data/rentalCars";
import { FaFilter, FaTimes } from "react-icons/fa";

const FleetPage: React.FC = () => {
  // Filter states
  const [sortBy, setSortBy] = useState<string>("price-low");
  const [vehicleType, setVehicleType] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [minSeats, setMinSeats] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Mobile filter popup state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>("price");

  // Get unique values from our data for dynamic filters
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(RENTAL_CARS.map((car) => car.category))];
    return categories.sort();
  }, []);

  const uniqueSeats = useMemo(() => {
    const seats = [...new Set(RENTAL_CARS.map((car) => car.seats))];
    return seats.sort((a, b) => a - b);
  }, []);

  // Filter and sort the cars
  const filteredCars = useMemo(() => {
    let filtered = [...RENTAL_CARS];

    // Filter by price range
    filtered = filtered.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1],
    );

    // Filter by vehicle type/category
    if (vehicleType !== "all") {
      filtered = filtered.filter((car) => car.category === vehicleType);
    }

    // Filter by minimum seats
    if (minSeats !== "all") {
      filtered = filtered.filter((car) => car.seats >= parseInt(minSeats));
    }

    // Filter by transmission
    if (transmission !== "all") {
      filtered = filtered.filter((car) => car.transmission === transmission);
    }

    // Sort cars
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case "name-za":
        filtered.sort((a, b) => b.model.localeCompare(a.model));
        break;
      case "seats-high":
        filtered.sort((a, b) => b.seats - a.seats);
        break;
      case "seats-low":
        filtered.sort((a, b) => a.seats - b.seats);
        break;
      default:
        break;
    }

    return filtered;
  }, [sortBy, vehicleType, minSeats, transmission, priceRange]);

  const resetFilters = () => {
    setSortBy("price-low");
    setVehicleType("all");
    setTransmission("all");
    setMinSeats("all");
    setPriceRange([0, 1000]);
  };

  const applyMobileFilters = () => {
    setShowMobileFilters(false);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      sortBy !== "price-low" ||
      vehicleType !== "all" ||
      minSeats !== "all" ||
      transmission !== "all" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 1000
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            WHICH CAR DO YOU WANT TO DRIVE?
          </h1>
          <p className="text-xl text-gray-600">
            Two or Four Wheels, Discover Singapore, Your Way!
          </p>
        </div>

        {/* Desktop Filter Section - Hidden on mobile */}
        <div className="mb-8 hidden rounded-lg bg-white p-6 shadow-lg md:block">
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-36 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Brand: A-Z</option>
                <option value="name-za">Brand: Z-A</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Price range
              </label>
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  setPriceRange([min, max]);
                }}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="0-1000">All Prices</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-300">$100 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="500-1000">$500+</option>
              </select>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Seats
              </label>
              <select
                value={minSeats}
                onChange={(e) => setMinSeats(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any</option>
                {uniqueSeats.map((seats) => (
                  <option key={seats} value={seats.toString()}>
                    {seats} Seater
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Vehicle type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count and Clear Button */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-blue-600">
              {filteredCars.length} models found
            </p>
            {hasActiveFilters() && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaTimes className="text-xs" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Button - Only visible on mobile */}
        <div className="mb-6 md:hidden">
          <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-blue-600">
                {filteredCars.length} models found
              </p>
              {hasActiveFilters() && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaTimes className="text-xs" />
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <FaFilter className="text-sm" />
              Filter
            </button>
          </div>
        </div>

        {/* Mobile Filter Popup */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs md:hidden"
            onClick={() => setShowMobileFilters(false)} // Close when clicking backdrop
          >
            <div
              className="absolute right-0 bottom-0 left-0 max-h-[80vh] overflow-y-auto rounded-t-xl bg-white"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-500 transition-colors hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveFilterTab("sort")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeFilterTab === "sort"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sort
                </button>
                <button
                  onClick={() => setActiveFilterTab("price")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeFilterTab === "price"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setActiveFilterTab("seats")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeFilterTab === "seats"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Seats
                </button>
                <button
                  onClick={() => setActiveFilterTab("type")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeFilterTab === "type"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Type
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-4">
                {/* Sort Tab */}
                {activeFilterTab === "sort" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Sort vehicles by
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "Price: Low to High", value: "price-low" },
                        { label: "Price: High to Low", value: "price-high" },
                        { label: "Brand: A-Z", value: "name-az" },
                        { label: "Brand: Z-A", value: "name-za" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Tab */}
                {activeFilterTab === "price" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      S$0 - S$1000 /night
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "All Prices", value: "0-1000" },
                        { label: "$0 - $100", value: "0-100" },
                        { label: "$100 - $300", value: "100-300" },
                        { label: "$300 - $500", value: "300-500" },
                        { label: "$500+", value: "500-1000" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            value={option.value}
                            checked={
                              `${priceRange[0]}-${priceRange[1]}` ===
                              option.value
                            }
                            onChange={(e) => {
                              const [min, max] = e.target.value
                                .split("-")
                                .map(Number);
                              setPriceRange([min, max]);
                            }}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seats Tab */}
                {activeFilterTab === "seats" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={minSeats === "4"}
                          onChange={(e) =>
                            setMinSeats(e.target.checked ? "4" : "all")
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">4 Seater</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={minSeats === "5"}
                          onChange={(e) =>
                            setMinSeats(e.target.checked ? "5" : "all")
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">5 Seater</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={minSeats === "7"}
                          onChange={(e) =>
                            setMinSeats(e.target.checked ? "7" : "all")
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">7 Seater</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Vehicle Type Tab */}
                {activeFilterTab === "type" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={vehicleType === "hybrid"}
                          onChange={(e) =>
                            setVehicleType(e.target.checked ? "hybrid" : "all")
                          }
                          className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">Hybrid</span>
                      </label>
                      {uniqueCategories.map((category) => (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={vehicleType === category}
                            onChange={(e) =>
                              setVehicleType(
                                e.target.checked ? category : "all",
                              )
                            }
                            className="h-4 w-4 rounded text-blue-600"
                          />
                          <span className="text-gray-700">
                            {category
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t bg-gray-50 p-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={applyMobileFilters}
                  className="flex-1 rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rental Cars Grid */}
        <div className="rounded-lg bg-white p-6 shadow-lg md:p-12">
          <div className="text-center">
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-center gap-8">
                {filteredCars.map((car) => (
                  <RentalCard
                    key={car.id}
                    carId={car.id}
                    model={car.model}
                    seats={car.seats}
                    luggage={car.luggage}
                    transmission={car.transmission}
                    originalPrice={car.originalPrice}
                    price={car.price}
                    promoText={car.promoText}
                    imageUrl={car.imageUrl}
                    operator={car.operator}
                    operatorStyling={car.operatorStyling}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-4xl">🔍</span>
                </div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  No vehicles match your filters
                </h2>
                <p className="mb-6 text-gray-600">
                  Try adjusting your search criteria to see more options.
                </p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Coming Soon Section - Only show if we have results */}
            {filteredCars.length > 0 && (
              <div className="mt-16">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-4xl">🚗</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                  More Vehicles Coming Soon
                </h2>
                <p className="mt-4 text-gray-600">
                  We're working hard to bring you more rental options. Stay
                  tuned for motorcycles, luxury cars, and more!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
