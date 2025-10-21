import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";

const FoodPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
      cuisine: "Fine Dining",
      location: "National Gallery",
      rating: 4.8,
      reviews: 2100,
      priceRange: "$$$$",
      specialty: "Tasting Menu, Wine Pairing"
    }
  ];

  const cuisines = ["All", "Local Hawker", "Chinese", "Indian-Muslim", "Peranakan", "Seafood", "Fine Dining", "Modern Singaporean"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-96 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Savor Singapore: A Culinary Adventure</h1>
          <p className="text-xl md:text-2xl mb-8">From Michelin-starred hawker stalls to fine dining, taste the diverse flavors of the city</p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-12">
        {/* Cuisine Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                className="px-6 py-2 rounded-full bg-white shadow-md hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Eateries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {eateries.map((eatery) => (
            <div key={eatery.id} className="food-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img
                  src={eatery.image}
                  alt={eatery.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold">
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
                
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  View Menu
                </button>
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