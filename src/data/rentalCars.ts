export interface RentalCarData {
  id: string;
  model: string;
  seats: number;
  luggage: number;
  originalPrice?: number;
  price: number;
  promoText?: string;
  imageUrl: string;
  operator: string;
  operatorStyling: string;
  category: string;
}

export const RENTAL_CARS: RentalCarData[] = [
  {
    id: "skoda-octavia-1",
    model: "Skoda Octavia or similar",
    seats: 5,
    luggage: 4,
    originalPrice: 120,
    price: 100,
    promoText: "Hot",
    imageUrl: "/assets/skoda-octavia.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "compact",
  },
  {
    id: "nissan-sentra-1",
    model: "Nissan Sentra or similar",
    seats: 4,
    luggage: 2,
    originalPrice: 90,
    price: 50,
    promoText: "Hot",
    imageUrl: "/assets/nissan-sentra.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "economy",
  },
  {
    id: "bmw-z4-1",
    model: "BMW Z4 or similar",
    seats: 2,
    luggage: 2,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-z4.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "luxury-sports",
  },
  {
    id: "bmw-m440i-1",
    model: "BMW M440i or similar",
    seats: 4,
    luggage: 2,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-440i.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "luxury",
  },
  {
    id: "porsche-911-1",
    model: "Porsche 911 Carrera or similar",
    seats: 2,
    luggage: 2,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/porsche-911-c.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "luxury-sports",
  },
  {
    id: "amg-sl63-1",
    model: "AMG SL63 or similar",
    seats: 2,
    luggage: 2,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    // promoText: "Hot",
    imageUrl: "/assets/merc-sl63.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "luxury-sports",
  },
  {
    id: "alphard-hertz-1",
    model: "Toyota Alphard or similar",
    seats: 7,
    luggage: 2,
    originalPrice: 290,
    price: 250,
    promoText: "Hot",
    imageUrl: "/assets/alphard.png",
    operator: "Hertz",
    operatorStyling: "text-yellow-400",
    category: "van",
  },
  {
    id: "alphard-sixt-1",
    model: "Toyota Alphard or similar",
    seats: 7,
    luggage: 2,
    originalPrice: 290,
    price: 250,
    promoText: "Hot",
    imageUrl: "/assets/alphard.png",
    operator: "Sixt",
    operatorStyling: "text-orange-400",
    category: "van",
  },
  {
    id: "prius-1",
    model: "Toyota Prius or similar",
    seats: 5,
    luggage: 2,
    originalPrice: 100,
    price: 95,
    promoText: "Hot",
    imageUrl: "/assets/prius.png",
    operator: "Sixt",
    operatorStyling: "text-orange-400",
    category: "hybrid",
  },
];

// Helper functions for filtering and sorting
export const getCarsByCategory = (category: string): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.category === category);

export const getCarsByOperator = (operator: string): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.operator === operator);

export const getCarsUnderPrice = (maxPrice: number): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.price <= maxPrice);

export const getCarById = (id: string): RentalCarData | undefined =>
  RENTAL_CARS.find((car) => car.id === id);

export const sortCarsByPrice = (ascending: boolean = true): RentalCarData[] =>
  [...RENTAL_CARS].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price,
  );

// Category constants
export const CAR_CATEGORIES = {
  ECONOMY: "economy",
  COMPACT: "compact",
  HYBRID: "hybrid",
  VAN: "van",
  LUXURY: "luxury",
  LUXURY_SPORTS: "luxury-sports",
} as const;

export const OPERATORS = {
  HERTZ: "Hertz",
  SIXT: "Sixt",
} as const;
