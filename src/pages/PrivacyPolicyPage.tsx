import React, { useRef } from "react";
import { usePageAnimations } from "../hooks/usePageAnimations";

const PrivacyPolicyPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  usePageAnimations({
    heroRef,
    contentRef: sectionsRef,
    contentSelector: "section",
    staggerDelay: 0.1
  });
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-16 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6 lg:p-8">
          <div ref={heroRef}>
            <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl lg:text-4xl">Privacy Policy</h1>
          </div>
          
          <div ref={sectionsRef} className="prose prose-lg max-w-none">
            <p className="mb-6 text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6 sm:mb-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-4 sm:text-2xl">1. Information We Collect</h2>
              <p className="mb-4 text-gray-700">
                We collect information you provide directly to us, such as when you create an account, 
                make a booking, or contact us for support.
              </p>
              <ul className="mb-4 ml-6 list-disc text-gray-700">
                <li>Personal information (name, email, phone number)</li>
                <li>Booking and reservation details</li>
                <li>Payment information (processed securely)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">2. How We Use Your Information</h2>
              <p className="mb-4 text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="mb-4 ml-6 list-disc text-gray-700">
                <li>Provide and improve our services</li>
                <li>Process bookings and payments</li>
                <li>Send you important updates about your reservations</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">3. Information Sharing</h2>
              <p className="mb-4 text-gray-700">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">4. Data Security</h2>
              <p className="mb-4 text-gray-700">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">5. Your Rights</h2>
              <p className="mb-4 text-gray-700">
                You have the right to:
              </p>
              <ul className="mb-4 ml-6 list-disc text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">6. Contact Us</h2>
              <p className="mb-4 text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="rounded-lg bg-gray-100 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@exploresg.com<br />
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

export default PrivacyPolicyPage;
