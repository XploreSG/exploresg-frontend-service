import React from "react";
import { FaUsers, FaSuitcase, FaCogs, FaCheck } from "react-icons/fa";
import type { BaseCarDetails } from "../../types/rental";

interface RentalCardSummaryProps extends BaseCarDetails {
  price?: number;
  originalPrice?: number;
  promoText?: string;
  nights?: number;
  showPricing?: boolean;
  className?: string;
}

const RentalCardSummary: React.FC<RentalCardSummaryProps> = ({
  model,
  seats,
  luggage,
  transmission,
  imageUrl,
  operator,
  operatorStyling,
  className = "",
}) => {
  return (
    <div
      className={`relative z-0 overflow-hidden rounded-2xl text-white shadow-xl ${className}`}
    >
      {/* Main Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${operatorStyling.background} from-30% via-gray-300 via-60% to-gray-800 to-95%`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col px-4 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-6">
          <div className="mb-3 sm:mb-0">
            <h2
              className="leading-tight font-bold text-white"
              style={{ fontSize: "clamp(1.5rem, 5vw, 1.875rem)" }}
            >
              {model}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span
              className="font-bold"
              style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
            >
              <span
                className={`rounded-lg bg-black/30 px-3 py-1 backdrop-blur-sm ${operatorStyling.brand} shadow-md sm:px-4`}
              >
                {operator}
              </span>
            </span>
          </div>
        </div>

        {/* Car Image */}
        <div className="relative z-10">
          <div className="absolute inset-x-0 top-0 h-full w-full" />
          <div className="relative z-10 w-full">
            <img
              src={imageUrl}
              alt={model}
              className="relative z-10 h-40 w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105 sm:h-64 md:h-80"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='256' viewBox='0 0 320 256'%3E%3Crect width='320' height='256' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";
              }}
            />

            {/* Shimmer Effect */}
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              <div className="animate-shimmer h-full w-1 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
            </div>
          </div>
        </div>

        {/* Car Specs */}
        <div className="relative z-10 space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="flex items-center justify-start gap-4 sm:gap-8">
            <div className="flex items-center gap-1.5 text-white/90 sm:gap-2">
              <FaUsers
                className="text-blue-300"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              />
              <span
                className="font-bold text-white"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                {seats}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 sm:gap-2">
              <FaSuitcase
                className="text-blue-300"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              />
              <span
                className="font-bold text-white"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                {luggage}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 sm:gap-2">
              <FaCogs
                className="text-blue-300"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              />
              <span
                className="font-bold text-white uppercase"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                {transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            </div>
          </div>

          {/* Features Bar */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-black/20 pt-3 text-white/80 backdrop-blur-sm sm:gap-6 sm:pt-4"
            style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FaCheck className="h-3 w-3 text-green-400 sm:h-4 sm:w-4" />
              <span>Unlimited mileage</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FaCheck className="h-3 w-3 text-green-400 sm:h-4 sm:w-4" />
              <span>24/7 roadside assistance</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FaCheck className="h-3 w-3 text-green-400 sm:h-4 sm:w-4" />
              <span>Free cancellation (72h prior)</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FaCheck className="h-3 w-3 text-green-400 sm:h-4 sm:w-4" />
              <span>Pet-friendly option</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCardSummary;
