import React, { useRef, useState } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";

const AttractionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  usePageAnimations({
    heroRef,
    contentRef,
    contentSelector: ".attraction-card",
    staggerDelay: 0.1
  });

  const attractions = [
    {
      id: 1,
      name: "Marina Bay Sands",
      description: "Iconic integrated resort with stunning architecture, luxury shopping, and the famous infinity pool.",
      image: "/assets/attractions/marina-bay-sands.jpg",
      location: "Marina Bay",
      rating: 4.7,
      reviews: 12500,
      hours: "24/7",
      category: "Landmark",
      price: "$$$"
    },
    {
      id: 2,
      name: "Gardens by the Bay",
      description: "Award-winning nature park featuring the iconic Supertree Grove and climate-controlled conservatories.",
      image: "/assets/attractions/gardens-by-the-bay.jpg",
      location: "Marina Bay",
      rating: 4.8,
      reviews: 18500,
      hours: "5:00 AM - 2:00 AM",
      category: "Nature",
      price: "$$"
    },
    {
      id: 3,
      name: "Sentosa Island",
      description: "Singapore's premier island resort with Universal Studios, beaches, and world-class attractions.",
      image: "/assets/attractions/sentosa-island.jpg",
      location: "Sentosa",
      rating: 4.6,
      reviews: 22000,
      hours: "10:00 AM - 7:00 PM",
      category: "Entertainment",
      price: "$$$"
    },
    {
      id: 4,
      name: "Singapore Zoo",
      description: "World's best rainforest zoo with open-concept exhibits and the famous Night Safari.",
      image: "/assets/attractions/singapore-zoo.jpg",
      location: "Mandai",
      rating: 4.5,
      reviews: 16800,
      hours: "8:30 AM - 6:00 PM",
      category: "Nature",
      price: "$$"
    },
    {
      id: 5,
      name: "Chinatown",
      description: "Vibrant cultural district with traditional shophouses, temples, and authentic local cuisine.",
      image: "/assets/attractions/chinatown.jpg",
      location: "Chinatown",
      rating: 4.4,
      reviews: 9800,
      hours: "24/7",
      category: "Culture",
      price: "Free"
    },
    {
      id: 6,
      name: "Singapore Flyer",
      description: "World's largest observation wheel offering panoramic views of Singapore's skyline.",
      image: "/assets/attractions/singapore-flyer.jpg",
      location: "Marina Bay",
      rating: 4.3,
      reviews: 11200,
      hours: "8:30 AM - 10:30 PM",
      category: "Landmark",
      price: "$$"
    },
    {
      id: 7,
      name: "Botanic Gardens",
      description: "UNESCO World Heritage Site featuring the National Orchid Garden and lush tropical landscapes.",
      image: "/assets/attractions/botanic-gardens.jpg",
      location: "Tanglin",
      rating: 4.6,
      reviews: 14500,
      hours: "5:00 AM - 12:00 AM",
      category: "Nature",
      price: "Free"
    },
    {
      id: 8,
      name: "Jewel Changi Airport",
      description: "World-class lifestyle destination with the iconic Rain Vortex and Canopy Park.",
      image: "/assets/attractions/jewel-changi.jpg",
      location: "Changi",
      rating: 4.7,
      reviews: 19800,
      hours: "24/7",
      category: "Shopping",
      price: "Free"
    }
  ];

  const categories = ["All", "Landmark", "Nature", "Entertainment", "Culture", "Shopping"];

  const filteredAttractions = selectedCategory === "All" 
    ? attractions 
    : attractions.filter(attraction => attraction.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const resetFilter = () => {
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">Discover Singapore's Iconic Attractions</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8">From lush gardens to thrilling theme parks, explore the best of the Lion City</p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Categories Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 sm:px-4 md:px-6 py-2 text-xs sm:text-sm md:text-base rounded-full shadow-md transition-colors ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-white hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategory !== "All" && (
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

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filteredAttractions.map((attraction) => (
            <div key={attraction.id} className="attraction-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold shadow-md">
                  {attraction.price}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{attraction.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm font-semibold">{attraction.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-4">📍 {attraction.location}</span>
                  <span>🕒 {attraction.hours}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">({attraction.reviews.toLocaleString()} reviews)</span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                    {attraction.category}
                  </span>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Visitor Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Visitor Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Best Time to Visit</h3>
              <p className="text-gray-600">
                Singapore is a year-round destination. The best time to visit is from December to June 
                when the weather is relatively dry and pleasant.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Around</h3>
              <p className="text-gray-600">
                Use the efficient MRT system, buses, or taxis. Most attractions are easily accessible 
                by public transport with clear signage in English.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ticket Information</h3>
              <p className="text-gray-600">
                Book tickets online in advance for popular attractions. Consider attraction passes 
                for multiple visits and better value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionsPage;