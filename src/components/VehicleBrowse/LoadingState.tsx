import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <FaSpinner className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg font-medium text-gray-700">Loading Vehicles...</p>
      </div>
    </div>
  );
};

export default LoadingState;
