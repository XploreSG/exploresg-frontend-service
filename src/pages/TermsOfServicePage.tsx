import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TermsOfServicePage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section entrance
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
      });

      // Scroll-triggered animations for sections
      gsap.from(sectionsRef.current?.querySelectorAll("section") || [], {
        scrollTrigger: {
          trigger: sectionsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-16 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6 lg:p-8">
          <div ref={heroRef}>
            <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl lg:text-4xl">Terms of Service</h1>
          </div>
          
          <div ref={sectionsRef} className="prose prose-lg max-w-none">
            <p className="mb-6 text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6 sm:mb-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-4 sm:text-2xl">1. Acceptance of Terms</h2>
              <p className="mb-4 text-gray-700">
                By accessing and using ExploreSG services, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">2. Use License</h2>
              <p className="mb-4 text-gray-700">
                Permission is granted to temporarily download one copy of ExploreSG materials for 
                personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">3. Booking and Reservations</h2>
              <p className="mb-4 text-gray-700">
                When making bookings through our platform:
              </p>
              <ul className="mb-4 ml-6 list-disc text-gray-700">
                <li>All bookings are subject to availability</li>
                <li>Prices are subject to change without notice</li>
                <li>Cancellation policies apply as specified</li>
                <li>Valid identification may be required</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">4. Payment Terms</h2>
              <p className="mb-4 text-gray-700">
                Payment is required at the time of booking unless otherwise specified. 
                We accept major credit cards and other approved payment methods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">5. User Responsibilities</h2>
              <p className="mb-4 text-gray-700">
                Users are responsible for:
              </p>
              <ul className="mb-4 ml-6 list-disc text-gray-700">
                <li>Providing accurate information</li>
                <li>Maintaining the security of their account</li>
                <li>Complying with all applicable laws</li>
                <li>Respecting other users and service providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">6. Limitation of Liability</h2>
              <p className="mb-4 text-gray-700">
                In no event shall ExploreSG or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on ExploreSG's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">7. Modifications</h2>
              <p className="mb-4 text-gray-700">
                ExploreSG may revise these terms of service at any time without notice. 
                By using this website, you are agreeing to be bound by the then current 
                version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">8. Governing Law</h2>
              <p className="mb-4 text-gray-700">
                These terms and conditions are governed by and construed in accordance with the 
                laws of Singapore and you irrevocably submit to the exclusive jurisdiction of 
                the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">9. Contact Information</h2>
              <p className="mb-4 text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="rounded-lg bg-gray-100 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@exploresg.com<br />
                  <strong>Phone:</strong> +65 1234 5678<br />
                  <strong>Address:</strong> 123 Singapore Street, Singapore 123456
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
