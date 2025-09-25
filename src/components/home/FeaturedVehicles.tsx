import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

const FeaturedVehicles = () => {
  const vehicles = [
    {
      id: 1,
      name: "BMW 320i",
      type: "Luxury Sedan",
      price: "From $80/day",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
      features: ["Leather Interior", "GPS Navigation", "Premium Sound"],
    },
    {
      id: 2,
      name: "Mercedes C-Class",
      type: "Executive Car",
      price: "From $90/day",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
      features: ["Automatic", "Air Conditioning", "Bluetooth"],
    },
    {
      id: 3,
      name: "Yamaha MT-09",
      type: "Sport Motorcycle",
      price: "From $45/day",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80",
      features: ["847cc Engine", "ABS Brakes", "Digital Display"],
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-orange-200 bg-orange-50 text-(--brand-orange)">
            Featured Fleet
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Premium Vehicles for Every Journey
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Choose from our carefully curated selection of luxury cars and
            motorcycles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {vehicle.name}
                    </h3>
                    <p className="text-slate-600">{vehicle.type}</p>
                  </div>
                  <Badge variant="success">{vehicle.price}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
