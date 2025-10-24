import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";
import { getPlacesByCategory } from "../data/places";

const AttractionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    selectedFilter: selectedCategory,
    handleFilterChange: handleCategoryClick,
    resetFilter,
  } = useFilter({ initialFilter: "All" });

  const categories = [
    "All",
    "Landmark",
    "Nature",
    "Theme Park",
    "Cultural",
    "Museum",
    "Religious",
    "Shopping",
  ];

  const filteredAttractions = getPlacesByCategory(
    "attraction",
    selectedCategory,
  );

  const additionalContent = (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">Plan Your Visit</h2>
      <div className="grid grid-cols-1 gap-8 text-gray-700 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Getting Around
          </h3>
          <p className="mb-2">
            Singapore has an excellent public transportation system. The MRT
            (Mass Rapid Transit) is the most efficient way to get to most
            attractions.
          </p>
          <p>
            Consider purchasing an EZ-Link card or a Singapore Tourist Pass for
            hassle-free travel.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Best Time to Visit
          </h3>
          <p className="mb-2">
            Singapore is a year-round destination, but the cooler months from
            February to April are often preferred. Avoid the haze season (June
            to September) if possible.
          </p>
          <p>
            Check local weather forecasts and event calendars before your trip.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <FilterablePage
      heroTitle="Discover Singapore's Iconic Attractions"
      heroSubtitle="From lush gardens to thrilling theme parks, explore the best of the Lion City"
      heroGradient="from-red-600 to-red-800"
      filterOptions={categories}
      selectedFilter={selectedCategory}
      onFilterChange={handleCategoryClick}
      onResetFilter={resetFilter}
      contentRef={contentRef}
      heroRef={heroRef}
      additionalContent={additionalContent}
    >
      {filteredAttractions.map((attraction) => (
        <ContentCard
          key={attraction.id}
          name={attraction.name}
          description={attraction.description}
          image={attraction.image}
          imageAlt={attraction.name}
          rating={attraction.rating}
          reviews={attraction.reviews}
          distance={attraction.location}
          category={attraction.category}
          price={attraction.price}
          type={attraction.type}
        />
      ))}
    </FilterablePage>
  );
};

export default AttractionsPage;
