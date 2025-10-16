import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="rounded-2xl bg-white p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center justify-center sm:justify-start">
                <img
                  className="h-8 pr-2 sm:h-10"
                  src="/icon_s.png"
                  alt="ExploreSG logo"
                />
                <h1
                  className="font-bold text-red-600"
                  style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
                >
                  ExploreSG
                </h1>
              </div>

              <p
                className="mt-3 text-center text-gray-700 sm:mt-4 sm:text-left"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
              >
                <span className="font-medium">Discover</span> the best of
                Beautiful{" "}
                <span className="font-bold text-red-500">Singapore</span>. From
                iconic attractions to hidden neighbourhood gems, great food, and
                local experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                Quick Links
              </h3>
              <ul className="mt-3 space-y-2 sm:mt-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Attractions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Food & Dining
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-left">
              <h3
                className="font-semibold text-gray-800"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}
              >
                Contact
              </h3>
              <ul className="mt-3 space-y-2 sm:mt-4">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition-colors hover:text-teal-600"
                    style={{ fontSize: "clamp(0.875rem, 2vw, 0.938rem)" }}
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6 sm:mt-8 sm:pt-8">
            <p
              className="text-center text-gray-500"
              style={{ fontSize: "clamp(0.813rem, 1.8vw, 0.875rem)" }}
            >
              © 2025 ExploreSG. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
