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
  Zap,
  Mountain,
  Route,
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import FeaturedBikes from "../components/home/FeaturedBikes";
import LocationsSection from "../components/home/LocationsSection";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "8+ Pickup Locations",
      description:
        "Convenient pickup points across Singapore's top destinations",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Book anytime, pick up anytime with our smart lock system",
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "All rides covered with comprehensive insurance",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Well-maintained bikes from top international brands",
    },
  ];

  const bikeTypes = [
    {
      type: "Electric Bikes",
      icon: Zap,
      description: "Effortless rides with electric assistance",
      color: "from-yellow-400 to-orange-500",
    },
    {
      type: "Mountain Bikes",
      icon: Mountain,
      description: "Perfect for Singapore's park trails",
      color: "from-green-400 to-emerald-500",
    },
    {
      type: "City Bikes",
      icon: Route,
      description: "Comfortable rides through urban areas",
      color: "from-blue-400 to-cyan-500",
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
              Singapore's Premier Bike Rental Experience
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              From Marina Bay to Sentosa, explore Singapore's iconic locations
              with our premium fleet
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

      {/* Bike Types Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-orange-200 bg-orange-50 text-orange-600">
              Our Fleet
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Choose Your Perfect Ride
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {bikeTypes.map((bike, index) => (
              <div key={index} className="group cursor-pointer">
                <Card className="overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-2xl">
                  <CardContent className="p-0">
                    <div
                      className={`h-32 bg-gradient-to-r ${bike.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                    >
                      <bike.icon className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-slate-900">
                        {bike.type}
                      </h3>
                      <p className="text-slate-600">{bike.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedBikes />
      <LocationsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Explore Singapore?
          </h2>
          <p className="mb-8 text-xl text-teal-100">
            Book your bike in just a few clicks and start your adventure today
          </p>
          <Link to={createPageUrl("BookBike")}>
            <Button
              size="lg"
              className="group bg-white px-8 py-4 text-lg text-teal-600 shadow-xl hover:bg-slate-50"
            >
              Book Your Bike Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
