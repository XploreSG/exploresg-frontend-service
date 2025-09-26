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
    <div className="relative max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
      {/* FREE promo badge - positioned absolutely to stick to right edge */}
      {promoText && (
        <div className="absolute right-0 bottom-0.5 -translate-y-1/2 rounded-l-lg bg-blue-500 py-2 pr-4 pl-3 text-white">
          <div className="text-sm font-bold">FREE</div>
          <div className="text-xs leading-tight whitespace-nowrap">
            Entry to Malaysia
            <br />
            Min. 3 nights
          </div>
        </div>
      )}

      {/* Header with model name */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">{model}</h2>

        {/* Icons row */}
        <div className="mt-3 flex items-center space-x-6 text-gray-500">
          <div className="flex items-center space-x-2">
            <FaUsers className="text-sm" />
            <span className="text-sm font-medium">{seats}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaSuitcase className="text-sm" />
            <span className="text-sm font-medium">{luggage}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaPaw className="text-sm" />
          </div>
        </div>
      </div>

      {/* Car image */}
      <div className="px-6 pb-6">
        <img
          src={imageUrl}
          alt={model}
          className="h-32 w-full object-contain"
          onError={(e) => {
            console.log("Image failed to load:", imageUrl);
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Pricing section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                S$ {originalPrice}.00
              </span>
            )}
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-blue-600">
                S${price}
              </span>
              <span className="text-sm text-gray-500">/night</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalCard;
