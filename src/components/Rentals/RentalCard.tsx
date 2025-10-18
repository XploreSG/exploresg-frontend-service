import React from "react";
import { FaUsers, FaSuitcase, FaPaw, FaCogs } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { CarDetailsWithPricing } from "../../types/rental";

type RentalCardProps = CarDetailsWithPricing;

interface Props extends RentalCardProps {
  isLoading?: boolean;
}

const RentalCard: React.FC<Props> = ({
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
  carModelPublicId, // ⭐ Destructure the UUID
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isLoading) return; // disable navigation while loading
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
          carModelPublicId, // ⭐ Pass the UUID to navigation state
        },
      },
    });
  };

  // track image load so we can cross-fade from skeleton to content when image is ready
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative h-[22rem] w-full max-w-[20rem] sm:h-96 sm:w-80 ${isLoading ? "cursor-default" : "cursor-pointer hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"} overflow-hidden rounded-xl shadow-lg transition-all duration-300`}
    >
      {/* Main Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${operatorStyling.background} from-30% via-gray-300 via-60% to-gray-800 to-95%`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-200" />
      </div>

      {/* Content (cross-fades with skeleton) */}
      <div
        className={`relative z-10 flex h-full flex-col p-4 transition-opacity duration-500 ease-out sm:p-6 ${isLoading || !imageLoaded ? "opacity-0" : "opacity-100"}`}
      >
        {/* Promo Badge */}
        {promoText && (
          <div
            className="absolute top-0 -right-2 mr-1 rotate-12 rounded-xl bg-gradient-to-r from-blue-600 to-violet-700 px-2 py-1 shadow-lg drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-0 group-hover:from-red-600 sm:-right-4 sm:mr-2 sm:rounded-2xl sm:px-3"
            style={{ fontSize: "clamp(0.625rem, 2vw, 0.75rem)" }}
          >
            <div className="text-center font-bold text-white">{promoText}</div>
          </div>
        )}

        {/* Header - Responsive Height */}
        <div className="mb-3 h-16 sm:mb-4 sm:h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2
                className="line-clamp-2 leading-tight font-semibold text-white transition-colors group-hover:text-blue-200"
                style={{ fontSize: "clamp(0.875rem, 3vw, 1.125rem)" }}
              >
                {model}
              </h2>
              <p
                className="px-1 font-thin text-white sm:px-2"
                style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
              >
                or similar
              </p>
            </div>
            <span
              className="pl-2 font-bold whitespace-nowrap transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 sm:pl-4"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
            >
              <span
                className={`rounded-md bg-black/20 px-1.5 py-0.5 backdrop-blur-sm ${operatorStyling.brand} shadow-md sm:px-2 sm:py-1`}
              >
                {operator}
              </span>
            </span>
          </div>

          {/* Icons Row - Responsive */}
          <div className="mt-2 flex gap-2 text-gray-300 group-hover:text-white sm:mt-3 sm:gap-4">
            <div
              className="flex items-center gap-0.5 transition-transform group-hover:scale-110 sm:gap-1"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
            >
              <FaUsers />
              <span className="font-medium">{seats}</span>
            </div>

            <div
              className="flex items-center gap-0.5 transition-transform group-hover:scale-110 sm:gap-1"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
            >
              <FaSuitcase />
              <span className="font-medium">{luggage}</span>
            </div>

            <div
              className="flex items-center gap-0.5 transition-transform group-hover:scale-110 sm:gap-1"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
            >
              <FaCogs />
              <span className="font-medium uppercase">
                {transmission === "automatic" ? "Auto" : "Manual"}
              </span>
            </div>

            <FaPaw
              className="transition-transform group-hover:scale-110"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.75rem)" }}
            />
          </div>
        </div>

        {/* Car Image - Fixed Height and Centered */}
        <div className="relative mb-4 flex flex-1 items-center justify-center">
          <div className="relative h-50 w-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={model}
                className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <FaCogs className="h-16 w-16 text-gray-300" />
              </div>
            )}

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </div>
        </div>

        {/* Pricing - Fixed at Bottom */}
        <div className="relative mt-auto">
          {originalPrice && (
            <span
              className="text-gray-400 line-through"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              S$ {originalPrice}.00
            </span>
          )}
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span
              className="font-bold text-white transition-all group-hover:scale-105 group-hover:text-blue-100"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}
            >
              S${price}
            </span>
            <span
              className="text-gray-300"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              /night
            </span>
          </div>

          {/* Animated Border */}
          <div className="absolute -bottom-4 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 group-hover:w-full sm:-bottom-6" />
        </div>
      </div>

      {/* Skeleton overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col p-4 transition-opacity duration-500 ease-out sm:p-6 ${isLoading || !imageLoaded ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={true}
      >
        <div className="mb-3 h-16 sm:mb-4 sm:h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-300/80 sm:h-6 sm:w-36" />
              <div className="ml-1 h-3 w-16 animate-pulse rounded bg-gray-300/70 sm:ml-2 sm:w-20" />
            </div>
            <div className="h-5 w-12 animate-pulse rounded bg-gray-300/80 sm:h-6 sm:w-16" />
          </div>

          <div className="mt-2 flex gap-2 sm:mt-3 sm:gap-4">
            <div className="h-3.5 w-8 animate-pulse rounded bg-gray-300/70 sm:h-4 sm:w-10" />
            <div className="h-3.5 w-8 animate-pulse rounded bg-gray-300/70 sm:h-4 sm:w-10" />
            <div className="h-3.5 w-12 animate-pulse rounded bg-gray-300/70 sm:h-4 sm:w-16" />
          </div>
        </div>

        <div className="relative mb-3 flex flex-1 items-center justify-center sm:mb-4">
          <div className="h-40 w-full animate-pulse rounded-md bg-gray-200/80 sm:h-50" />
        </div>

        <div className="relative mt-auto space-y-1.5 sm:space-y-2">
          <div className="h-3.5 w-16 animate-pulse rounded bg-gray-300/70 sm:h-4 sm:w-20" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-300/80 sm:h-6 sm:w-28" />
        </div>
      </div>

      {/* Hover Ring */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-blue-400/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400/50" />
    </div>
  );
};

export default RentalCard;
