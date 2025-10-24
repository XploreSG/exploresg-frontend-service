import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";
import { getPlacesByCategory } from "../data/places";

const FoodPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    selectedFilter: selectedCuisine,
    handleFilterChange: handleCuisineClick,
    resetFilter,
  } = useFilter({ initialFilter: "All" });

  const cuisines = [
    "All",
    "Hawker",
    "Chinese",
    "Indian",
    "Malay",
    "Peranakan",
    "Seafood",
    "Western",
    "Japanese",
    "Korean",
  ];

  const filteredEateries = getPlacesByCategory("food", selectedCuisine);

  const additionalContent = (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Dining Tips in Singapore
      </h2>
      <div className="grid grid-cols-1 gap-8 text-gray-700 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Hawker Centre Etiquette
          </h3>
          <p className="mb-2">
            "Choping" (reserving) seats with tissue packets is common. Join
            queues, especially for popular stalls, as it often indicates good
            food.
          </p>
          <p>
            Return your trays and clear your table after eating to help keep the
            hawker centres clean.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            Must-Try Dishes
          </h3>
          <p className="mb-2">
            Don't leave Singapore without trying Chili Crab, Laksa, Hainanese
            Chicken Rice, Satay, and Char Kway Teow.
          </p>
          <p>
            Explore different cuisines from Malay, Indian, Chinese, and
            Peranakan influences.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <FilterablePage
      heroTitle="Savor Singapore: A Culinary Adventure"
      heroSubtitle="From Michelin-starred hawker stalls to fine dining, taste the diverse flavors of the city"
      heroGradient="from-orange-600 to-red-600"
      filterOptions={cuisines}
      selectedFilter={selectedCuisine}
      onFilterChange={handleCuisineClick}
      onResetFilter={resetFilter}
      contentRef={contentRef}
      heroRef={heroRef}
      additionalContent={additionalContent}
    >
      {filteredEateries.map((eatery) => (
        <ContentCard
          key={eatery.id}
          id={eatery.id}
          name={eatery.name}
          description={eatery.description}
          image={eatery.image}
          imageAlt={eatery.name}
          rating={eatery.rating}
          reviews={eatery.reviews}
          distance={eatery.location}
          category={eatery.category}
          price={eatery.price}
          type={eatery.type}
        />
      ))}
    </FilterablePage>
  );
};

export default FoodPage;
