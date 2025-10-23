import React from "react";

interface FilterablePageProps {
  heroTitle: string;
  heroSubtitle: string;
  heroGradient: string;
  filterOptions: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onResetFilter: () => void;
  children: React.ReactNode;
  contentRef: React.RefObject<HTMLDivElement | null>;
  heroRef: React.RefObject<HTMLDivElement | null>;
  additionalContent?: React.ReactNode;
}

const FilterablePage: React.FC<FilterablePageProps> = ({
  heroTitle,
  heroSubtitle,
  heroGradient,
  filterOptions,
  selectedFilter,
  onFilterChange,
  onResetFilter,
  children,
  contentRef,
  heroRef,
  additionalContent
}) => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className={`relative h-64 sm:h-80 md:h-96 bg-gradient-to-r ${heroGradient} flex items-center justify-center`}>
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
            {heroTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8">
            {heroSubtitle}
          </p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Filter Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFilterChange(option)}
                className={`px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm md:text-base rounded-full shadow-md transition-colors ${
                  selectedFilter === option
                    ? "bg-red-600 text-white"
                    : "bg-white hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {option}
              </button>
            ))}
            {selectedFilter !== "All" && (
              <button
                onClick={onResetFilter}
                className="ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800"
                title="Reset filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {children}
        </div>

        {/* Additional Content */}
        {additionalContent}
      </div>
    </div>
  );
};

export default FilterablePage;
