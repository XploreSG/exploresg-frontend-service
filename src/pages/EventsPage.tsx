import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";
import { useFilter } from "../hooks/useFilter";

const EventsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedFilter: selectedCategory, handleFilterChange: handleCategoryClick, resetFilter } = useFilter({ initialFilter: "All" });

  usePageAnimations({
    heroRef,
    contentRef,
    contentSelector: ".event-card",
    staggerDelay: 0.1
  });

  const events = [
    {
      id: 1,
      name: "Singapore Grand Prix",
      description: "Formula 1 night race through the streets of Marina Bay, featuring world-class racing and entertainment.",
      image: "/assets/events/grand-prix.jpg",
      date: "September 20-22, 2025",
      time: "8:00 PM",
      venue: "Marina Bay Street Circuit",
      category: "Sports",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 2,
      name: "Singapore Arts Festival",
      description: "International performing arts festival showcasing contemporary dance, theatre, and music from around the world.",
      image: "/assets/events/arts-festival.jpg",
      date: "May 15-30, 2025",
      time: "Various Times",
      venue: "Multiple Venues",
      category: "Arts & Culture",
      price: "Mixed",
      status: "Upcoming"
    },
    {
      id: 3,
      name: "Chinese New Year Celebrations",
      description: "Vibrant street parades, lion dances, and cultural performances in Chinatown and across the city.",
      image: "/assets/events/chinese-new-year.jpg",
      date: "February 10-24, 2025",
      time: "Various Times",
      venue: "Chinatown & Citywide",
      category: "Cultural Festival",
      price: "Free",
      status: "Upcoming"
    },
    {
      id: 4,
      name: "Singapore Food Festival",
      description: "Month-long celebration of Singapore's diverse culinary heritage with food tours, cooking classes, and special menus.",
      image: "/assets/events/food-festival.jpg",
      date: "July 12-28, 2025",
      time: "Various Times",
      venue: "Citywide",
      category: "Food & Drink",
      price: "Mixed",
      status: "Upcoming"
    },
    {
      id: 5,
      name: "Mosaic Music Festival",
      description: "International music festival featuring jazz, world music, and contemporary performances by renowned artists.",
      image: "/assets/events/music-festival.jpg",
      date: "March 8-10, 2025",
      time: "7:00 PM - 11:00 PM",
      venue: "Esplanade Theatres",
      category: "Music",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 6,
      name: "Singapore Marathon",
      description: "Annual running event through Singapore's iconic landmarks, featuring full marathon, half marathon, and 10K races.",
      image: "/assets/events/marathon.jpg",
      date: "December 1, 2025",
      time: "5:00 AM",
      venue: "Marina Bay",
      category: "Sports",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 7,
      name: "Deepavali Light-Up",
      description: "Festive illumination of Little India with colorful lights, cultural performances, and traditional celebrations.",
      image: "/assets/events/deepavali.jpg",
      date: "October 20 - November 15, 2025",
      time: "7:00 PM - 12:00 AM",
      venue: "Little India",
      category: "Cultural Festival",
      price: "Free",
      status: "Upcoming"
    },
    {
      id: 8,
      name: "Singapore Night Festival",
      description: "Annual arts festival transforming the Bras Basah-Bugis precinct with light installations, performances, and interactive art.",
      image: "/assets/events/night-festival.jpg",
      date: "August 23-31, 2025",
      time: "7:00 PM - 2:00 AM",
      venue: "Bras Basah-Bugis",
      category: "Arts & Culture",
      price: "Free",
      status: "Upcoming"
    }
  ];

  const categories = ["All", "Music", "Arts & Culture", "Sports", "Food & Drink", "Cultural Festival", "Family", "Business"];

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">Experience Singapore's Vibrant Events</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8">Concerts, festivals, exhibitions, and more – there's always something happening!</p>
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
                    ? "bg-purple-600 text-white"
                    : "bg-white hover:bg-purple-50 hover:text-purple-600"
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold shadow-md">
                  {event.price}
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                  {event.status}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{event.venue}</span>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">This Month's Highlights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">December 2025</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Singapore Marathon (Dec 1)</li>
                <li>• Christmas Light-Up at Orchard Road</li>
                <li>• New Year's Eve Countdown at Marina Bay</li>
                <li>• Year-end shopping sales</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Season</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Chinese New Year (Feb 2025)</li>
                <li>• Singapore Arts Festival (May 2025)</li>
                <li>• Singapore Food Festival (July 2025)</li>
                <li>• Singapore Grand Prix (Sep 2025)</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventsPage;