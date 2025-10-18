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
    <div className="grid grid-cols-1 justify-center justify-items-center gap-10 md:[grid-template-columns:repeat(auto-fit,minmax(320px,320px))] lg:gap-12">
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
