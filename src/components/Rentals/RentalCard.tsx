import React from "react";
import { FaUsers, FaSuitcase, FaPaw } from "react-icons/fa";

interface RentalCardProps {
  model: string;
  seats: number;
  luggage: number;
  price: number;
  originalPrice?: number;
  promoText?: string;
  imageUrl: string;
  operator: string;
  operatorStyling: string;
}

const RentalCard: React.FC<RentalCardProps> = ({
  model,
  seats,
  luggage,
  price,
  originalPrice,
  promoText,
  imageUrl,
  operator,
  operatorStyling,
}) => {
  return (
    <div className="group relative max-w-sm cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:border-blue-300 hover:shadow-2xl">
      {/* FREE promo badge - positioned absolutely to stick to right edge */}
      {promoText && (
        <div className="absolute right-0 bottom-0.5 -translate-y-1/2 rounded-l-lg bg-blue-500 py-2 pr-4 pl-3 text-white transition-all duration-300 group-hover:bg-blue-600 group-hover:pr-5">
          <div className="flex items-center">
            <div className="mr-2 text-sm font-bold">FREE</div>
            <div className="text-xs leading-tight whitespace-nowrap">
              Entry to Malaysia
              <br />
              Min. 3 nights
            </div>
          </div>
        </div>
      )}

      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 transition-all duration-300 group-hover:from-blue-50/20 group-hover:to-purple-50/20"></div>

      {/* Header with model name */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-700">
            {model}
          </h2>
          <span
            className={`text-sm font-bold ${operatorStyling} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
          >
            {operator}
          </span>
        </div>

        {/* Icons row */}
        <div className="mt-3 flex items-center space-x-6 text-gray-500 transition-colors duration-300 group-hover:text-gray-700">
          <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
            <FaUsers className="text-sm" />
            <span className="text-sm font-medium">{seats}</span>
          </div>
          <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
            <FaSuitcase className="text-sm" />
            <span className="text-sm font-medium">{luggage}</span>
          </div>
          <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
            <FaPaw className="text-sm" />
          </div>
        </div>
      </div>

      {/* Car image */}
      <div className="relative px-6 pb-6">
        <div className="overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={model}
            className="h-32 w-full transform object-contain transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.log("Image failed to load:", imageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Subtle shimmer effect on hover */}
        <div className="pointer-events-none absolute inset-6 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
      </div>

      {/* Pricing section */}
      <div className="relative px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through transition-all duration-300 group-hover:text-gray-500">
                S$ {originalPrice}.00
              </span>
            )}
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-105 group-hover:text-blue-700">
                S${price}
              </span>
              <span className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                /night
              </span>
            </div>
          </div>
        </div>

        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:w-full"></div>
      </div>

      {/* Subtle ring effect on hover */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-blue-400/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400/20"></div>
    </div>
  );
};

export default RentalCard;
