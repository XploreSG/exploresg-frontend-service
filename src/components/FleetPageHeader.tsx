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
    <div className="relative mb-12 min-h-[400px] overflow-hidden rounded-2xl">
      {/* Car Carousel Background */}
      <div className="absolute inset-0 opacity-90">
        <div className="marquee h-full">
          <div className="marquee-track h-full items-center">
            {/* Duplicate images for seamless loop */}
            {[...carImages, ...carImages].map((img, idx) => (
              <div key={idx} className="h-40 flex-shrink-0">
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-contain px-6"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="" />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" /> */}

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[400px] items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="b-4 mt-60 text-4xl font-bold text-gray-900 md:text-5xl">
            {title}
          </h1>
          <p className="text-xl text-gray-700 md:text-2xl">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default FleetPageHeader;
