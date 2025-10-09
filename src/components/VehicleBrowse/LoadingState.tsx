import React from "react";
import InlineLogoLoader from "../InlineLogoLoader";

const LoadingState: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <InlineLogoLoader size={72} />
        <p className="text-lg font-medium text-gray-700">Loading Vehicles...</p>
      </div>
    </div>
  );
};

export default LoadingState;
