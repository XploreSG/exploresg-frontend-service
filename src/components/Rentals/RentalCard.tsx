import React from "react";
import { FaUsers, FaSuitcase, FaPaw } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  carId?: string;
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
  carId = "alphard-1",
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to add-ons page with car details
    navigate(`/booking/${carId}/addons`, {
      state: {
        carDetails: {
          model,
          seats,
          luggage,
          price,
          originalPrice,
          promoText,
          imageUrl,
          operator,
        },
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative max-w-sm cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      {/* Beautiful Gradient Background - More Prominent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-orange-600 to-blue-800">
        {/* Secondary gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/30 via-slate-600/20 to-purple-800/30"></div>
        {/* Animated hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-indigo-600/0 transition-all duration-500 group-hover:from-blue-600/20 group-hover:via-purple-600/10 group-hover:to-indigo-600/20"></div>
        {/* Subtle radial highlight */}
        <div className="bg-radial-gradient absolute inset-0 from-white/5 via-transparent to-transparent opacity-50"></div>
      </div>

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-0.5">
        <div className="h-full w-full rounded-xl bg-transparent"></div>
      </div>

      {/* Content Container - positioned above gradient */}
      <div className="relative z-10">
        {/* FREE promo badge */}
        {promoText && (
          <div className="absolute right-0 bottom-0.5 z-20 -translate-y-1/2 rounded-l-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2 pr-4 pl-3 text-white shadow-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:pr-5">
            <div className="text-sm font-bold">FREE</div>
            <div className="text-xs leading-tight whitespace-nowrap">
              Entry to Malaysia
              <br />
              Min. 3 nights
            </div>
          </div>
        )}

        {/* Header with model name */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white drop-shadow-md transition-colors duration-300 group-hover:text-blue-200">
              {model}
            </h2>
            <span className="text-sm font-bold text-white/90 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              {operator}
            </span>
          </div>

          {/* Icons row */}
          <div className="mt-3 flex items-center space-x-6 text-gray-200 transition-colors duration-300 group-hover:text-white">
            <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
              <FaUsers className="text-sm drop-shadow-sm" />
              <span className="text-sm font-medium">{seats}</span>
            </div>
            <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
              <FaSuitcase className="text-sm drop-shadow-sm" />
              <span className="text-sm font-medium">{luggage}</span>
            </div>
            <div className="flex transform items-center space-x-2 transition-transform duration-300 group-hover:scale-110">
              <FaPaw className="text-sm drop-shadow-sm" />
            </div>
          </div>
        </div>

        {/* Car image with backdrop */}
        <div className="relative px-6 pb-6">
          {/* Image backdrop for better contrast */}
          <div className="absolute inset-6 rounded-lg bg-gradient-to-b from-white/10 to-white/5 blur-xl"></div>

          <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-white/5 to-transparent p-2">
            <img
              src={imageUrl}
              alt={model}
              className="h-32 w-full transform object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                console.log("Image failed to load:", imageUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Enhanced shimmer effect */}
          <div className="pointer-events-none absolute inset-6 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        </div>

        {/* Pricing section */}
        <div className="relative px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {originalPrice && (
                <span className="text-sm text-gray-300 line-through transition-all duration-300 group-hover:text-gray-200">
                  S$ {originalPrice}.00
                </span>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-white drop-shadow-md transition-all duration-300 group-hover:scale-105 group-hover:text-blue-100">
                  S${price}
                </span>
                <span className="text-sm text-gray-200 transition-colors duration-300 group-hover:text-white">
                  /night
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced animated bottom border with gradient */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg transition-all duration-500 group-hover:w-full"></div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 ring-0 ring-blue-400/0 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-2xl group-hover:ring-2 group-hover:shadow-blue-400/25 group-hover:ring-blue-400/50"></div>
    </div>
  );
};

export default RentalCard;
