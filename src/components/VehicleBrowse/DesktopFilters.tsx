import React from "react";
import { FaTimes } from "react-icons/fa";
import { formatCategoryName } from "../../utils/rentalUtils";
import type { OperatorInfo } from "../../types/rental";

interface DesktopFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedOperator: string;
  setSelectedOperator: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  minSeats: string;
  setMinSeats: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  transmission: string;
  setTransmission: (value: string) => void;
  uniqueOperators: OperatorInfo[];
  uniqueSeats: number[];
  uniqueCategories: string[];
  vehicleCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const DesktopFilters: React.FC<DesktopFiltersProps> = ({
  sortBy,
  setSortBy,
  selectedOperator,
  setSelectedOperator,
  priceRange,
  setPriceRange,
  minSeats,
  setMinSeats,
  vehicleType,
  setVehicleType,
  transmission,
  setTransmission,
  uniqueOperators,
  uniqueSeats,
  uniqueCategories,
  vehicleCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
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

        {/* Operator */}
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
                {formatCategoryName(category)}
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
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-sm font-medium text-blue-600">
          {vehicleCount} models found
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FaTimes className="text-xs" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default DesktopFilters;
