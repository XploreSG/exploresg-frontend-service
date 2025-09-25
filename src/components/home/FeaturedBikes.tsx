import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

const FeaturedBikes = () => {
  const bikes = [
    {
      id: 1,
      name: "Trek FX 3 Disc",
      type: "Hybrid Bike",
      price: "From $15/hour",
      image:
        "https://images.unsplash.com/photo-1558618068-fccb540caa1d?auto=format&fit=crop&w=600&q=80",
      features: ["21-Speed", "Disc Brakes", "Lightweight Frame"],
    },
    {
      id: 2,
      name: "Giant Escape 3",
      type: "City Bike",
      price: "From $12/hour",
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80",
      features: ["Comfort Riding", "Urban Design", "Easy Handling"],
    },
    {
      id: 3,
      name: "Specialized Turbo Vado",
      type: "Electric Bike",
      price: "From $25/hour",
      image:
        "https://images.unsplash.com/photo-1544191696-15693072e4d5?auto=format&fit=crop&w=600&q=80",
      features: ["Electric Assist", "Long Range", "Smart Features"],
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
            Premium Bikes for Every Adventure
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Choose from our carefully curated selection of top-quality bikes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {bikes.map((bike) => (
            <Card
              key={bike.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {bike.name}
                    </h3>
                    <p className="text-slate-600">{bike.type}</p>
                  </div>
                  <Badge variant="success">{bike.price}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bike.features.map((feature, index) => (
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

export default FeaturedBikes;
