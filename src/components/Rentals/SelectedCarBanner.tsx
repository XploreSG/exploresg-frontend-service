import React from "react";
import { FaUsers, FaSuitcase, FaCogs, FaCar } from "react-icons/fa";
import type { BaseCarDetails } from "../../types/rental";

interface SelectedCarBannerProps extends BaseCarDetails {
  price?: number;
  nights?: number;
  className?: string;
  compact?: boolean;
}

/**
 * Sticky banner showing the selected car throughout the booking flow
 * Displays consistent car information from the RentalCard selection
 */
const SelectedCarBanner: React.FC<SelectedCarBannerProps> = ({
  model,
  seats,
  luggage,
  transmission,
  imageUrl,
  operator,
  operatorStyling,
  price,
  nights,
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`sticky top-16 z-30 rounded-lg border border-blue-200 bg-white shadow-md ${className}`}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Car Icon/Image */}
        <div className="flex-shrink-0">
          {compact ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <FaCar className="h-6 w-6 text-blue-600" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={model}
              className="h-16 w-24 rounded-lg object-contain sm:h-20 sm:w-32"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        {/* Car Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                {model}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                <div className="flex items-center gap-1">
                  <FaUsers className="h-3 w-3 text-gray-400" />
                  <span>{seats}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaSuitcase className="h-3 w-3 text-gray-400" />
                  <span>{luggage}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCogs className="h-3 w-3 text-gray-400" />
                  <span className="uppercase">
                    {transmission === "automatic" ? "Auto" : "Manual"}
                  </span>
                </div>
              </div>
            </div>

            {/* Operator Badge & Price */}
            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${operatorStyling.brand}`}
                style={{
                  background:
                    operatorStyling.background
                      ?.replace(
                        "bg-gradient-to-b",
                        "linear-gradient(to bottom,",
                      )
                      ?.replace("from-", "")
                      ?.replace("via-", ", ")
                      ?.replace("to-", ", ")
                      ?.concat(")") || "#f0f0f0",
                }}
              >
                {operator}
              </span>
              {price && nights && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    S$ {(price * nights).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Indicator */}
      <div className="bg-blue-50 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-blue-700">
          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          <span className="font-medium">Selected Vehicle</span>
        </div>
      </div>
    </div>
  );
};

export default SelectedCarBanner;
