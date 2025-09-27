import React from "react";
import RentalCard from "../components/Rentals/RentalCard";
import { RENTAL_CARS } from "../data/rentalCars";

const FleetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Car and Motorcycle Rentals
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Two or Four Wheels, Discover Singapore, Your Way!
          </p>
        </div>

        {/* Rental Cars Grid - Auto-fit grid that respects card minimum width */}
        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-center gap-8">
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
