// Centralized place data for attractions, events, and food
// All coordinates are in [longitude, latitude] format for GeoJSON compatibility

export type PlaceType = "attraction" | "event" | "food";

export interface Place {
  id: string;
  type: PlaceType;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  category: string;
  price: string;
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  status?: string; // For events
}

// Attractions Data
export const attractions: Place[] = [
  {
    id: "attr-1",
    type: "attraction",
    name: "Marina Bay Sands",
    description:
      "Iconic integrated resort with luxury hotel, casino, shopping mall, and the famous infinity pool.",
    image: "/assets/attractions/marina-bay-sands.jpg",
    rating: 4.5,
    reviews: 12500,
    location: "Marina Bay",
    category: "Landmark",
    price: "S$20-50",
    coordinates: [103.8598, 1.2834],
    address: "10 Bayfront Avenue, Singapore 018956",
  },
  {
    id: "attr-2",
    type: "attraction",
    name: "Gardens by the Bay",
    description:
      "Award-winning nature park featuring the iconic Supertree Grove and climate-controlled conservatories.",
    image: "/assets/attractions/gardens-by-the-bay.jpg",
    rating: 4.7,
    reviews: 18900,
    location: "Marina Bay",
    category: "Nature",
    price: "S$8-28",
    coordinates: [103.8636, 1.2816],
    address: "18 Marina Gardens Drive, Singapore 018953",
  },
  {
    id: "attr-3",
    type: "attraction",
    name: "Singapore Flyer",
    description:
      "One of the world's largest observation wheels offering panoramic views of Singapore's skyline.",
    image: "/assets/attractions/singapore-flyer.jpg",
    rating: 4.2,
    reviews: 8900,
    location: "Marina Bay",
    category: "Landmark",
    price: "S$33",
    coordinates: [103.8631, 1.2894],
    address: "30 Raffles Avenue, Singapore 039803",
  },
  {
    id: "attr-4",
    type: "attraction",
    name: "Universal Studios Singapore",
    description:
      "Southeast Asia's only Universal Studios theme park with thrilling rides and attractions.",
    image: "/assets/attractions/sentosa-island.jpg",
    rating: 4.4,
    reviews: 25600,
    location: "Sentosa Island",
    category: "Theme Park",
    price: "S$79-89",
    coordinates: [103.8238, 1.254],
    address: "8 Sentosa Gateway, Sentosa Island, Singapore 098269",
  },
  {
    id: "attr-5",
    type: "attraction",
    name: "Singapore Zoo",
    description:
      "World-renowned zoo featuring over 2,800 animals in naturalistic habitats.",
    image: "/assets/attractions/singapore-zoo.jpg",
    rating: 4.6,
    reviews: 15200,
    location: "Mandai",
    category: "Nature",
    price: "S$37-41",
    coordinates: [103.7897, 1.4043],
    address: "80 Mandai Lake Road, Singapore 729826",
  },
  {
    id: "attr-6",
    type: "attraction",
    name: "Chinatown",
    description:
      "Historic district with traditional shophouses, temples, and authentic Chinese cuisine.",
    image: "/assets/attractions/chinatown.jpg",
    rating: 4.3,
    reviews: 9800,
    location: "Chinatown",
    category: "Cultural",
    price: "Free",
    coordinates: [103.8442, 1.2823],
    address: "Pagoda Street, Singapore 059192",
  },
  {
    id: "attr-7",
    type: "attraction",
    name: "Little India",
    description:
      "Vibrant cultural district with colorful temples, spice shops, and authentic Indian restaurants.",
    image: "/assets/attractions/little-india.jpg",
    rating: 4.1,
    reviews: 7200,
    location: "Little India",
    category: "Cultural",
    price: "Free",
    coordinates: [103.8519, 1.3068],
    address: "Serangoon Road, Singapore 218069",
  },
  {
    id: "attr-8",
    type: "attraction",
    name: "Singapore Botanic Gardens",
    description:
      "UNESCO World Heritage site featuring the National Orchid Garden and lush tropical landscapes.",
    image: "/assets/attractions/botanic-gardens.jpg",
    rating: 4.8,
    reviews: 11200,
    location: "Orchard",
    category: "Nature",
    price: "Free",
    coordinates: [103.8154, 1.3138],
    address: "1 Cluny Road, Singapore 259569",
  },
];

// Events Data
export const events: Place[] = [
  {
    id: "event-1",
    type: "event",
    name: "Singapore Grand Prix",
    description:
      "Formula 1 night race through the streets of Marina Bay, featuring world-class racing and entertainment.",
    image: "/assets/events/grand-prix.jpg",
    rating: 4.8,
    reviews: 12500,
    location: "Marina Bay Street Circuit",
    category: "Sports",
    price: "Ticketed",
    status: "Upcoming",
    coordinates: [103.8607, 1.2914],
    address: "Marina Bay Street Circuit, Singapore",
  },
  {
    id: "event-2",
    type: "event",
    name: "Singapore Arts Festival",
    description:
      "International performing arts festival showcasing contemporary dance, theatre, and music from around the world.",
    image: "/assets/events/arts-festival.jpg",
    rating: 4.6,
    reviews: 8900,
    location: "Multiple Venues",
    category: "Arts & Culture",
    price: "Mixed",
    status: "Upcoming",
    coordinates: [103.8565, 1.2897],
    address: "Various locations citywide",
  },
  {
    id: "event-3",
    type: "event",
    name: "Chinese New Year Celebrations",
    description:
      "Vibrant street parades, lion dances, and cultural performances in Chinatown and across the city.",
    image: "/assets/events/chinese-new-year.jpg",
    rating: 4.7,
    reviews: 15200,
    location: "Chinatown & Citywide",
    category: "Cultural Festival",
    price: "Free",
    status: "Upcoming",
    coordinates: [103.8442, 1.2823],
    address: "Chinatown, Singapore",
  },
  {
    id: "event-4",
    type: "event",
    name: "Singapore Food Festival",
    description:
      "Month-long celebration of Singapore's diverse culinary heritage with food tours, cooking classes, and special menus.",
    image: "/assets/events/food-festival.jpg",
    rating: 4.4,
    reviews: 9800,
    location: "Citywide",
    category: "Food & Drink",
    price: "Mixed",
    status: "Upcoming",
    coordinates: [103.8519, 1.2899],
    address: "Various locations citywide",
  },
  {
    id: "event-5",
    type: "event",
    name: "Mosaic Music Festival",
    description:
      "International music festival featuring jazz, world music, and contemporary performances by renowned artists.",
    image: "/assets/events/music-festival.jpg",
    rating: 4.5,
    reviews: 7200,
    location: "Esplanade Theatres",
    category: "Music",
    price: "Ticketed",
    status: "Upcoming",
    coordinates: [103.8556, 1.2901],
    address: "1 Esplanade Drive, Singapore 038981",
  },
  {
    id: "event-6",
    type: "event",
    name: "Singapore Marathon",
    description:
      "Annual running event through Singapore's iconic landmarks, featuring full marathon, half marathon, and 10K races.",
    image: "/assets/events/marathon.jpg",
    rating: 4.3,
    reviews: 11200,
    location: "Marina Bay",
    category: "Sports",
    price: "Ticketed",
    status: "Upcoming",
    coordinates: [103.8598, 1.2834],
    address: "Starting at F1 Pit Building, Singapore",
  },
  {
    id: "event-7",
    type: "event",
    name: "Deepavali Light-Up",
    description:
      "Festive illumination of Little India with colorful lights, cultural performances, and traditional celebrations.",
    image: "/assets/events/deepavali.jpg",
    rating: 4.2,
    reviews: 6800,
    location: "Little India",
    category: "Cultural Festival",
    price: "Free",
    status: "Upcoming",
    coordinates: [103.8519, 1.3068],
    address: "Serangoon Road, Little India, Singapore",
  },
  {
    id: "event-8",
    type: "event",
    name: "Singapore Night Festival",
    description:
      "Annual arts festival transforming the Bras Basah-Bugis precinct with light installations, performances, and interactive art.",
    image: "/assets/events/night-festival.jpg",
    rating: 4.6,
    reviews: 15200,
    location: "Bras Basah-Bugis",
    category: "Arts & Culture",
    price: "Free",
    status: "Upcoming",
    coordinates: [103.8526, 1.2967],
    address: "Bras Basah-Bugis Precinct, Singapore",
  },
];

// Food Data
export const food: Place[] = [
  {
    id: "food-1",
    type: "food",
    name: "Maxwell Food Centre",
    description:
      "Famous hawker centre known for Tian Tian Hainanese Chicken Rice and other local delicacies.",
    image: "/assets/food/maxwell-food-centre.jpg",
    rating: 4.3,
    reviews: 8900,
    location: "Chinatown",
    category: "Hawker",
    price: "S$3-8",
    coordinates: [103.8443, 1.2808],
    address: "1 Kadayanallur Street, Singapore 069184",
  },
  {
    id: "food-2",
    type: "food",
    name: "328 Katong Laksa",
    description:
      "Authentic Peranakan laksa with rich coconut curry broth and fresh ingredients.",
    image: "/assets/food/katong-laksa.jpg",
    rating: 4.5,
    reviews: 5600,
    location: "Katong",
    category: "Peranakan",
    price: "S$6-12",
    coordinates: [103.9027, 1.3048],
    address: "51 East Coast Road, Singapore 428770",
  },
  {
    id: "food-3",
    type: "food",
    name: "Newton Food Centre",
    description:
      "Popular hawker centre famous for satay, seafood, and local street food.",
    image: "/assets/food/lau-pa-sat.jpg",
    rating: 4.1,
    reviews: 7200,
    location: "Newton",
    category: "Hawker",
    price: "S$5-15",
    coordinates: [103.8384, 1.3133],
    address: "500 Clemenceau Avenue North, Singapore 229495",
  },
  {
    id: "food-4",
    type: "food",
    name: "Jumbo Seafood",
    description:
      "Award-winning restaurant specializing in Singapore's famous chili crab and seafood dishes.",
    image: "/assets/food/jumbo-seafood.jpg",
    rating: 4.4,
    reviews: 12300,
    location: "Multiple Locations",
    category: "Seafood",
    price: "S$50-100",
    coordinates: [103.8642, 1.2843],
    address: "1 Riverside Point, #01-01, Singapore 179024",
  },
  {
    id: "food-5",
    type: "food",
    name: "Tekka Centre",
    description:
      "Vibrant hawker centre in Little India serving authentic Indian and Malay cuisine.",
    image: "/assets/food/zam-zam.jpg",
    rating: 4.2,
    reviews: 6800,
    location: "Little India",
    category: "Indian",
    price: "S$4-10",
    coordinates: [103.8506, 1.3055],
    address: "665 Buffalo Road, Singapore 210665",
  },
  {
    id: "food-6",
    type: "food",
    name: "Din Tai Fung",
    description:
      "World-renowned Taiwanese restaurant chain famous for xiao long bao and dumplings.",
    image: "/assets/food/din-tai-fung.jpg",
    rating: 4.6,
    reviews: 15200,
    location: "Multiple Locations",
    category: "Chinese",
    price: "S$20-40",
    coordinates: [103.8359, 1.3021],
    address: "290 Orchard Road, Paragon #B1-03/08, Singapore 238859",
  },
  {
    id: "food-7",
    type: "food",
    name: "Lau Pa Sat",
    description:
      "Historic hawker centre in the heart of the financial district, famous for satay.",
    image: "/assets/food/lau-pa-sat.jpg",
    rating: 4.0,
    reviews: 9400,
    location: "Raffles Place",
    category: "Hawker",
    price: "S$5-12",
    coordinates: [103.8504, 1.2805],
    address: "18 Raffles Quay, Singapore 048582",
  },
  {
    id: "food-8",
    type: "food",
    name: "Candlenut",
    description:
      "Michelin-starred restaurant serving modern Peranakan cuisine with contemporary flair.",
    image: "/assets/food/odette.jpg",
    rating: 4.7,
    reviews: 2100,
    location: "Dempsey Hill",
    category: "Peranakan",
    price: "S$80-150",
    coordinates: [103.8092, 1.3045],
    address: "17A Dempsey Road, Singapore 249676",
  },
];

// Combined data
export const allPlaces: Place[] = [...attractions, ...events, ...food];

// Helper functions to filter data
export const getPlacesByType = (type: PlaceType): Place[] => {
  return allPlaces.filter((place) => place.type === type);
};

export const getPlacesByCategory = (
  type: PlaceType,
  category: string,
): Place[] => {
  if (category === "All") {
    return getPlacesByType(type);
  }
  return allPlaces.filter(
    (place) => place.type === type && place.category === category,
  );
};

export const getPlaceById = (id: string): Place | undefined => {
  return allPlaces.find((place) => place.id === id);
};

// Convert to GeoJSON Feature Collection
export const toGeoJSON = (
  places: Place[],
): GeoJSON.FeatureCollection<GeoJSON.Point> => {
  return {
    type: "FeatureCollection",
    features: places.map((place) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: place.coordinates,
      },
      properties: {
        id: place.id,
        type: place.type,
        name: place.name,
        description: place.description,
        image: place.image,
        rating: place.rating,
        reviews: place.reviews,
        location: place.location,
        category: place.category,
        price: place.price,
        address: place.address,
        status: place.status,
      },
    })),
  };
};

// Export GeoJSON for all places
export const allPlacesGeoJSON = toGeoJSON(allPlaces);
export const attractionsGeoJSON = toGeoJSON(attractions);
export const eventsGeoJSON = toGeoJSON(events);
export const foodGeoJSON = toGeoJSON(food);
