import { Badge } from "../ui/Badge";
import { Card, CardContent } from "../ui/Card";
import { MapPin, Clock } from "lucide-react";

const LocationsSection = () => {
  const locations = [
    {
      name: "Changi Airport Terminal 1",
      address: "80 Airport Blvd, Singapore 819642",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      available: 18,
      nextReturn: "2 hours",
    },
    {
      name: "Orchard Road Central",
      address: "391 Orchard Rd, Singapore 238873",
      image:
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80",
      available: 12,
      nextReturn: "45 min",
    },
    {
      name: "Marina Bay Financial Centre",
      address: "8 Marina Blvd, Singapore 018981",
      image:
        "https://images.unsplash.com/photo-1508033755347-67bb86c82d95?auto=format&fit=crop&w=600&q=80",
      available: 9,
      nextReturn: "1 hour",
    },
    {
      name: "Sentosa Gateway",
      address: "33 Allanbrooke Rd, Singapore 099981",
      image:
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
      available: 6,
      nextReturn: "3 hours",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-600">
            Pickup Locations
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Convenient Locations Across Singapore
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Pick up your rental vehicle at Singapore's most popular destinations
            and business districts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-bold text-slate-900">
                  {location.name}
                </h3>
                <div className="mb-3 flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-2">{location.address}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-medium text-slate-700">
                      {location.available} available
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Next: {location.nextReturn}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
