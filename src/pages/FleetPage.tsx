import React from "react";
import RentalCard from "../components/Rentals/RentalCard";

const FleetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Car and Motorcycle Rentals
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Two or Four Wheels, Discover Singapore, Your Way!
          </p>
        </div>

        <div className="mt-16 rounded-lg bg-white p-12 shadow-lg">
          <div className="text-center">
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <RentalCard
                model="Skoda Ovtavia or similar"
                seats={5}
                luggage={4}
                originalPrice={120}
                price={100}
                promoText="FREE Entry to Malaysia Min. 5 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/skoda-octavia.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="Nissan Sentra or similar"
                seats={4}
                luggage={2}
                originalPrice={90}
                price={50}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/nissan-sentra.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="BMW Z4 or similar"
                seats={2}
                luggage={2}
                originalPrice={490}
                price={450}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/bmw-z4.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="BMW M440i or similar"
                seats={4}
                luggage={2}
                originalPrice={490}
                price={450}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/bmw-440i.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="Porsche 911 Carrera or similar"
                seats={2}
                luggage={2}
                originalPrice={490}
                price={450}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/porsche-911-c.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="AMG SL63 or similar"
                seats={2}
                luggage={2}
                originalPrice={490}
                price={450}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/merc-sl63.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="Toyota Alphard or similar"
                seats={7}
                luggage={2}
                originalPrice={290}
                price={250}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/alphard.png"
                operator="Hertz"
                operatorStyling="text-yellow-400"
              />
              <RentalCard
                model="Toyota Alphard or similar"
                seats={7}
                luggage={2}
                originalPrice={290}
                price={250}
                promoText="FREE Entry to Malaysia Min. 3 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/alphard.png"
                operator="Sixt"
                operatorStyling="text-orange-400"
              />
              <RentalCard
                model="Toyota Prius or similar"
                seats={5}
                luggage={2}
                originalPrice={100}
                price={95}
                promoText="FREE Entry to Malaysia Min. 4 nights"
                // Fixed image path - use absolute path from public folder
                imageUrl="/assets/prius.png"
                operator="Sixt"
                operatorStyling="text-orange-400"
              />
            </div>

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🏛️</span>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Coming Soon
            </h2>
            <p className="mt-4 text-gray-600">
              We're working hard to bring you the best attractions in Singapore.
              Stay tuned for amazing experiences!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;
