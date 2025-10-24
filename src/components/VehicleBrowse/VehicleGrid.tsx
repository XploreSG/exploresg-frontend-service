import React from "react";
import RentalCard from "../Rentals/RentalCard";
import { normalizeTransmission } from "../../utils/rentalUtils";
import type { DisplayCarData } from "../../types/rental";

interface VehicleGridProps {
  vehicles: DisplayCarData[];
  isLoading?: boolean;
  placeholderCount?: number;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  isLoading = false,
  placeholderCount = 6,
}) => {
  const placeholders = Array.from({ length: placeholderCount });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? placeholders.map((_, i) => (
            <RentalCard
              key={`ph-${i}`}
              carId={`ph-${i}`}
              model={""}
              seats={0}
              luggage={0}
              transmission={"manual" as "manual" | "automatic"}
              originalPrice={undefined}
              price={0}
              promoText={undefined}
              imageUrl={""}
              operator={""}
              operatorStyling={{ background: "", brand: "" }}
              isLoading
            />
          ))
        : vehicles.map((car) => (
            <RentalCard
              key={car.id}
              carId={car.publicModelId || car.id}
              publicModelId={car.publicModelId}
              model={car.model}
              seats={car.seats}
              luggage={car.luggage}
              transmission={
                normalizeTransmission(car.transmission) as
                  | "automatic"
                  | "manual"
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
