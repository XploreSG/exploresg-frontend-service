import React, { useRef } from "react";
import FilterablePage from "../components/FilterablePage";
import ContentCard from "../components/ContentCard";
import { useFilter } from "../hooks/useFilter";

const EventsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedFilter: selectedCategory, handleFilterChange: handleCategoryClick, resetFilter } = useFilter({ initialFilter: "All" });

  const events = [
    {
      id: 1,
      name: "Singapore Grand Prix",
      description: "Formula 1 night race through the streets of Marina Bay, featuring world-class racing and entertainment.",
      image: "/assets/events/grand-prix.jpg",
      rating: 4.8,
      reviews: 12500,
      location: "Marina Bay Street Circuit",
      category: "Sports",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 2,
      name: "Singapore Arts Festival",
      description: "International performing arts festival showcasing contemporary dance, theatre, and music from around the world.",
      image: "/assets/events/arts-festival.jpg",
      rating: 4.6,
      reviews: 8900,
      location: "Multiple Venues",
      category: "Arts & Culture",
      price: "Mixed",
      status: "Upcoming"
    },
    {
      id: 3,
      name: "Chinese New Year Celebrations",
      description: "Vibrant street parades, lion dances, and cultural performances in Chinatown and across the city.",
      image: "/assets/events/chinese-new-year.jpg",
      rating: 4.7,
      reviews: 15200,
      location: "Chinatown & Citywide",
      category: "Cultural Festival",
      price: "Free",
      status: "Upcoming"
    },
    {
      id: 4,
      name: "Singapore Food Festival",
      description: "Month-long celebration of Singapore's diverse culinary heritage with food tours, cooking classes, and special menus.",
      image: "/assets/events/food-festival.jpg",
      rating: 4.4,
      reviews: 9800,
      location: "Citywide",
      category: "Food & Drink",
      price: "Mixed",
      status: "Upcoming"
    },
    {
      id: 5,
      name: "Mosaic Music Festival",
      description: "International music festival featuring jazz, world music, and contemporary performances by renowned artists.",
      image: "/assets/events/music-festival.jpg",
      rating: 4.5,
      reviews: 7200,
      location: "Esplanade Theatres",
      category: "Music",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 6,
      name: "Singapore Marathon",
      description: "Annual running event through Singapore's iconic landmarks, featuring full marathon, half marathon, and 10K races.",
      image: "/assets/events/marathon.jpg",
      rating: 4.3,
      reviews: 11200,
      location: "Marina Bay",
      category: "Sports",
      price: "Ticketed",
      status: "Upcoming"
    },
    {
      id: 7,
      name: "Deepavali Light-Up",
      description: "Festive illumination of Little India with colorful lights, cultural performances, and traditional celebrations.",
      image: "/assets/events/deepavali.jpg",
      rating: 4.2,
      reviews: 6800,
      location: "Little India",
      category: "Cultural Festival",
      price: "Free",
      status: "Upcoming"
    },
    {
      id: 8,
      name: "Singapore Night Festival",
      description: "Annual arts festival transforming the Bras Basah-Bugis precinct with light installations, performances, and interactive art.",
      image: "/assets/events/night-festival.jpg",
      rating: 4.6,
      reviews: 15200,
      location: "Bras Basah-Bugis",
      category: "Arts & Culture",
      price: "Free",
      status: "Upcoming"
    }
  ];

  const categories = ["All", "Music", "Arts & Culture", "Sports", "Food & Drink", "Cultural Festival", "Family", "Business"];

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const additionalContent = (
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