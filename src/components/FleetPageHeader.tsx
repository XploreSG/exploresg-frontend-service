import React from "react";

interface FleetPageHeaderProps {
  title?: string;
  subtitle?: string;
  carImages?: string[];
}

const FleetPageHeader: React.FC<FleetPageHeaderProps> = ({
  title = "WHICH CAR DO YOU WANT TO DRIVE?",
  subtitle = "Two or Four Wheels, Discover Singapore, Your Way!",
  carImages = [
    "/assets/cars/bmw-440i.png",
    "/assets/cars/maserati-grecale.png",
    "/assets/cars/porsche-911-c.png",
    "/assets/cars/merc-sl63.png",
    "/assets/cars/bmw-z4.png",
    "/assets/cars/mini-cooper.png",
    "/assets/cars/peugeot-5008.png",
    "/assets/cars/bmw-x3.png",
    "/assets/cars/vw-golf.png",
    "/assets/cars/skoda-octavia.png",
    "/assets/cars/nissan-sentra.png",
  ],
}) => {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl py-16">
      {/* Car Carousel Background */}
      <div className="absolute inset-0">
        <div className="marquee h-full">
          <div className="marquee-track h-full items-center">
            {/* Original set */}
            {carImages.map((img, idx) => (
              <div key={`orig-${idx}`} className="h-48 w-48 flex-shrink-0">
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
            {/* Duplicated set for smooth loop */}
            {carImages.map((img, idx) => (
              <div key={`dup-${idx}`} className="h-48 w-48 flex-shrink-0">
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end justify-center text-center">
        <div className="">
          <h1 className="mt-40 mb-4 text-4xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-xl text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default FleetPageHeader;
