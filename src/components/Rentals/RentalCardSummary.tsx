import React from "react";
import { FaUsers, FaSuitcase, FaCogs, FaCheck } from "react-icons/fa";

interface RentalCardSummaryProps {
  model: string;
  seats: number;
  luggage: number;
  transmission: "automatic" | "manual";
  imageUrl: string;
  operator: string;
  operatorStyling: string;
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
      className={`relative z-0 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 text-white shadow-xl ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500 from-30% via-gray-300 via-60% to-gray-800 to-95%" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl leading-tight font-bold text-white">
              {model}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-lg font-bold ${operatorStyling}`}>
              <span className="rounded-lg bg-black/30 px-4 py-3 backdrop-blur-sm">
                {operator}
              </span>
            </span>
          </div>
        </div>

        {/* Car Image */}
        <div className="relative z-10 mb-8 py-8">
          <div className="absolute inset-x-0 top-0 h-full w-full" />
          <div className="relative z-10 w-full">
            <img
              src={imageUrl}
              alt={model}
              className="relative z-10 h-80 w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
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
        <div className="relative z-10 mt-6 space-y-4 p-6">
          <div className="flex items-center justify-start gap-8">
            <div className="flex items-center gap-2 text-white/90">
              <FaUsers className="h-5 w-5 text-blue-300" />
              <span className="text-lg font-bold text-white">{seats}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <FaSuitcase className="h-5 w-5 text-blue-300" />
              <span className="text-lg font-bold text-white">{luggage}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <FaCogs className="h-5 w-5 text-blue-300" />
              <span className="text-lg font-bold text-white uppercase">
                {transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            </div>
          </div>

          {/* Features Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-black/20 p-4 text-sm text-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <FaCheck className="h-4 w-4 text-green-400" />
              <span>Unlimited mileage</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="h-4 w-4 text-green-400" />
              <span>24/7 roadside assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="h-4 w-4 text-green-400" />
              <span>Free cancellation (72h prior)</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheck className="h-4 w-4 text-green-400" />
              <span>Pet-friendly option</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCardSummary;
