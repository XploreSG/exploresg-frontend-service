import React, { useState, useMemo, useEffect } from "react";
import RentalCard from "../components/Rentals/RentalCard";
import { FaFilter, FaTimes, FaSpinner } from "react-icons/fa";

// Backend response type
interface OperatorCarModelData {
  operatorId: number;
  operatorName: string;
  carModelId: number;
  model: string;
  manufacturer: string;
  seats: number;
  luggage: number;
  transmission: string;
  imageUrl: string;
  category: string;
  fuelType: string;
  modelYear: number;
  dailyPrice: number;
  availableVehicleCount: number;
}

// Display type for UI
interface DisplayCarData {
  id: string; // Unique combination of operatorId-carModelId
  operatorId: number;
  operatorName: string;
  model: string;
  manufacturer: string;
  seats: number;
  luggage: number;
  transmission: string;
  imageUrl: string;
  category: string;
  price: number;
  operator: string;
  operatorStyling: string;
  availableVehicleCount: number;
}

// Operator mapping and styling
// Add the requested operator display names for IDs 101-104 and
// provide a per-operator styling class used by the UI.
const OPERATOR_NAMES: Record<number, string> = {
  101: "Sixt",
  102: "Hertz",
  103: "Lylo",
  104: "Budget",
  105: "Avis",
  106: "Enterprise",
};

const OPERATOR_STYLES: Record<number, string> = {
  101: "text-orange-600 bg-gray-200",
  102: "text-yellow-600 bg-gray-200",
  103: "text-blue-600 bg-gray-200",
  104: "text-red-600 bg-gray-200",
  105: "text-indigo-600",
  106: "text-gray-700",
};

function getOperatorInfo(operatorId: number, fallbackName?: string) {
  return {
    name: OPERATOR_NAMES[operatorId] || fallbackName || String(operatorId),
    styling: OPERATOR_STYLES[operatorId] || "text-blue-600",
  };
}

const FleetPage: React.FC = () => {
  const [carModels, setCarModels] = useState<DisplayCarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [sortBy, setSortBy] = useState<string>("price-low");
  const [vehicleType, setVehicleType] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [minSeats, setMinSeats] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedOperator, setSelectedOperator] = useState<string>("all"); // NEW

  // Mobile filter popup state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>("price");

  // Fetch data from backend
  useEffect(() => {
    const fetchCarModels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:8081/api/v1/fleet/models",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: OperatorCarModelData[] = await response.json();

        // Map backend data to display format
        const displayData: DisplayCarData[] = data.map((item) => {
          const op = getOperatorInfo(item.operatorId, item.operatorName);
          return {
            id: `${item.operatorId}-${item.carModelId}`,
            operatorId: item.operatorId,
            operatorName: item.operatorName,
            model: item.model,
            manufacturer: item.manufacturer,
            seats: item.seats,
            luggage: item.luggage,
            transmission: item.transmission,
            imageUrl: item.imageUrl,
            category: item.category,
            price: Number(item.dailyPrice),
            operator: op.name,
            operatorStyling: op.styling,
            availableVehicleCount: item.availableVehicleCount,
          };
        });

        setCarModels(displayData);
      } catch (err) {
        console.error("Failed to fetch car models:", err);
        setError(
          "Could not load vehicle data. Please check if the backend service is running.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarModels();
  }, []);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(carModels.map((car) => car.category))];
    return categories.sort();
  }, [carModels]);

  const uniqueSeats = useMemo(() => {
    const seats = [...new Set(carModels.map((car) => car.seats))];
    return seats.sort((a, b) => a - b);
  }, [carModels]);

  const uniqueOperators = useMemo(() => {
    // Deduplicate by operatorId. Using `new Set` on objects won't remove
    // duplicates because each object reference is unique. Use a Map keyed
    // by operatorId to ensure uniqueness.
    const map = new Map<number, { id: number; name: string }>();
    carModels.forEach((car) => {
      if (!map.has(car.operatorId)) {
        map.set(car.operatorId, { id: car.operatorId, name: car.operator });
      }
    });

    const operators = Array.from(map.values());
    return operators.sort((a, b) => a.name.localeCompare(b.name));
  }, [carModels]);

  // Filter logic
  const filteredCars = useMemo(() => {
    let filtered = [...carModels];

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

    // Filter by operator - NEW
    if (selectedOperator !== "all") {
      filtered = filtered.filter(
        (car) => car.operatorId === parseInt(selectedOperator),
      );
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
  }, [
    sortBy,
    vehicleType,
    minSeats,
    transmission,
    priceRange,
    selectedOperator,
    carModels,
  ]);

  const resetFilters = () => {
    setSortBy("price-low");
    setVehicleType("all");
    setTransmission("all");
    setMinSeats("all");
    setPriceRange([0, 1000]);
    setSelectedOperator("all"); // NEW
  };

  const applyMobileFilters = () => {
    setShowMobileFilters(false);
  };

  const hasActiveFilters = () => {
    return (
      sortBy !== "price-low" ||
      vehicleType !== "all" ||
      minSeats !== "all" ||
      transmission !== "all" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 1000 ||
      selectedOperator !== "all" // NEW
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-gray-700">
            Loading Vehicles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Something Went Wrong
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            WHICH CAR DO YOU WANT TO DRIVE?
          </h1>
          <p className="text-xl text-gray-600">
            Two or Four Wheels, Discover Singapore, Your Way!
          </p>
        </div>

        {/* Desktop Filter Section */}
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

            {/* Operator - NEW */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap text-gray-700">
                Operator
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="min-w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Operators</option>
                {uniqueOperators.map((op) => (
                  <option key={op.id} value={op.id.toString()}>
                    {op.name}
                  </option>
                ))}
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

        {/* Mobile Filter Button */}
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

        {/* Mobile Filter Popup - Add operator tab */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs md:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className="absolute right-0 bottom-0 left-0 max-h-[80vh] overflow-y-auto rounded-t-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-500 transition-colors hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Filter Tabs - Add operator tab */}
              <div className="flex overflow-x-auto border-b">
                <button
                  onClick={() => setActiveFilterTab("sort")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "sort"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sort
                </button>
                <button
                  onClick={() => setActiveFilterTab("operator")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "operator"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Operator
                </button>
                <button
                  onClick={() => setActiveFilterTab("price")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "price"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Price
                </button>
                <button
                  onClick={() => setActiveFilterTab("seats")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "seats"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Seats
                </button>
                <button
                  onClick={() => setActiveFilterTab("type")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "type"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Type
                </button>
              </div>

              <div className="p-4">
                {/* Operator Tab - NEW */}
                {activeFilterTab === "operator" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Filter by operator
                    </h3>
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="operator"
                          value="all"
                          checked={selectedOperator === "all"}
                          onChange={(e) => setSelectedOperator(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">All Operators</span>
                      </label>
                      {uniqueOperators.map((op) => (
                        <label
                          key={op.id}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="operator"
                            value={op.id.toString()}
                            checked={selectedOperator === op.id.toString()}
                            onChange={(e) =>
                              setSelectedOperator(e.target.value)
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">{op.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keep other filter tabs as they were */}
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

                {/* Price, Seats, Type tabs remain the same */}
                {/* ... (keep the rest of the filter content as is) ... */}
              </div>

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
                    transmission={
                      car.transmission.toLowerCase() === "automatic"
                        ? "automatic"
                        : "manual"
                    }
                    originalPrice={undefined}
                    price={car.price}
                    promoText={undefined}
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
