import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";

const AttractionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedFilter: selectedCategory, handleFilterChange: handleCategoryClick, resetFilter } = useFilter({ initialFilter: "All" });

  const attractions = [
    {
      id: 1,
      name: "Marina Bay Sands",
      description: "Iconic integrated resort with luxury hotel, casino, shopping mall, and the famous infinity pool.",
      image: "/assets/attractions/marina-bay-sands.jpg",
      rating: 4.5,
      reviews: 12500,
      location: "Marina Bay",
      category: "Landmark",
      price: "S$20-50"
    },
    {
      id: 2,
      name: "Gardens by the Bay",
      description: "Award-winning nature park featuring the iconic Supertree Grove and climate-controlled conservatories.",
      image: "/assets/attractions/gardens-by-the-bay.jpg",
      rating: 4.7,
      reviews: 18900,
      location: "Marina Bay",
      category: "Nature",
      price: "S$8-28"
    },
    {
      id: 3,
      name: "Singapore Flyer",
      description: "One of the world's largest observation wheels offering panoramic views of Singapore's skyline.",
      image: "/assets/attractions/singapore-flyer.jpg",
      rating: 4.2,
      reviews: 8900,
      location: "Marina Bay",
      category: "Landmark",
      price: "S$33"
    },
    {
      id: 4,
      name: "Universal Studios Singapore",
      description: "Southeast Asia's only Universal Studios theme park with thrilling rides and attractions.",
      image: "/assets/attractions/sentosa-island.jpg",
      rating: 4.4,
      reviews: 25600,
      location: "Sentosa Island",
      category: "Theme Park",
      price: "S$79-89"
    },
    {
      id: 5,
      name: "Singapore Zoo",
      description: "World-renowned zoo featuring over 2,800 animals in naturalistic habitats.",
      image: "/assets/attractions/singapore-zoo.jpg",
      rating: 4.6,
      reviews: 15200,
      location: "Mandai",
      category: "Nature",
      price: "S$37-41"
    },
    {
      id: 6,
      name: "Chinatown",
      description: "Historic district with traditional shophouses, temples, and authentic Chinese cuisine.",
      image: "/assets/attractions/chinatown.jpg",
      rating: 4.3,
      reviews: 9800,
      location: "Chinatown",
      category: "Cultural",
      price: "Free"
    },
    {
      id: 7,
      name: "Little India",
      description: "Vibrant cultural district with colorful temples, spice shops, and authentic Indian restaurants.",
      image: "/assets/attractions/little-india.jpg",
      rating: 4.1,
      reviews: 7200,
      location: "Little India",
      category: "Cultural",
      price: "Free"
    },
    {
      id: 8,
      name: "Singapore Botanic Gardens",
      description: "UNESCO World Heritage site featuring the National Orchid Garden and lush tropical landscapes.",
      image: "/assets/attractions/botanic-gardens.jpg",
      rating: 4.8,
      reviews: 11200,
      location: "Orchard",
      category: "Nature",
      price: "Free"
    }
  ];

  const categories = ["All", "Landmark", "Nature", "Theme Park", "Cultural", "Museum", "Religious", "Shopping"];

  const filteredAttractions = selectedCategory === "All" 
    ? attractions 
    : attractions.filter(attraction => attraction.category === selectedCategory);

  const additionalContent = (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Plan Your Visit</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Getting Around</h3>
          <p className="mb-2">Singapore has an excellent public transportation system. The MRT (Mass Rapid Transit) is the most efficient way to get to most attractions.</p>
          <p>Consider purchasing an EZ-Link card or a Singapore Tourist Pass for hassle-free travel.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Best Time to Visit</h3>
          <p className="mb-2">Singapore is a year-round destination, but the cooler months from February to April are often preferred. Avoid the haze season (June to September) if possible.</p>
          <p>Check local weather forecasts and event calendars before your trip.</p>
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
        />
      ))}
    </FilterablePage>
  );
};

export default AttractionsPage;