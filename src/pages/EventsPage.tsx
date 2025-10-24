import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";
import { getPlacesByCategory } from "../data/places";

const EventsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    selectedFilter: selectedCategory,
    handleFilterChange: handleCategoryClick,
    resetFilter,
  } = useFilter({ initialFilter: "All" });

  const categories = [
    "All",
    "Music",
    "Arts & Culture",
    "Sports",
    "Food & Drink",
    "Cultural Festival",
    "Family",
    "Business",
  ];

  const filteredEvents = getPlacesByCategory("event", selectedCategory);

  const additionalContent = (
    <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        This Month's Highlights
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            December 2025
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Singapore Marathon (Dec 1)</li>
            <li>• Christmas Light-Up at Orchard Road</li>
            <li>• New Year's Eve Countdown at Marina Bay</li>
            <li>• Year-end shopping sales</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Upcoming Season
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Chinese New Year (Feb 2025)</li>
            <li>• Singapore Arts Festival (May 2025)</li>
            <li>• Singapore Food Festival (July 2025)</li>
            <li>• Singapore Grand Prix (Sep 2025)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <FilterablePage
      heroTitle="Experience Singapore's Vibrant Events"
      heroSubtitle="Concerts, festivals, exhibitions, and more – there's always something happening!"
      heroGradient="from-purple-600 to-blue-600"
      filterOptions={categories}
      selectedFilter={selectedCategory}
      onFilterChange={handleCategoryClick}
      onResetFilter={resetFilter}
      contentRef={contentRef}
      heroRef={heroRef}
      additionalContent={additionalContent}
    >
      {filteredEvents.map((event) => (
        <ContentCard
          key={event.id}
          name={event.name}
          description={event.description}
          image={event.image}
          imageAlt={event.name}
          rating={event.rating}
          reviews={event.reviews}
          distance={event.location}
          category={event.category}
          price={event.price}
          status={event.status}
        />
      ))}
    </FilterablePage>
  );
};

export default EventsPage;
