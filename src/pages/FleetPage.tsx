import React, { useState, useMemo } from "react";
import RentalCard from "../components/Rentals/RentalCard";
import { RENTAL_CARS } from "../data/rentalCars";

const FleetPage: React.FC = () => {
  // Filter states
  const [sortBy, setSortBy] = useState<string>("price-low");
  const [vehicleType, setVehicleType] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [minSeats, setMinSeats] = useState<string>("all");
  const [driverAge, setDriverAge] = useState<string>("all");

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
  }, [sortBy, vehicleType, minSeats, transmission]);

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

        {/* Filter Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="seats-high">Most Seats</option>
                <option value="seats-low">Least Seats</option>
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

            {/* Transmission */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Minimum Seats */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Minimum seats
              </label>
              <select
                value={minSeats}
                onChange={(e) => setMinSeats(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any</option>
                {uniqueSeats.map((seats) => (
                  <option key={seats} value={seats.toString()}>
                    {seats}+ seats
                  </option>
                ))}
              </select>
            </div>

            {/* Driver Age */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Primary driver age
              </label>
              <select
                value={driverAge}
                onChange={(e) => setDriverAge(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Age</option>
                <option value="21-25">21-25</option>
                <option value="26-30">26-30</option>
                <option value="31+">31+</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredCars.length} of {RENTAL_CARS.length} vehicles
            </p>
          </div>
        </div>

        {/* Rental Cars Grid */}
        <div className="rounded-lg bg-white p-12 shadow-lg">
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
                  onClick={() => {
                    setSortBy("price-low");
                    setVehicleType("all");
                    setTransmission("all");
                    setMinSeats("all");
                    setDriverAge("all");
                  }}
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
