import React from "react";
import CollectButton from "./CollectButton";

type PlaceType = "attraction" | "event" | "food";

interface ContentCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  distance: string;
  category: string;
  price?: string;
  status?: string;
  type?: PlaceType; // Type of place for gradient theming
  children?: React.ReactNode;
}

// Type-based gradient themes
const getTypeGradient = (type?: PlaceType): string => {
  switch (type) {
    case "attraction":
      // Attractions (Rich Red Gradient)
      return "from-red-300 via-red-400 via-red-500 via-red-600 to-red-700";
    case "event":
      // Events (Rich Blue Gradient)
      return "from-blue-300 via-blue-400 via-blue-500 via-blue-600 to-blue-700";
    case "food":
      // Food (Rich Orange-Red Gradient)
      return "from-orange-300 via-orange-400 via-orange-500 via-orange-600 to-red-500";
    default:
      // Default (Gray/Slate)
      return "from-gray-500 via-slate-400 to-gray-600";
  }
};

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  name,
  description,
  image,
  imageAlt,
  rating,
  distance,
  category,
  price,
  status,
  type,
  children,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const gradientColors = getTypeGradient(type);

  return (
    <div className="group relative h-[34rem] w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-3xl hover:brightness-110">
      {/* Main Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientColors} from-5% via-20% via-40% via-65% to-85%`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent" />
      </div>

      {/* Content (cross-fades with skeleton) */}
      <div
        className={`relative z-10 flex h-full flex-col p-4 transition-opacity duration-500 ease-out sm:p-6 ${!imageLoaded ? "opacity-0" : "opacity-100"}`}
      >
        {/* Image Section - Centered */}
        <div className="relative mb-4 flex h-48 items-center justify-center overflow-hidden rounded-lg">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x300?text=Image+Not+Found";
              setImageLoaded(true);
            }}
          />
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {/* Status Badge (Top-Left) - Overlaid on Image */}
          {status && (
            <div className="absolute top-0 left-0 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 px-2 py-1 shadow-lg drop-shadow-2xl transition-all duration-300 group-hover:scale-110 sm:rounded-2xl sm:px-3">
              <div className="text-center text-xs font-bold text-white sm:text-sm">
                {status}
              </div>
            </div>
          )}

          {/* Price Badge (Top-Right) - Overlaid on Image */}
          {price && (
            <div className="absolute top-0 right-0 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-2 py-1 shadow-lg drop-shadow-2xl transition-all duration-300 group-hover:scale-110 sm:rounded-2xl sm:px-3">
              <div className="text-center text-xs font-bold text-white sm:text-sm">
                {price}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col">
          {/* Header with Rating */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-lg leading-tight font-semibold text-white transition-colors group-hover:text-blue-200 sm:text-xl">
              {name}
            </h3>
            <div className="flex flex-shrink-0 items-center gap-1 rounded-md bg-black/20 px-2 py-1 text-yellow-400 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:brightness-110">
              <span className="text-sm sm:text-base">★</span>
              <span className="text-xs font-semibold sm:text-sm">{rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-3 line-clamp-4 text-sm text-gray-200 transition-colors group-hover:text-white sm:text-base">
            {description}
          </p>

          {/* Footer - Location & Collect Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-300 transition-colors group-hover:text-white sm:text-sm">
              <span>📍</span>
              <span className="font-medium">{distance}</span>
            </div>
            {/* Collect Button */}
            <CollectButton
              id={id}
              name={name}
              type={type || "attraction"}
              variant="full"
            />
          </div>

          {/* Category Tag - Centered at bottom */}
          <div className="mt-3 flex justify-center">
            <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 sm:text-sm">
              {category}
            </span>
          </div>

          {/* Animated Border */}
          <div className="absolute -bottom-2 left-0 h-2 w-0 bg-gradient-to-r from-white/60 via-white/80 to-white/60 transition-all duration-700 group-hover:w-full shadow-lg" />
        </div>

        {children}
      </div>

      {/* Skeleton overlay */}
      <div
        className={`absolute inset-0 z-20 flex flex-col p-4 transition-opacity duration-500 ease-out sm:p-6 ${!imageLoaded ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {/* Image skeleton */}
        <div className="mb-4 h-48 w-full animate-pulse rounded-lg bg-gray-200/80" />

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-300/80 sm:h-6 sm:w-40" />
            <div className="h-5 w-12 animate-pulse rounded bg-gray-300/70 sm:h-6 sm:w-14" />
          </div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-300/70" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300/70" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-300/70 sm:h-4 sm:w-28" />
          <div className="flex justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300/70" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-300/80" />
          </div>
        </div>
      </div>

      {/* Hover Ring */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-blue-400/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400/50" />
    </div>
  );
};

export default ContentCard;
