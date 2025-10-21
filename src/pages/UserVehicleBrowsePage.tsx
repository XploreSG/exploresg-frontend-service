import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useFleetData } from "../hooks/useFleetData";
import { formatCategoryName } from "../utils/rentalUtils";
import {
  ErrorState,
  DesktopFilters,
  MobileFilterButton,
  VehicleGrid,
  EmptyState,
  ComingSoonSection,
  VehicleBrowseHeader,
  DatePickerSection,
} from "../components/VehicleBrowse";

const UserVehicleBrowsePage: React.FC = () => {
  const {
    filteredCars,
    isLoading,
    error,
    sortBy,
    setSortBy,
    vehicleType,
    setVehicleType,
    transmission,
    setTransmission,
    minSeats,
    setMinSeats,
    priceRange,
    setPriceRange,
    selectedOperator,
    setSelectedOperator,
    uniqueCategories,
    uniqueSeats,
    uniqueOperators,
    resetFilters,
    hasActiveFilters,
    refetch,
  } = useFleetData();

  // Local snapshot of cars to animate transitions when filters change
  const [displayedCars, setDisplayedCars] = useState(filteredCars);
  const prevFilteredRef = useRef(filteredCars);
  const [gridVisible, setGridVisible] = useState(true);

  useEffect(() => {
    // Only animate when the filteredCars array reference changes
    if (prevFilteredRef.current === filteredCars) return;

    // Fade out, swap data, fade in
    setGridVisible(false);
    const t = window.setTimeout(() => {
      setDisplayedCars(filteredCars);
      setGridVisible(true);
      prevFilteredRef.current = filteredCars;
    }, 160); // short fade duration

    return () => window.clearTimeout(t);
  }, [filteredCars]);

  // Mobile filter popup state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<string>("price");

  const applyMobileFilters = () => {
    setShowMobileFilters(false);
  };

  // Always render page shell (keeps navbar/footer visible). Show loader/error inline in content area.

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Car Carousel Background */}
        <VehicleBrowseHeader />

        {/* Date Picker Section */}
        <DatePickerSection />

        {/* Desktop Filter Section */}
        <DesktopFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minSeats={minSeats}
          setMinSeats={setMinSeats}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          transmission={transmission}
          setTransmission={setTransmission}
          uniqueOperators={uniqueOperators}
          uniqueSeats={uniqueSeats}
          uniqueCategories={uniqueCategories}
          vehicleCount={filteredCars.length}
          hasActiveFilters={hasActiveFilters()}
          onClearFilters={resetFilters}
        />

        {/* Mobile Filter Button */}
        <MobileFilterButton
          vehicleCount={filteredCars.length}
          hasActiveFilters={hasActiveFilters()}
          onOpenFilters={() => setShowMobileFilters(true)}
          onClearFilters={resetFilters}
        />

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
                <button
                  onClick={() => setActiveFilterTab("transmission")}
                  className={`flex-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilterTab === "transmission"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Trans
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

                {activeFilterTab === "price" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Filter by price range
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

                {activeFilterTab === "seats" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Filter by seats
                    </h3>
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="seats"
                          value="all"
                          checked={minSeats === "all"}
                          onChange={(e) => setMinSeats(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">Any</span>
                      </label>
                      {uniqueSeats.map((seats) => (
                        <label
                          key={seats}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="seats"
                            value={seats.toString()}
                            checked={minSeats === seats.toString()}
                            onChange={(e) => setMinSeats(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">{seats} Seater</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeFilterTab === "type" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Filter by vehicle type
                    </h3>
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="vehicleType"
                          value="all"
                          checked={vehicleType === "all"}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">All Types</span>
                      </label>
                      {uniqueCategories.map((category) => (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="vehicleType"
                            value={category}
                            checked={vehicleType === category}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-gray-700">
                            {formatCategoryName(category)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeFilterTab === "transmission" && (
                  <div className="space-y-3">
                    <h3 className="mb-4 font-medium text-gray-900">
                      Filter by transmission
                    </h3>
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="transmission"
                          value="all"
                          checked={transmission === "all"}
                          onChange={(e) => setTransmission(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">All</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="transmission"
                          value="Automatic"
                          checked={transmission === "Automatic"}
                          onChange={(e) => setTransmission(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">Automatic</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50">
                        <input
                          type="radio"
                          name="transmission"
                          value="Manual"
                          checked={transmission === "Manual"}
                          onChange={(e) => setTransmission(e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">Manual</span>
                      </label>
                    </div>
                  </div>
                )}
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
            {isLoading ? (
              // Show skeleton placeholders inside the grid for graceful cross-fade
              <>
                <VehicleGrid vehicles={[]} isLoading placeholderCount={6} />
                <ComingSoonSection />
              </>
            ) : error ? (
              <ErrorState error={error} onRetry={refetch} />
            ) : filteredCars.length > 0 ? (
              <>
                <div
                  className={`transition-all duration-200 ${gridVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                >
                  <VehicleGrid vehicles={displayedCars} />
                </div>
                <div
                  className={`transition-opacity duration-300 ${gridVisible ? "opacity-100" : "opacity-0"}`}
                >
                  <ComingSoonSection />
                </div>
              </>
            ) : (
              <EmptyState onClearFilters={resetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVehicleBrowsePage;
