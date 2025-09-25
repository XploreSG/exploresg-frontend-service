import { Badge } from "../ui/Badge";
import { Card, CardContent } from "../ui/Card";
import { MapPin, Clock } from "lucide-react";

const LocationsSection = () => {
  const locations = [
    {
      name: "Marina Bay Sands",
      address: "10 Bayfront Ave, Singapore 018956",
      image:
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80",
      available: 12,
      nextReturn: "15 min",
    },
    {
      name: "Sentosa Island",
      address: "Sentosa Island, Singapore",
      image:
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
      available: 8,
      nextReturn: "25 min",
    },
    {
      name: "Gardens by the Bay",
      address: "18 Marina Gardens Dr, Singapore 018953",
      image:
        "https://images.unsplash.com/photo-1508033755347-67bb86c82d95?auto=format&fit=crop&w=600&q=80",
      available: 15,
      nextReturn: "10 min",
    },
    {
      name: "Clarke Quay",
      address: "3 River Valley Rd, Singapore 179024",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80",
      available: 6,
      nextReturn: "30 min",
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
            Find bikes at Singapore's most popular destinations and attractions
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
