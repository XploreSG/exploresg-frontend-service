import React from "react";
import RentalCard from "../Rentals/RentalCard";
import { normalizeTransmission } from "../../utils/rentalUtils";
import type { DisplayCarData } from "../../types/rental";

interface VehicleGridProps {
  vehicles: DisplayCarData[];
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-center gap-8">
      {vehicles.map((car) => (
        <RentalCard
          key={car.id}
          carId={car.id}
          model={car.model}
          seats={car.seats}
          luggage={car.luggage}
          transmission={
            normalizeTransmission(car.transmission) as "automatic" | "manual"
          }
          originalPrice={undefined}
          price={car.price}
          promoText={undefined}
          imageUrl={car.imageUrl}
          operator={car.operator}
          operatorStyling={car.operatorStyling}
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
