import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";

const FoodPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedFilter: selectedCuisine, handleFilterChange: handleCuisineClick, resetFilter } = useFilter({ initialFilter: "All" });

  const eateries = [
    {
      id: 1,
      name: "Maxwell Food Centre",
      description: "Famous hawker centre known for Tian Tian Hainanese Chicken Rice and other local delicacies.",
      image: "/assets/food/maxwell-food-centre.jpg",
      rating: 4.3,
      reviews: 8900,
      location: "Chinatown",
      cuisine: "Hawker",
      priceRange: "S$3-8"
    },
    {
      id: 2,
      name: "328 Katong Laksa",
      description: "Authentic Peranakan laksa with rich coconut curry broth and fresh ingredients.",
      image: "/assets/food/katong-laksa.jpg",
      rating: 4.5,
      reviews: 5600,
      location: "Katong",
      cuisine: "Peranakan",
      priceRange: "S$6-12"
    },
    {
      id: 3,
      name: "Newton Food Centre",
      description: "Popular hawker centre famous for satay, seafood, and local street food.",
      image: "/assets/food/lau-pa-sat.jpg",
      rating: 4.1,
      reviews: 7200,
      location: "Newton",
      cuisine: "Hawker",
      priceRange: "S$5-15"
    },
    {
      id: 4,
      name: "Jumbo Seafood",
      description: "Award-winning restaurant specializing in Singapore's famous chili crab and seafood dishes.",
      image: "/assets/food/jumbo-seafood.jpg",
      rating: 4.4,
      reviews: 12300,
      location: "Multiple Locations",
      cuisine: "Seafood",
      priceRange: "S$50-100"
    },
    {
      id: 5,
      name: "Tekka Centre",
      description: "Vibrant hawker centre in Little India serving authentic Indian and Malay cuisine.",
      image: "/assets/food/zam-zam.jpg",
      rating: 4.2,
      reviews: 6800,
      location: "Little India",
      cuisine: "Indian",
      priceRange: "S$4-10"
    },
    {
      id: 6,
      name: "Din Tai Fung",
      description: "World-renowned Taiwanese restaurant chain famous for xiao long bao and dumplings.",
      image: "/assets/food/din-tai-fung.jpg",
      rating: 4.6,
      reviews: 15200,
      location: "Multiple Locations",
      cuisine: "Chinese",
      priceRange: "S$20-40"
    },
    {
      id: 7,
      name: "Lau Pa Sat",
      description: "Historic hawker centre in the heart of the financial district, famous for satay.",
      image: "/assets/food/lau-pa-sat.jpg",
      rating: 4.0,
      reviews: 9400,
      location: "Raffles Place",
      cuisine: "Hawker",
      priceRange: "S$5-12"
    },
    {
      id: 8,
      name: "Candlenut",
      description: "Michelin-starred restaurant serving modern Peranakan cuisine with contemporary flair.",
      image: "/assets/food/odette.jpg",
      rating: 4.7,
      reviews: 2100,
      location: "Dempsey Hill",
      cuisine: "Peranakan",
      priceRange: "S$80-150"
    }
  ];

  const cuisines = ["All", "Hawker", "Chinese", "Indian", "Malay", "Peranakan", "Seafood", "Western", "Japanese", "Korean"];

  const filteredEateries = selectedCuisine === "All" 
    ? eateries 
    : eateries.filter(eatery => eatery.cuisine === selectedCuisine);

  const additionalContent = (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dining Tips in Singapore</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Hawker Centre Etiquette</h3>
          <p className="mb-2">"Choping" (reserving) seats with tissue packets is common. Join queues, especially for popular stalls, as it often indicates good food.</p>
          <p>Return your trays and clear your table after eating to help keep the hawker centres clean.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Must-Try Dishes</h3>
          <p className="mb-2">Don't leave Singapore without trying Chili Crab, Laksa, Hainanese Chicken Rice, Satay, and Char Kway Teow.</p>
          <p>Explore different cuisines from Malay, Indian, Chinese, and Peranakan influences.</p>
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
          name={eatery.name}
          description={eatery.description}
          image={eatery.image}
          imageAlt={eatery.name}
          rating={eatery.rating}
          reviews={eatery.reviews}
          distance={eatery.location}
          category={eatery.cuisine}
          price={eatery.priceRange}
        />
      ))}
    </FilterablePage>
  );
};

export default FoodPage;