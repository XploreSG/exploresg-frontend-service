// CarRentalCard.tsx
import React from "react";
import { FaUsers, FaSuitcase, FaPaw } from "react-icons/fa";

interface CarRentalCardProps {
  model: string;
  seats: number;
  luggage: number;
  price: number;
  originalPrice?: number;
  promoText?: string;
  imageUrl: string;
}

const CarRentalCard: React.FC<CarRentalCardProps> = ({
  model,
  seats,
  luggage,
  price,
  originalPrice,
  promoText,
  imageUrl,
}) => {
  return (
    <div className="relative max-w-sm overflow-hidden rounded-lg bg-white shadow-md">
      {promoText && (
        <div className="absolute right-0 bottom-0 rounded-tl bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
          {promoText}
        </div>
      )}

      <img src={imageUrl} alt={model} className="h-48 w-full object-cover" />

      <div className="space-y-3 p-4">
        <h2 className="text-lg font-semibold text-gray-800">{model}</h2>

        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-1">
            <FaUsers />
            <span>{seats}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaSuitcase />
            <span>{luggage}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaPaw />
            <span>Pet-friendly</span>
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          {originalPrice && (
            <span className="text-gray-500 line-through">
              S${originalPrice}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900">
            S${price}/night
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarRentalCard;
