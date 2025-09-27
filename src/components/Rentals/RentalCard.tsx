import React from "react";
import { FaUsers, FaSuitcase, FaPaw, FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface RentalCardProps {
  model: string;
  seats: number;
  luggage: number;
  transmission: "automatic" | "manual";
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
  transmission,
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
    // Navigate to add-ons page with car details in state
    navigate(`/booking/${carId}/addons`, {
      state: {
        carDetails: {
          model,
          seats,
          luggage,
          transmission,
          price,
          originalPrice,
          promoText,
          imageUrl,
          operator,
          operatorStyling,
          carId,
        },
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative h-96 w-80 cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
    >
      {/* Main Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500 from-30% via-gray-300 via-60% to-gray-800 to-95%">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-200" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Promo Badge */}
        {promoText && (
          <div className="absolute top-0 -right-4 mr-2 rotate-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-700 px-3 py-1 text-xs font-bold text-white shadow-lg drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-0 group-hover:from-red-600">
            <div className="text-center">{promoText}</div>
          </div>
        )}

        {/* Header - Fixed Height */}
        <div className="mb-4 h-20">
          <div className="flex items-start justify-between">
            <h2 className="line-clamp-2 flex-1 pr-2 text-lg leading-tight font-semibold text-white transition-colors group-hover:text-blue-200">
              {model}
            </h2>
            <span className="text-xs font-bold whitespace-nowrap text-white/80 group-hover:text-white">
              {operator}
            </span>
          </div>

          {/* Icons Row - Fixed Position */}
          <div className="mt-3 flex items-center justify-between text-gray-300 group-hover:text-white">
            <div className="flex items-center gap-1 transition-transform group-hover:scale-110">
              <FaUsers className="text-xs" />
              <span className="text-xs font-medium">{seats}</span>
            </div>

            <div className="flex items-center gap-1 transition-transform group-hover:scale-110">
              <FaSuitcase className="text-xs" />
              <span className="text-xs font-medium">{luggage}</span>
            </div>

            <div className="flex items-center gap-1 transition-transform group-hover:scale-110">
              <FaCogs className="text-xs" />
              <span className="text-xs font-medium uppercase">
                {transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            </div>

            <FaPaw className="text-xs transition-transform group-hover:scale-110" />
          </div>
        </div>

        {/* Car Image - Fixed Height and Centered */}
        <div className="relative mb-4 flex flex-1 items-center justify-center">
          <div className="relative h-32 w-full">
            <img
              src={imageUrl}
              alt={model}
              className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </div>
        </div>

        {/* Pricing - Fixed at Bottom */}
        <div className="relative mt-auto">
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              S$ {originalPrice}.00
            </span>
          )}
          <div className="flex items-baseline gap-2">
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
