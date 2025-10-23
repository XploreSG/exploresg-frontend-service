import React from "react";

interface ContentCardProps {
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
  children?: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({
  name,
  description,
  image,
  imageAlt,
  rating,
  reviews,
  distance,
  category,
  price,
  status,
  children
}) => {
  return (
    <div className="page-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 w-full">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
          style={{ aspectRatio: "4/3" }}
        />
        {price && (
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold shadow-md">
            {price}
          </div>
        )}
        {status && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            {status}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <div className="flex items-center text-yellow-500">
            <span className="mr-1">★</span>
            <span className="font-semibold">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <span className="mr-2">📍</span>
          <span>{distance}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">({reviews} reviews)</span>
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
