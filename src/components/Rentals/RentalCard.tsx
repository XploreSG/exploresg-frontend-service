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
          operatorStyling,
        },
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative max-w-sm cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      {/* Main Gradient Background */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-violet-900 via-violet-300 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-100" />
      </div> */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-600 from-10% via-gray-300 via-60% to-gray-900 to-90%">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* FREE Badge */}
        {/* {promoText && (
          <div className="absolute top-8 -right-6 rotate-0 bg-blue-500 px-4 py-1 text-xs font-bold text-white shadow-lg transition-colors group-hover:bg-blue-600">
            FREE Malaysia Entry
          </div>
        )} */}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-blue-200">
              {model}
            </h2>
            <span className="text-xs font-bold text-white/80 group-hover:text-white">
              {operator}
            </span>
          </div>

          {/* Icons */}
          <div className="mt-3 flex items-center gap-4 text-gray-300 group-hover:text-white">
            <div className="flex items-center gap-1 transition-transform group-hover:scale-110">
              <FaUsers className="text-xs" />
              <span className="text-sm">{seats}</span>
            </div>
            <div className="flex items-center gap-1 transition-transform group-hover:scale-110">
              <FaSuitcase className="text-xs" />
              <span className="text-sm">{luggage}</span>
            </div>
            <FaPaw className="text-xs transition-transform group-hover:scale-110" />
          </div>
        </div>

        {/* Car Image */}
        <div className="relative mb-4">
          <img
            src={imageUrl}
            alt={model}
            className="h-32 w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        {/* Pricing */}
        <div className="relative">
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              S$ {originalPrice}.00
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white transition-all group-hover:scale-105 group-hover:text-blue-100">
              S${price}
            </span>
            <span className="text-sm text-gray-300">/night</span>
          </div>

          {/* Animated Border */}
          <div className="absolute -bottom-6 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* Hover Ring */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-blue-400/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400/50" />
    </div>
  );
};

export default RentalCard;
