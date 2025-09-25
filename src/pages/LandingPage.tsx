import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/helpers";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  MapPin,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Car,
  Bike,
  Truck,
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import FeaturedVehicles from "../components/home/FeaturedVehicles";
import LocationsSection from "../components/home/LocationsSection";

export default function LandingPage() {
  const features = [
    {
      icon: MapPin,
      title: "15+ Pickup Locations",
      description:
        "Convenient pickup points across Singapore's key districts and airports",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service and roadside assistance",
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Comprehensive coverage for cars, motorcycles, and riders",
    },
    {
      icon: Star,
      title: "Premium Fleet",
      description: "Latest models from BMW, Mercedes, Yamaha, and Honda",
    },
  ];

  const vehicleTypes = [
    {
      type: "Luxury Cars",
      icon: Car,
      description: "Premium sedans and SUVs for comfort and style",
      color: "from-blue-500 to-indigo-600",
    },
    {
      type: "Motorcycles",
      icon: Bike,
      description: "Agile bikes perfect for Singapore's traffic",
      color: "from-red-500 to-pink-600",
    },
    {
      type: "Commercial Vehicles",
      icon: Truck,
      description: "Vans and trucks for business and moving needs",
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-600">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Singapore's Premier Vehicle Rental Experience
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              From business trips to weekend getaways, explore Singapore with
              our premium cars and motorcycles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-orange-200 bg-orange-50 text-(--brand-orange)">
              Our Fleet
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Choose Your Perfect Vehicle
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {vehicleTypes.map((vehicle, index) => (
              <div key={index} className="group cursor-pointer">
                <Card className="overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <CardContent className="p-0">
                    <div
                      className={`h-32 bg-gradient-to-r ${vehicle.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                    >
                      <vehicle.icon className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-slate-900">
                        {vehicle.type}
                      </h3>
                      <p className="text-slate-600">{vehicle.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedVehicles />
      <LocationsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Hit the Road?
          </h2>
          <p className="mb-8 text-xl text-teal-100">
            Book your perfect vehicle in just a few clicks and start your
            Singapore journey today
          </p>
          <Link to={createPageUrl("BookBike")}>
            <Button
              size="lg"
              className="group bg-white px-8 py-4 text-lg text-teal-600 shadow-xl hover:bg-slate-50"
            >
              Book Your Vehicle Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
