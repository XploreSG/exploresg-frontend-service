import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";

const EventsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
      date: "September 20-22, 2024",
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      date: "May 15-30, 2024",
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
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      date: "February 10-24, 2024",
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
      image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80",
      date: "July 12-28, 2024",
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
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      date: "March 8-10, 2024",
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
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      date: "December 1, 2024",
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
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
      date: "October 20 - November 15, 2024",
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      date: "August 23-31, 2024",
      time: "7:00 PM - 2:00 AM",
      venue: "Bras Basah-Bugis",
      category: "Arts & Culture",
      price: "Free",
      status: "Upcoming"
    }
  ];

  const categories = ["All", "Music", "Arts & Culture", "Sports", "Food & Drink", "Cultural Festival", "Family", "Business"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-96 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Experience Singapore's Vibrant Events</h1>
          <p className="text-xl md:text-2xl mb-8">Concerts, festivals, exhibitions, and more – there's always something happening!</p>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-white shadow-md hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {events.map((event) => (
            <div key={event.id} className="event-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                  {event.price}
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Find Tickets
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Highlights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">This Month's Highlights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">December 2024</h3>
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
                <li>• Chinese New Year (Feb 2024)</li>
                <li>• Singapore Arts Festival (May 2024)</li>
                <li>• Singapore Food Festival (July 2024)</li>
                <li>• Singapore Grand Prix (Sep 2024)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Event CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Submit Your Event</h2>
          <p className="text-xl mb-6">Are you organizing an event in Singapore? Let us know and we'll help promote it!</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Submit Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;