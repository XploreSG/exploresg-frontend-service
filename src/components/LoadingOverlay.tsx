import React from "react";
import { useLoading } from "../hooks/useLoading";

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    // absolute so it fills the nearest positioned parent (we'll place this inside <main className="relative">)
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-rotate-bounce">
          <img
            src="/icon_s.png"
            alt="ExploreSG logo"
            className="h-16 w-16 rounded-full bg-white p-4 shadow-xl shadow-red-800"
          />
        </div>
        <div className="text-sm text-gray-700">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
