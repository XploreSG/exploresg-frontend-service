import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-96 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-(--brand-orange) to-orange-600 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">
            Explore Singapore
            <span className="block bg-gradient-to-r from-(--brand-orange) to-orange-400 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300 md:text-2xl">
            Premium car and motorcycle rentals across Singapore. From business
            trips to weekend adventures, travel in comfort and style.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group shadow-xl">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-slate-900"
            >
              View Locations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
