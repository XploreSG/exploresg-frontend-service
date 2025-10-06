import React from "react";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    quote:
      "ExploreSG helped us design a week-long itinerary that showed off Singapore beyond the tourist hotspots — our guests loved it.",
    rating: 5,
    name: "Aisha Rahman",
    role: "Head of Product",
    company: "Lion City Tours",
    initials: "LC",
    color: "bg-rose-50 text-rose-600",
  },
  {
    quote:
      "ExploreSG helped us design a week-long itinerary that showed off Singapore beyond the tourist hotspots — our guests loved it.",
    rating: 5,
    name: "Aisha Rahman",
    role: "Head of Product",
    company: "Lion City Tours",
    initials: "LC",
    color: "bg-rose-50 text-rose-600",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    quote:
      "Booking and payment flows were clear and fast — conversions increased within days.",
    rating: 5,
    name: "Marcus Lim",
    role: "Growth Lead",
    company: "Marina Experiences",
    initials: "ME",
    color: "bg-amber-50 text-amber-600",
  },
  {
    quote:
      "The local guides we sourced through ExploreSG were delightful — professional and passionate.",
    rating: 5,
    name: "Priya Nair",
    role: "Operations Manager",
    company: "Hidden Gems SG",
    initials: "HG",
    color: "bg-teal-50 text-teal-600",
  },
  {
    quote:
      "The mobile-first layout and offline maps made exploring small neighborhoods effortless.",
    rating: 5,
    name: "Daniel Wong",
    role: "CTO",
    company: "Urban Wanderers",
    initials: "UW",
    color: "bg-sky-50 text-sky-600",
    avatar:
      "https://images.unsplash.com/photo-1545996124-1b4b9b7e2f6d?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    quote:
      "We partnered with ExploreSG for an event series — the ticketing and support were top-notch.",
    rating: 5,
    name: "Samantha Koh",
    role: "Events Director",
    company: "City Lights Co.",
    initials: "CL",
    color: "bg-violet-50 text-violet-600",
  },
];

// Using the external TestimonialCard component from ./TestimonialCard

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx}>
              <TestimonialCard
                quote={t.quote}
                name={t.name}
                title={`${t.role} | ${t.company}`}
                avatarUrl={t.avatar}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
