import React from "react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
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
        onClick={onClearFilters}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default EmptyState;
