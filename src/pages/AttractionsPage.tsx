import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";

const AttractionsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      location: "Changi",
      rating: 4.7,
      reviews: 19800,
      hours: "24/7",
      category: "Shopping",
      price: "Free"
    }
  ];

  const categories = ["All", "Landmark", "Nature", "Entertainment", "Culture", "Shopping"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-96 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Singapore's Iconic Attractions</h1>
          <p className="text-xl md:text-2xl mb-8">From lush gardens to thrilling theme parks, explore the best of the Lion City</p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-white shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="attraction-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold">
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
                
                <button className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Learn More
                </button>
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