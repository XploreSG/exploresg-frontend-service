export const CAR_CATEGORIES = {
  ECONOMY: "economy",
  COMPACT: "compact",
  HYBRID: "hybrid",
  VAN: "van",
  SUV: "suv",
  LUXURY: "luxury",
  LUXURY_SPORTS: "luxury-sports",
  LUXURY_SUV: "luxury-suv",
} as const;

export const OPERATORS = {
  HERTZ: "Hertz",
  SIXT: "Sixt",
} as const;

export const TRANSMISSIONS = {
  AUTOMATIC: "automatic",
  MANUAL: "manual",
} as const;

export const MANUFACTURERS = {
  MASERATI: "Maserati",
  SKODA: "Skoda",
  NISSAN: "Nissan",
  BMW: "BMW",
  PORSCHE: "Porsche",
  MERCEDES: "Mercedes-AMG",
  PEUGEOT: "Peugeot",
  TOYOTA: "Toyota",
  VOLKSWAGEN: "Volkswagen",
} as const;

export const SEAT_CAPACITIES = {
  TWO_SEATER: 2,
  FOUR_SEATER: 4,
  FIVE_SEATER: 5,
  SEVEN_SEATER: 7,
} as const;

export const LUGGAGE_CAPACITIES = {
  SMALL: 2,
  MEDIUM: 4,
} as const;

export type CarCategory = (typeof CAR_CATEGORIES)[keyof typeof CAR_CATEGORIES];
export type Operator = (typeof OPERATORS)[keyof typeof OPERATORS];
export type Transmission = (typeof TRANSMISSIONS)[keyof typeof TRANSMISSIONS];
export type Manufacturer = (typeof MANUFACTURERS)[keyof typeof MANUFACTURERS];
export type SeatCapacity =
  (typeof SEAT_CAPACITIES)[keyof typeof SEAT_CAPACITIES];
export type LuggageCapacity =
  (typeof LUGGAGE_CAPACITIES)[keyof typeof LUGGAGE_CAPACITIES];

export interface RentalCarData {
  id: string;
  model: string;
  manufacturer: Manufacturer;
  seats: SeatCapacity;
  luggage: LuggageCapacity;
  transmission: Transmission;
  originalPrice?: number;
  price: number;
  promoText?: string;
  imageUrl: string;
  operator: Operator;
  operatorStyling: string;
  category: CarCategory;
}

export const RENTAL_CARS: RentalCarData[] = [
  {
    id: "maserati-grecale-1",
    model: "Maserati Grecale",
    manufacturer: MANUFACTURERS.MASERATI,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.MEDIUM,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 600,
    price: 550,
    promoText: "Hot",
    imageUrl: "/assets/maserati-grecale.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY_SUV,
  },

  {
    id: "skoda-octavia-1",
    model: "Skoda Octavia",
    manufacturer: MANUFACTURERS.SKODA,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.MEDIUM,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 120,
    price: 100,
    promoText: "Hot",
    imageUrl: "/assets/skoda-octavia.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.COMPACT,
  },
  {
    id: "nissan-sentra-1",
    model: "Nissan Sentra",
    manufacturer: MANUFACTURERS.NISSAN,
    seats: SEAT_CAPACITIES.FOUR_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 90,
    price: 50,
    promoText: "Hot",
    imageUrl: "/assets/nissan-sentra.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.ECONOMY,
  },
  {
    id: "bmw-z4-1",
    model: "BMW Z4",
    manufacturer: MANUFACTURERS.BMW,
    seats: SEAT_CAPACITIES.TWO_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-z4.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY_SPORTS,
  },
  {
    id: "bmw-x3-1",
    model: "BMW X3",
    manufacturer: MANUFACTURERS.BMW,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.MEDIUM,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 500,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-x3.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY_SUV,
  },
  {
    id: "bmw-5-1",
    model: "BMW 5 Touring",
    manufacturer: MANUFACTURERS.BMW,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.MEDIUM,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 500,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-5-t.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY,
  },
  {
    id: "bmw-m2-1",
    model: "BMW M240i",
    manufacturer: MANUFACTURERS.BMW,
    seats: SEAT_CAPACITIES.FOUR_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 390,
    price: 350,
    promoText: "Hot",
    imageUrl: "/assets/bmw-2.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY,
  },
  {
    id: "bmw-m440i-1",
    model: "BMW M440i",
    manufacturer: MANUFACTURERS.BMW,
    seats: SEAT_CAPACITIES.FOUR_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/bmw-440i.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY,
  },
  {
    id: "porsche-911-1",
    model: "Porsche 911 Carrera",
    manufacturer: MANUFACTURERS.PORSCHE,
    seats: SEAT_CAPACITIES.TWO_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.MANUAL,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/porsche-911-c.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY_SPORTS,
  },
  {
    id: "amg-sl63-1",
    model: "AMG SL63",
    manufacturer: MANUFACTURERS.MERCEDES,
    seats: SEAT_CAPACITIES.TWO_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 490,
    price: 450,
    promoText: "Hot",
    imageUrl: "/assets/merc-sl63.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.LUXURY_SPORTS,
  },
  {
    id: "merc-v-1",
    model: "Mercedes V Class",
    manufacturer: MANUFACTURERS.MERCEDES,
    seats: SEAT_CAPACITIES.TWO_SEATER,
    luggage: LUGGAGE_CAPACITIES.MEDIUM,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 790,
    price: 550,
    promoText: "Hot",
    imageUrl: "/assets/merc-v.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.VAN,
  },
  {
    id: "peugeot-5008-1",
    model: "Peugeot 5006",
    manufacturer: MANUFACTURERS.PEUGEOT,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 190,
    price: 150,
    promoText: "Hot",
    imageUrl: "/assets/peugeot-5008.png",
    operator: OPERATORS.HERTZ,
    operatorStyling: "text-yellow-400",
    category: CAR_CATEGORIES.COMPACT,
  },
  // {
  //   id: "alphard-hertz-1",
  //   model: "Toyota Alphard",
  //   manufacturer: MANUFACTURERS.TOYOTA,
  //   seats: SEAT_CAPACITIES.SEVEN_SEATER,
  //   luggage: LUGGAGE_CAPACITIES.SMALL,
  //   transmission: TRANSMISSIONS.AUTOMATIC,
  //   originalPrice: 290,
  //   price: 250,
  //   promoText: "Hot",
  //   imageUrl: "/assets/alphard.png",
  //   operator: OPERATORS.HERTZ,
  //   operatorStyling: "text-yellow-400",
  //   category: CAR_CATEGORIES.VAN,
  // },
  // {
  //   id: "alphard-sixt-1",
  //   model: "Toyota Alphard",
  //   manufacturer: MANUFACTURERS.TOYOTA,
  //   seats: SEAT_CAPACITIES.SEVEN_SEATER,
  //   luggage: LUGGAGE_CAPACITIES.SMALL,
  //   transmission: TRANSMISSIONS.AUTOMATIC,
  //   originalPrice: 290,
  //   price: 250,
  //   promoText: "Hot",
  //   imageUrl: "/assets/alphard.png",
  //   operator: OPERATORS.SIXT,
  //   operatorStyling: "text-orange-400",
  //   category: CAR_CATEGORIES.VAN,
  // },
  // {
  //   id: "prius-1",
  //   model: "Toyota Prius",
  //   manufacturer: MANUFACTURERS.TOYOTA,
  //   seats: SEAT_CAPACITIES.FIVE_SEATER,
  //   luggage: LUGGAGE_CAPACITIES.SMALL,
  //   transmission: TRANSMISSIONS.AUTOMATIC,
  //   originalPrice: 100,
  //   price: 95,
  //   promoText: "Hot",
  //   imageUrl: "/assets/prius.png",
  //   operator: OPERATORS.SIXT,
  //   operatorStyling: "text-orange-400",
  //   category: CAR_CATEGORIES.HYBRID,
  // },
  {
    id: "vw-golf-1",
    model: "VW Golf",
    manufacturer: MANUFACTURERS.VOLKSWAGEN,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 200,
    price: 160,
    promoText: "Hot",
    imageUrl: "/assets/vw-golf.png",
    operator: OPERATORS.SIXT,
    operatorStyling: "text-orange-400",
    category: CAR_CATEGORIES.COMPACT,
  },
  {
    id: "vw-polo-1",
    model: "VW Polo",
    manufacturer: MANUFACTURERS.VOLKSWAGEN,
    seats: SEAT_CAPACITIES.FIVE_SEATER,
    luggage: LUGGAGE_CAPACITIES.SMALL,
    transmission: TRANSMISSIONS.AUTOMATIC,
    originalPrice: 180,
    price: 140,
    promoText: "Hot",
    imageUrl: "/assets/vw-polo.png",
    operator: OPERATORS.SIXT,
    operatorStyling: "text-orange-400",
    category: CAR_CATEGORIES.COMPACT,
  },
];

export const getCarsByCategory = (category: CarCategory): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.category === category);

export const getCarsByOperator = (operator: Operator): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.operator === operator);

export const getCarsByTransmission = (
  transmission: Transmission,
): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.transmission === transmission);

export const getCarsByManufacturer = (
  manufacturer: Manufacturer,
): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.manufacturer === manufacturer);

export const getCarsBySeats = (seats: SeatCapacity): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.seats === seats);

export const getCarsByLuggage = (luggage: LuggageCapacity): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.luggage === luggage);

export const getCarsUnderPrice = (maxPrice: number): RentalCarData[] =>
  RENTAL_CARS.filter((car) => car.price <= maxPrice);

export const getCarById = (id: string): RentalCarData | undefined =>
  RENTAL_CARS.find((car) => car.id === id);

export const sortCarsByPrice = (ascending: boolean = true): RentalCarData[] =>
  [...RENTAL_CARS].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price,
  );
