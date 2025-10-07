import React from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

interface MobileFilterButtonProps {
  vehicleCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
}

const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({
  vehicleCount,
  hasActiveFilters,
  onOpenFilters,
  onClearFilters,
}) => {
  return (
    <div className="mb-6 md:hidden">
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-blue-600">
            {vehicleCount} models found
          </p>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FaTimes className="text-xs" />
              Clear
            </button>
          )}
        </div>
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <FaFilter className="text-sm" />
          Filter
        </button>
      </div>
    </div>
  );
};

export default MobileFilterButton;
