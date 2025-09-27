import React from "react";
import { FaUsers, FaSuitcase, FaCogs, FaCheck } from "react-icons/fa";

interface RentalCardSummaryProps {
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
  nights?: number;
  showPricing?: boolean;
  className?: string;
}

const RentalCardSummary: React.FC<RentalCardSummaryProps> = ({
  model,
  seats,
  luggage,
  transmission,
  price,
  //   originalPrice,
  //   promoText,
  imageUrl,
  operator,
  operatorStyling,
  nights = 5,
  showPricing = true,
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 p-6 text-white shadow-xl ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-slate-600/10 to-indigo-600/10" />

      {/* Promo Badge */}
      {/* {promoText && (
        <div className="absolute top-4 right-4 rotate-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-700 px-3 py-2 text-sm font-bold text-white shadow-lg">
          {promoText}
        </div>
      )} */}

      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl leading-tight font-bold text-white">
              {model}
            </h2>
            <p className="text-lg text-white/80"></p>
          </div>

          {/* Operator Badge */}
          <div className="flex items-center gap-4">
            <span className={`text-lg font-bold ${operatorStyling}`}>
              <span className="rounded-lg bg-black/30 px-4 py-3 backdrop-blur-sm">
                {operator}
              </span>
            </span>
            {/* {showPricing && (
              <div className="text-right">
                {originalPrice && (
                  <div className="text-lg text-white/60 line-through">
                    S$ {originalPrice}.00
                  </div>
                )}
                <div className="text-2xl font-bold text-white">
                  S$ {price}
                  <span className="text-lg font-normal text-white/80">
                    /night
                  </span>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Main Content - Car Image + Rental Period */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Car Section - Takes up most space */}
          <div className="lg:col-span-3">
            {/* Car Image - Maximum Size */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={model}
                  className="h-64 w-full max-w-lg object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='256' viewBox='0 0 320 256'%3E%3Crect width='320' height='256' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
              </div>
            </div>
          </div>

          {/* Rental Period - Right Side */}
          <div className="flex flex-col justify-center lg:col-span-1">
            <h3 className="mb-4 text-center text-xl font-semibold text-white/90">
              Rental Period
            </h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-black/30 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{nights}</div>
                  <div className="text-sm tracking-wide text-white/70 uppercase">
                    nights
                  </div>
                </div>
              </div>

              {showPricing && (
                <div className="space-y-3 rounded-xl bg-black/20 p-4 backdrop-blur-sm">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Subtotal</span>
                    <span>S$ {(price * nights).toFixed(2)}</span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>S$ {(price * nights).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Car Details + Features Bar */}
        <div className="mt-6 space-y-4">
          {/* Car Specifications - Left Aligned */}
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

        {/* Animated Border */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000 group-hover:w-full" />
      </div>
    </div>
  );
};

export default RentalCardSummary;
