import React from "react";
import RentalCard from "../components/Rentals/RentalCard";

// Extract rental car data
const RENTAL_CARS = [
  {
    id: "skoda-octavia-1",
    model: "Skoda Octavia or similar",
    seats: 5,
    luggage: 4,
    originalPrice: 120,
    price: 100,
    promoText: "FREE Entry to Malaysia Min. 5 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 3 nights",
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
    promoText: "FREE Entry to Malaysia Min. 4 nights",
    imageUrl: "/assets/prius.png",
    operator: "Sixt",
    operatorStyling: "text-orange-400",
    category: "hybrid",
  },
];

const FleetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Car and Motorcycle Rentals
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Two or Four Wheels, Discover Singapore, Your Way!
          </p>
        </div>

        {/* Rental Cars Grid */}
        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {RENTAL_CARS.map((car) => (
                <RentalCard
                  key={car.id}
                  carId={car.id}
                  model={car.model}
                  seats={car.seats}
                  luggage={car.luggage}
                  originalPrice={car.originalPrice}
                  price={car.price}
                  promoText={car.promoText}
                  imageUrl={car.imageUrl}
                  operator={car.operator}
                  operatorStyling={car.operatorStyling}
                />
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="mt-16">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <span className="text-4xl">🚗</span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                More Vehicles Coming Soon
              </h2>
              <p className="mt-4 text-gray-600">
                We're working hard to bring you more rental options. Stay tuned
                for motorcycles, luxury cars, and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
