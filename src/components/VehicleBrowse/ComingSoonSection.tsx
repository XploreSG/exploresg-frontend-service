import React from "react";

const ComingSoonSection: React.FC = () => {
  return (
    <div className="mt-16">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <span className="text-4xl">🚗</span>
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        More Vehicles Coming Soon
      </h2>
      <p className="mt-4 text-gray-600">
        We're working hard to bring you more rental options. Stay tuned for
        motorcycles, luxury cars, and more!
      </p>
    </div>
  );
};

export default ComingSoonSection;
