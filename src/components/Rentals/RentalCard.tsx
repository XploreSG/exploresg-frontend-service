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
        },
      },
    });
  };

  // track image load so we can cross-fade from skeleton to content when image is ready
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative h-96 w-80 ${isLoading ? "cursor-default" : "cursor-pointer hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"} overflow-hidden rounded-xl shadow-lg transition-all duration-300`}
    >
      {/* Main Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${operatorStyling.background} from-30% via-gray-300 via-60% to-gray-800 to-95%`}
      >
        {/* <div
        className={`absolute inset-0 bg-gradient-to-b ${operatorStyling.background} from-30% via-gray-300 via-60% to-gray-800 to-95%`}
      > */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-200" />
      </div>
      {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-500 from-30% via-gray-300 via-60% to-gray-800 to-95%">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0 transition-opacity duration-500 group-hover:opacity-200" />
      </div> */}

      {/* Content (cross-fades with skeleton) */}
      <div
        className={`relative z-10 flex h-full flex-col p-6 transition-opacity duration-500 ease-out ${isLoading || !imageLoaded ? "opacity-0" : "opacity-100"}`}
      >
        {/* Promo Badge */}
        {promoText && (
          <div className="absolute top-0 -right-4 mr-2 rotate-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-700 px-3 py-1 text-xs font-bold text-white shadow-lg drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-0 group-hover:from-red-600">
            <div className="text-center">{promoText}</div>
          </div>
        )}

        {/* Header - Fixed Height */}
        <div className="mb-4 h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="line-clamp-2 text-lg leading-tight font-semibold text-white transition-colors group-hover:text-blue-200">
                {model}
              </h2>{" "}
              <p className="px-2 text-xs font-thin text-white">or similar</p>
            </div>
            <span
              className={
                "pl-4 text-xs font-bold whitespace-nowrap transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              }
            >
              {/* <span
              className={`pl-4 text-xs font-bold whitespace-nowrap ${operatorStyling} transition-all duration-300 group-hover:scale-105 group-hover:brightness-110`}
            > */}
              {/* <span className="rounded-md bg-black/20 px-2 py-1 backdrop-blur-sm"> */}
              <span
                className={`rounded-md bg-black/20 px-2 py-1 backdrop-blur-sm ${operatorStyling.brand} shadow-md`}
              >
                {operator}
              </span>
            </span>
          </div>

          {/* Icons Row - Fixed Position */}
          <div className="mt-3 flex gap-4 text-gray-300 group-hover:text-white">
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
          <div className="relative h-50 w-full">
            <img
              src={imageUrl}
              alt={model}
              className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
              onError={(e) => (e.currentTarget.style.display = "none")}
              onLoad={() => setImageLoaded(true)}
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

      {/* Skeleton overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col p-6 transition-opacity duration-500 ease-out ${isLoading || !imageLoaded ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={true}
      >
        <div className="mb-4 h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-36 animate-pulse rounded bg-gray-300/80" />
              <div className="ml-2 h-3 w-20 animate-pulse rounded bg-gray-300/70" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-300/80" />
          </div>

          <div className="mt-3 flex gap-4">
            <div className="h-4 w-10 animate-pulse rounded bg-gray-300/70" />
            <div className="h-4 w-10 animate-pulse rounded bg-gray-300/70" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-300/70" />
          </div>
        </div>

        <div className="relative mb-4 flex flex-1 items-center justify-center">
          <div className="h-50 w-full animate-pulse rounded-md bg-gray-200/80" />
        </div>

        <div className="relative mt-auto space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-300/70" />
          <div className="h-6 w-28 animate-pulse rounded bg-gray-300/80" />
        </div>
      </div>

      {/* Hover Ring */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-blue-400/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400/50" />
    </div>
  );
};

export default RentalCard;
