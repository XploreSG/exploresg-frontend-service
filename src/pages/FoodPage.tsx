import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";
import { useFilter } from "../hooks/useFilter";

const FoodPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedFilter: selectedCuisine, handleFilterChange: handleCuisineClick, resetFilter } = useFilter({ initialFilter: "All" });

  usePageAnimations({
    heroRef,
    contentRef,
    contentSelector: ".food-card",
    staggerDelay: 0.1
  });

  const eateries = [
    {
      id: 1,
      name: "Maxwell Food Centre",
      description: "Famous hawker centre known for Tian Tian Hainanese Chicken Rice and authentic local dishes.",
      image: "/assets/food/maxwell-food-centre.jpg",
      cuisine: "Local Hawker",
      location: "Chinatown",
      rating: 4.5,
      reviews: 8500,
      priceRange: "$",
      specialty: "Chicken Rice, Char Kway Teow"
    },
    {
      id: 2,
      name: "Lau Pa Sat",
      description: "Historic hawker centre in the heart of the financial district, famous for satay and local delicacies.",
      image: "/assets/food/lau-pa-sat.jpg",
      cuisine: "Local Hawker",
      location: "Raffles Place",
      rating: 4.3,
      reviews: 6200,
      priceRange: "$",
      specialty: "Satay, Laksa, Roti Prata"
    },
    {
      id: 3,
      name: "Jumbo Seafood",
      description: "World-famous for Singapore's signature Chili Crab and other premium seafood dishes.",
      image: "/assets/food/jumbo-seafood.jpg",
      cuisine: "Seafood",
      location: "Multiple Locations",
      rating: 4.6,
      reviews: 12800,
      priceRange: "$$$",
      specialty: "Chili Crab, Black Pepper Crab"
    },
    {
      id: 4,
      name: "328 Katong Laksa",
      description: "Legendary laksa stall serving the original Katong laksa with thick rice noodles and rich coconut gravy.",
      image: "/assets/food/katong-laksa.jpg",
      cuisine: "Peranakan",
      location: "Katong",
      rating: 4.4,
      reviews: 4200,
      priceRange: "$",
      specialty: "Katong Laksa, Otah"
    },
    {
      id: 5,
      name: "Din Tai Fung",
      description: "Internationally acclaimed Taiwanese restaurant famous for xiao long bao and authentic dumplings.",
      image: "/assets/food/din-tai-fung.jpg",
      cuisine: "Chinese",
      location: "Multiple Locations",
      rating: 4.7,
      reviews: 15200,
      priceRange: "$$",
      specialty: "Xiao Long Bao, Fried Rice"
    },
    {
      id: 6,
      name: "The Coconut Club",
      description: "Modern Singaporean restaurant reimagining classic dishes with contemporary flair and fresh ingredients.",
      image: "/assets/food/coconut-club.jpg",
      cuisine: "Modern Singaporean",
      location: "Ann Siang Hill",
      rating: 4.5,
      reviews: 3800,
      priceRange: "$$",
      specialty: "Nasi Lemak, Rendang"
    },
    {
      id: 7,
      name: "Zam Zam Restaurant",
      description: "Historic Indian-Muslim restaurant serving authentic murtabak, biryani, and traditional curries.",
      image: "/assets/food/zam-zam.jpg",
      cuisine: "Indian-Muslim",
      location: "Arab Street",
      rating: 4.2,
      reviews: 5600,
      priceRange: "$",
      specialty: "Murtabak, Briyani, Teh Tarik"
    },
    {
      id: 8,
      name: "Odette",
      description: "Three-Michelin-starred fine dining restaurant offering contemporary French cuisine with Asian influences.",
      image: "/assets/food/odette.jpg",
      cuisine: "Fine Dining",
      location: "National Gallery",
      rating: 4.8,
      reviews: 2100,
      priceRange: "$$$$",
      specialty: "Tasting Menu, Wine Pairing"
    }
  ];

  const cuisines = ["All", "Local Hawker", "Chinese", "Indian-Muslim", "Peranakan", "Seafood", "Fine Dining", "Modern Singaporean"];

  const filteredEateries = selectedCuisine === "All" 
    ? eateries 
    : eateries.filter(eatery => eatery.cuisine === selectedCuisine);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">Savor Singapore: A Culinary Adventure</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8">From Michelin-starred hawker stalls to fine dining, taste the diverse flavors of the city</p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Cuisine Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineClick(cuisine)}
                className={`px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm md:text-base rounded-full shadow-md transition-colors ${
                  selectedCuisine === cuisine
                    ? "bg-orange-600 text-white"
                    : "bg-white hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {cuisine}
              </button>
            ))}
            {selectedCuisine !== "All" && (
              <button
                onClick={resetFilter}
                className="ml-2 px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800"
                title="Reset filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Eateries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filteredEateries.map((eatery) => (
            <div key={eatery.id} className="food-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <img
                  src={eatery.image}
                  alt={eatery.name}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold shadow-md">
                  {eatery.priceRange}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{eatery.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm font-semibold">{eatery.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{eatery.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-4">📍 {eatery.location}</span>
                  <span>🍽️ {eatery.cuisine}</span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700 font-medium">Specialty: {eatery.specialty}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500">({eatery.reviews.toLocaleString()} reviews)</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                    {eatery.cuisine}
                  </span>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Dining Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Dining Tips & Etiquette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hawker Etiquette</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Use tissue packets to "chope" (reserve) seats</li>
                <li>• Clear your own table after eating</li>
                <li>• Bring cash as most stalls don't accept cards</li>
                <li>• Be patient during peak hours</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Must-Try Dishes</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Hainanese Chicken Rice</li>
                <li>• Laksa (spicy noodle soup)</li>
                <li>• Chili Crab</li>
                <li>• Char Kway Teow</li>
                <li>• Satay</li>
                <li>• Roti Prata</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Dietary Needs</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Halal options widely available</li>
                <li>• Vegetarian restaurants in Little India</li>
                <li>• Vegan options at modern cafes</li>
                <li>• Gluten-free options available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPage;